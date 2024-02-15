const express = require('express');
const router = express.Router();
const profileController = require('../Controllers/profileController');
const userAuth = require('../Middlewares/userAuth');

router.post('/user', userAuth.authenticateToken, profileController.createProfile);
router.get('/user', profileController.getProfileDetails);
router.put('/user/:id', profileController.updateProfile);
router.delete('/user/:id', profileController.deleteProfile);

module.exports = router;
