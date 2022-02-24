const { Router } = require('express');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const userRouter = require('./users');
const moviesRouter = require('./movies');
const genresRouter = require('./genres');

router.use('/user', userRouter);
router.use('/movies', moviesRouter);
router.use('/genres', genresRouter);

module.exports = router;
