const express = require('express');
const router = express.Router();
const leaveController = require('../Controllers/leaveController');

router.post('/leaverequest', leaveController.submitLeave);
router.get('/leaverequest', leaveController.getLeaveDetails);

module.exports = router;