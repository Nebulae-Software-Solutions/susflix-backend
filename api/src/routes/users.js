const { Router } = require('express');
const { post } = require('../controllers/userControllers');

const router = Router();

router.post('/', post)

module.exports = router;