const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const userAuth = require('../Middlewares/userAuth');

const { signup, login, getAllUsers, getUserDetails, updateUserDetails } = userController;
const { saveUser, authenticateToken } = userAuth;

router.post('/signup', saveUser, signup);
router.post('/login', login);
router.get('/users', getAllUsers);
router.get('/user/details', authenticateToken, getUserDetails);
router.put('/user/update', authenticateToken, updateUserDetails);

module.exports = router;
