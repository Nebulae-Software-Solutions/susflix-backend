const { Movie } = require('../db')
const { Op } = require('sequelize')
const sequelize = require('sequelize')

const { compressSync } = require("node-zpaq");

const { lzma, lpaq1, xwrt } = require('../utils')
const { paramsNormalization } = require('../utils/index.js')


const get = async (req, res) => {

    // #########################################################################
    // by id:
    const { id } = req.params
    if (id) {
        try {
            const movie = await Movie.findByPk(id)
            if (movie) {
                res.json({ status: 'success', data: movie })
            } else {
                res.status(404).json({ status: 'error', message: 'Movie not found' })
            }
        } catch (error) {
            console.log("Something went wrong: ")
            res.status(500).json({ error: error.message })
        }
        return
    }


    // #########################################################################
    // complex search:
    var { title, year, genre, rating,
        order_by, sort, limit, page, offset } = paramsNormalization(req.query)

    const where = {}

    if (title) where.title = { [Op.iLike]: `%${title}%` }   // iLike: case insensitive
    if (year) where.year = { [Op.between]: year }
    if (genre) where.genres = { [Op.overlap]: genre }
    if (rating) where.rating = { [Op.between]: rating }


    try {
        const movies = await Movie.findAll({
            where,
            // We need to sort the movies by the order_by parameter, and in the direction of the sort parameter
            order: order_by && sort && [sequelize.literal(`${order_by} ${sort}`)], // Just so we don't send only one of them
            limit,
            offset,
        })

        const count = await Movie.count({ where })

        // Auxiliar function to calculate the next and previous pages based on the number of movies and the limit:
        const prevAndNext = (page, limit) => {
            const prev = page - 1
            const next = page + 1
            const searchStr = identifier => 
                `/search?${Object.entries({ ...req.query, page: identifier, limit }).map(([key, value]) => `${key}=${value}`).join('&')}`
            return {
                prev: prev > 0 ? searchStr(prev) : null,
                next: next <= Math.ceil(count / limit) ? searchStr(next) : null
            }
        }

        const response = {
            status: 'success',
            total: count,
            here: movies.length,
            page,
            pages: Math.ceil(count / limit),
            prev: prevAndNext(page, limit).prev,
            next: prevAndNext(page, limit).next,
            data: movies.sort((a, b) => a.title_long.localeCompare(b.title_long))
        }

        if (req.headers['accept-encoding-extra'] === 'lzma') {
            const compressedResponse = await lzma(JSON.stringify(response))
            console.log({ lzma: compressedResponse.length })
            res.setHeader('Content-Encoding-Extra', 'lzma')
            return res.send(compressedResponse)
        }
        if (req.headers['accept-encoding-extra'] === 'lpaq1') {
            // if (true) {
            lpaq1.compress(JSON.stringify(response), 1, compressedResponse => {
                console.log({ lpaq1: compressedResponse.length })
                res.setHeader('Content-Encoding-Extra', 'lpaq1')
                // compressedResponse = Buffer.from(compressedResponse)
                res.send(compressedResponse)
            }, () => { })
            return
        }
        if (req.headers['accept-encoding-extra'] === 'zpaq') {
            const bufferedResponse = new Buffer.from(JSON.stringify(response))
            const compressedResponse = compressSync(bufferedResponse, { method: "43", sha1: true })
            // const compressedResponse = compressSync(bufferedResponse, { method: "5", sha1: true })
            console.log({ zpaq: compressedResponse.length })
            res.setHeader('Content-Encoding', 'zpaq')
            return res.send(compressedResponse)
        }
        if (req.headers['accept-encoding-extra'] === 'xwrt') {
            const compressedResponse = await xwrt(JSON.stringify(response), 'l10')
            console.log({ xwrt: compressedResponse.length })
            res.setHeader('Content-Encoding-Extra', 'xwrt')
            return res.send(compressedResponse)
        }

        else res.json(response)

    } catch (error) {
        console.log("Something went wrong: ")
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    get,
}
