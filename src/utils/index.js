// const downloadAndSaveMovies = require('./getAPIinfo')
const downloadAndSaveMovies = require('./getAPIinfoInParallel.js')
const paramsNormalization = require('./searchParamsNormalization')

module.exports = {
    downloadAndSaveMovies,
    paramsNormalization
}