const { Router } = require('express');
const { get, movieId } = require('../controllers/moviesControllers');

const router = Router();

router.get('/', get)
router.get('/:id', movieId)

module.exports = router;
