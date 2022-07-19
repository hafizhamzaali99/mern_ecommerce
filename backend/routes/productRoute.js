const express = require('express')
const { getAllproducts } = require('../controllers/ProductController')
const router = express.Router()

router.route('/products').get(getAllproducts)

module.exports = router;