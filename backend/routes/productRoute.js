const express = require('express')
const { getAllproducts, createProduct, updateProduct, deleteProduct, productDetail, searchProduct } = require('../controllers/ProductController')
const { isAuthenticatedUser, authorizeRole } = require('../middleware/auth')
const router = express.Router()

// router.route('/products',isAuthenticatedUser)
router.route('/products').get(getAllproducts)

router.route('/product/:key').get(searchProduct)

router.route('/admin/product/new')
    .post(isAuthenticatedUser,authorizeRole('admin'), createProduct)

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRole('admin'), updateProduct)
    .delete(isAuthenticatedUser,authorizeRole('admin'), deleteProduct)
    
router.route('/product/:id').get(productDetail)

module.exports = router;