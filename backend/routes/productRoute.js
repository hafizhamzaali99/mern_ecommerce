const express = require('express')
const { getAllproducts, createProduct, updateProduct, deleteProduct, productDetail, searchProduct } = require('../controllers/ProductController')
const { isAuthenticatedUser, authorizeRole } = require('../middleware/auth')
const router = express.Router()

// router.route('/products',isAuthenticatedUser)
router.route('/products').get(getAllproducts)
router.route('/product/:key').get(searchProduct)
router.route('/product/new').post(isAuthenticatedUser,authorizeRole('admin'), createProduct)
router.route('/product/:id').put(isAuthenticatedUser, authorizeRole('admin'), updateProduct).delete(isAuthenticatedUser,authorizeRole('admin'), deleteProduct).get(productDetail)

module.exports = router;