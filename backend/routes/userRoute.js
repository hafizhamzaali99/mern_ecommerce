const express = require('express')
const { createUser, loginUser, logoutUser, forgotPassword } = require('../controllers/userController')
const router = express.Router()


router.route('/user/create').post(createUser)
router.route('/user/login').post(loginUser)
router.route('/user/forgotPassword').post(forgotPassword)
router.route('/user/logout').post(logoutUser)

module.exports = router;

