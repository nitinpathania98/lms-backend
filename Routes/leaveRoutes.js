
const express = require('express');
const router = express.Router();
const leaveController = require('../Controllers/leaveController');

// POST /leave - Submit leave
router.post('/submitLeave', leaveController.submitLeave);

// GET /leave/details - Get leave details
router.get('/leaveDetails', leaveController.getLeaveDetails);

module.exports = router;
