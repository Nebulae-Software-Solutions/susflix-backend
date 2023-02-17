const { Router } = require('express')
const router = Router()
var mcache = require('memory-cache')

const authRouter = require('./auth')
const userRouter = require('./users')
const genresRouter = require('./genres')
const searchRouter = require('./search')

const { downloadAndSaveMovies } = require('../utils')

// Cache middleware
const cache = (duration) => {
  return (req, res, next) => {
    // This is the cache key, you can use any string but here it is the url
    const key = '__express__'
      + (req.originalUrl || req.url)
      + (req.rawHeaders.filter((header) => ['xwrt', 'zpaq', 'lzma', 'lpaq1'].includes(header)) || 'no-custom-header')
    const cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000)
        res.sendResponse(body)
      }
      next()
    }
  }
}



router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/genres', cache(60 * 60 * 24), genresRouter)
router.use('/search', cache(60 * 60 * 24), searchRouter)
router.use('/update', (req, res) => {
  downloadAndSaveMovies(req.query.limit)
  res.send('Updating movies')
})

router.get('*', (_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

module.exports = router
