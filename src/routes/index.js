const { Router } = require('express');
const router = Router();
var mcache = require('memory-cache');

// Cache middleware
var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}


// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const authRouter = require('./auth');
const userRouter = require('./users');
const genresRouter = require('./genres');
const searchRouter = require('./search');

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/genres', cache(60*60*24), genresRouter);
router.use('/search', cache(60*60*24), searchRouter);

module.exports = router;
