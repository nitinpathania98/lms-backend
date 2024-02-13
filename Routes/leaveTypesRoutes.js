const express = require('express');
const router = express.Router();
const leaveTypesController = require('../Controllers/leaveTypesController');


// POST /leaveType - Submit leave
router.post('/submitLeaveTypes', leaveTypesController.submitLeaveTypes);

// GET /leave/leaveTypedetails - Get leave details
router.get('/leaveTypesDetails', leaveTypesController.getLeaveTypesDetails);
module.exports = router;