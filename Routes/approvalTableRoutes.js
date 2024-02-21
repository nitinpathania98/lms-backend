const express = require('express');
const router = express.Router();
const approvalHistoryController = require('../Controllers/approvalHistoryController');

// Route to create an approval table entry
router.post('/approval', approvalHistoryController.createApprovalHistory);

// Route to get all approval table entries
router.get('/approvals', approvalHistoryController.getAllApprovalHistory);

// Route to get an approval table entry by ID
router.get('/approval/:id', approvalHistoryController.getApprovalHistoryById);

module.exports = router;