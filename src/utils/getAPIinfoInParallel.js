const { Movie } = require('../db.js')

const axios = require('axios')
const progressBar = require('progress-barjs')


const downloadAndSaveMovies = async (totalMoviesLimit = 5000) => {

    const compose = (...fns) => fns.reduce((f, g) => async (...args) => f(await g(...args)))

    const API = {
        BASE_URL: 'https://yts.am/api/v2/list_movies.json',
        PARAMS: { limit: 50, page: 1, sort_by: "date_added" },
    }

    const get = async (url, retries = 25) => {
        try { return await axios.get(url, { timeout: 2_500 }) }
        catch {
            if (retries > 0) { return get(url, retries - 1) }
            else { console.log(`Error downloading ${url}`) }
        }
    }
    const pick = (obj, parts) => parts.split('.').reduce((o, p) => o[p], obj)
    const pickMovies = e => pick(e, 'data.data.movies')
    const pickMovieCount = e => pick(e, 'data.data.movie_count')
    const sanitize = movies => movies.map(movie => ({
        id: movie?.id,
        imdb_code: movie?.imdb_code,
        title: movie?.title,
        title_long: movie?.title_long,
        year: movie?.year,
        rating: movie?.rating,
        runtime: movie?.runtime,
        genres: movie?.genres,
        synopsis: movie?.synopsis,
        description_full: movie?.description_full,
        yt_trailer_code: movie?.yt_trailer_code,
        language: movie?.language,
        small_cover_image: movie?.small_cover_image,
        medium_cover_image: movie?.medium_cover_image,
        large_cover_image: movie?.large_cover_image,
        background_image: movie?.background_image,
        background_image_original: movie?.background_image_original,
    }))

    const allMovies = new Set()
    const dedupe = movies => {
        const output = movies.filter(movie => !allMovies.has(`${movie.id} - ${movie.title}`))
        movies.forEach(movie => allMovies.add(`${movie.id} - ${movie.title}`))
        return output
    }

    const saveToDB = async movies => await Movie
        .bulkCreate(movies, { updateOnDuplicate: Object.keys(Movie.tableAttributes) })
        .then(() => movies)

    const showProgress = movies => {
        movies.forEach(() => { bar.tick('') })
    }

    const totalMoviesInAPI = await get(`${API.BASE_URL}?limit=1`).then(pickMovieCount)
    const totalPagesInAPI = Math.ceil(totalMoviesInAPI / API.PARAMS.limit)
    const totalPagesLimit = Math.ceil(totalMoviesLimit / API.PARAMS.limit)
    const totalPages = totalPagesInAPI < totalPagesLimit
        ? totalPagesInAPI : totalPagesLimit
    const totalMovies = totalPages * API.PARAMS.limit < totalMoviesInAPI
        ? totalPages * API.PARAMS.limit : totalMoviesInAPI

    const bar = progressBar({
        label: 'Downloading movie info',
        total: totalMovies,
        show: {
            bar: {
                length: 75,
                completed: '*',
                incompleted: ' '
            }
        }
    })

    const allPages = Array.from({ length: totalPages }, (v, k) => k + 1)
    const allPagesPromises = pages => pages.map(async p => {
        API.PARAMS.page = p
        await compose(
            showProgress,
            saveToDB,
            dedupe,
            sanitize,
            pickMovies,
            get
        )(`${API.BASE_URL}?${Object.entries(API.PARAMS).map(([k, v]) => `${k}=${v}`).join('&')}`)
    })

    for (let i = 0; i < allPages.length; i += 15) {
        await Promise.allSettled(allPagesPromises(allPages.slice(i, i + 15)))
    }
    showProgress(Array.from({ length: totalMovies - allMovies.size }, () => ''))

    console.log(`Downloaded details about ${totalMovies} movies, ${allMovies.size} unique saved to the database.`)
}


module.exports = downloadAndSaveMovies
