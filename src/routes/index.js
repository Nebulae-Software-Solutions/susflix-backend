const { Router } = require('express')
const router = Router()
var mcache = require('memory-cache')

const authRouter = require('./auth')
const userRouter = require('./users')
const genresRouter = require('./genres')
const searchRouter = require('./search')

// Cache middleware
var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url // This is the cache key, you can use any string but here it is the url
    let cachedBody = mcache.get(key)
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

module.exports = router
