// const downloadAndSaveMovies = require('./getAPIinfo')
const downloadAndSaveMovies = require('./getAPIinfoInParallel')
const paramsNormalization = require('./searchParamsNormalization')
const lzma = require('./lzma')
const lpaq1 = require('./lpaq1')
const xwrt = require('./xwrt')

module.exports = {
    downloadAndSaveMovies,
    paramsNormalization,
    lzma,
    lpaq1,
    xwrt,
}