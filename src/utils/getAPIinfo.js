const { Movie } = require('../db.js')

const axios = require('axios')
const progressBar = require('progress-barjs')



// Necesitamos:
// 1. Obtener número total de películas. Lo vamos a obtener de la primera página, y sirve para mostrar una barra de progreso.
// 2. Descargar una por una todas las páginas (traen 50 cada una).
// 3. Guardar en la base de datos.


const downloadAndSaveMovies = async (totalMoviesLimit) => {

    const API = {
        BASE_URL: 'https://yts.am/api/v2/list_movies.json',
        PARAMS: { limit: 50, page: 1, sort_by: "date_added" },
    }
    const totalPagesLimit = totalMoviesLimit / API.PARAMS.limit

    // Averiguamos cuántas películas hay disponibles para descargar
    console.log('Getting total number of movies...')
    const { data } = await axios.get(`${API.BASE_URL}?limit=1`)
    const totalMoviesInAPI = data.data.movie_count

    // Limite impuesto manualmente, o número total de películas, lo que sea menor:
    const totalPagesInAPI = Math.ceil(totalMoviesInAPI / API.PARAMS.limit)
    const totalPages = totalPagesInAPI < totalPagesLimit ? totalPagesInAPI : totalPagesLimit

    // Inicializamos la barra de progreso
    const totalMovies =
        totalMoviesLimit < totalMoviesInAPI
            ? totalPages * API.PARAMS.limit
            : totalMoviesInAPI
    const progressBarOptions = {
        label: 'Downloading movie info',
        total: totalMovies,
        show: { overwrite: true }
    }
    const bar = progressBar(progressBarOptions)

    // Función auxiliar para filtrar los datos relevantes:
    const sanitize = (movies) => {

        const filteredData = movies.map(movie => {
            return {
                id: movie.id,
                imdb_code: movie.imdb_code,
                title: movie.title,
                title_long: movie.title_long,
                year: movie.year,
                rating: movie.rating,
                runtime: movie.runtime,
                genres: movie.genres, // Array
                synopsis: movie.synopsis,
                description_full: movie.description_full,
                yt_trailer_code: movie.yt_trailer_code,
                language: movie.language,
                background_image: movie.background_image,
                background_image_original: movie.background_image_original,
                small_cover_image: movie.small_cover_image,
                medium_cover_image: movie.medium_cover_image,
                large_cover_image: movie.large_cover_image,
            }
        })

        return filteredData

    }

    // Función auxiliar para guardar las películas en la base de datos de a 50 en 50
    const saveToDB = async (movies) => {
        movies.forEach(movie => {
            bar.tick(movie.title_long)
            console.log('')
        })
        const savedMovies = await Movie.bulkCreate(
            movies,
            {
                updateOnDuplicate: Object.keys(Movie.tableAttributes),
            }
        )
    }

    // Función auxiliar para descargas las páginas de información
    const pagesThrowingErrors = []
    const getMovies = async (page) => {

        API.PARAMS.page = page
        try {
            const { data } = await axios.get(API.BASE_URL, { params: API.PARAMS })
            const movies = sanitize(data.data.movies)
            saveToDB(movies)
        } catch (error) { pagesThrowingErrors.push(page) }

    }

    // Descargamos las películas, 50 a la vez
    for (let page = 1; page <= totalPages; page++) { await getMovies(page) }

    // Manejo de errores
    while (pagesThrowingErrors.length > 0) {
        const page = pagesThrowingErrors.pop()
        console.log(`Error downloading page ${page}, trying again...`)
        await getMovies(page)
    }

    console.log(`\n${totalMovies} movies saved to the local database\n`)

    return

}


module.exports = downloadAndSaveMovies
