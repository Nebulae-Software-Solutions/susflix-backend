const { Router } = require('express');
const { get } = require('../controllers/searchControllers');

const router = Router();

router.get('/:id', get)
router.get('/', get)

module.exports = router;
