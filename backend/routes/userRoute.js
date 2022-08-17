const express = require('express')
const { createUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails } = require('../controllers/userController')
const { isAuthenticatedUser } = require('../middleware/auth')
const router = express.Router()


router.route('/user/create').post(createUser)
router.route('/user/login').post(loginUser)
router.route('/user/forgot').post(forgotPassword)
router.route('/user/reset/:token').put(resetPassword)
router.route('/user/logout').post(logoutUser)
router.route('/user/me').get(isAuthenticatedUser,getUserDetails)
router.route('/user/update').put(isAuthenticatedUser,getUserDetails)

module.exports = router;

