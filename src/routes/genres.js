const { Router } = require('express')
const { get } = require('../controllers/genresControllers')

const router = Router()

router.get('/', get)

module.exports = router
