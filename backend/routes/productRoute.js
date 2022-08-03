const express = require('express')
const { getAllproducts, createProduct, updateProduct, deleteProduct, productDetail, searchProduct } = require('../controllers/ProductController')
const { isAuthenticatedUser } = require('../middleware/auth')
const router = express.Router()

// router.route('/products',isAuthenticatedUser)
router.route('/products').get(isAuthenticatedUser,getAllproducts)
router.route('/product/:key').get(searchProduct)
router.route('/product/new').post(createProduct)
router.route('/product/:id').put(updateProduct).delete(deleteProduct).get(productDetail)

module.exports = router;