const express = require('express');
const router = express.Router();
const leaveController = require('../Controllers/leaveController');

router.post('/', leaveController.submitLeave);
router.get('/', leaveController.getLeaveDetails);

module.exports = router;