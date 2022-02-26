const { Router } = require('express');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const userRouter = require('./users');
const moviesRouter = require('./movies');
const genresRouter = require('./genres');
const searchRouter = require('./search');

router.use('/user', userRouter);
router.use('/movies', moviesRouter);
router.use('/genres', genresRouter);
router.use('/search', searchRouter);

module.exports = router;
