const express = require('express')
const { createUser, loginUser, logoutUser, forgotPassword, resetPassword } = require('../controllers/userController')
const router = express.Router()


router.route('/user/create').post(createUser)
router.route('/user/login').post(loginUser)
router.route('/user/forgot').post(forgotPassword)
router.route('/user/reset/:token').put(resetPassword)
router.route('/user/logout').post(logoutUser)

module.exports = router;

