const { Router } = require('express');
const { get } = require('../controllers/searchControllers');

const router = Router();

router.get('/', get)

module.exports = router;
