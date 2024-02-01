//importing modules
const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login } = userController
const userAuth = require('../Middlewares/userAuth')

const router = express.Router()

router.post('/signup', userAuth.saveUser, signup)

// Get all user details 
router.get("/users", userController.getAllUsers);

router.get('/user/details', userAuth.authenticateToken, userController.getUserDetails);

//login route
router.post('/login', login)

module.exports = router