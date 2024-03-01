const express = require('express');
const router = express.Router();
const leaveRequestController = require('../Controllers/leaveRequestController');

// Route to create a leave request
router.post('/leave-request', leaveRequestController.createLeaveRequest);

// Route to get all leave requests
router.get('/leave-requests', leaveRequestController.getAllLeaveRequests);

// Route to get a leave request by ID
router.get('/leave-request/:id', leaveRequestController.getLeaveRequestById);

// Route to update a leave request by ID
router.put('/leave-request/:id', leaveRequestController.updateLeaveRequest);

// Route to delete a leave request by ID
router.delete('/leave-request/:id', leaveRequestController.deleteLeaveRequest);

module.exports = router;
