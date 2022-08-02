const express = require('express')
const { createUser, loginUser } = require('../controllers/userController')
const router = express.Router()


router.route('/user/create').post(createUser)
router.route('/user/login').post(loginUser)

module.exports = router;

