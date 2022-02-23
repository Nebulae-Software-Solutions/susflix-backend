const { Router } = require('express');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const moviesRouter = require('./movies');
const userRouter = require('./users');

router.use('/user', userRouter);
router.use('/movies', moviesRouter);

module.exports = router;
