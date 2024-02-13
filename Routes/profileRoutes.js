// Importing modules
const express = require('express');
const profileController = require('../Controllers/profileController');
const { createProfile, getProfileDetails, updateProfile, deleteProfile } = profileController;

const router = express.Router();

// Create Profile Route
router.post('/user', createProfile);

// Get Profile Details Route
router.get('/user', getProfileDetails);

// Update Profile Route
router.put('/user/:id', updateProfile);

// Delete Profile Route
router.delete('/user/:id', deleteProfile);

module.exports = router;
