const express = require('express')
const { createUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUsers, getSingleUser, updateUserProfile, deleteUserProfile } = require('../controllers/userController')
const { isAuthenticatedUser, authorizeRole } = require('../middleware/auth')
const router = express.Router()


router.route('/user/create').post(createUser)
router.route('/user/login').post(loginUser)
router.route('/user/forgot').post(forgotPassword)
router.route('/user/reset/:token').put(resetPassword)
router.route('/user/logout').post(logoutUser)
router.route('/user/me').get(isAuthenticatedUser,getUserDetails)
router.route('/user/update/password').put(isAuthenticatedUser,updatePassword)
router.route('/user/update/profile').put(isAuthenticatedUser,updateProfile)
router.route('/admin/users').get(isAuthenticatedUser,authorizeRole("admin"),getAllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRole("admin"),getSingleUser)
    .put(isAuthenticatedUser,authorizeRole("admin"),updateUserProfile)
    .delete(isAuthenticatedUser,authorizeRole("admin"),deleteUserProfile)

module.exports = router;

