const express = require('express');
const notificationLogController = require('../Controllers/notificationLogController');

const router = express.Router();

// Create Notification Log
router.post('/notificationLog/create', notificationLogController.createNotificationLog);

// Get All Notification Logs
router.get('/notificationLog/getAll', notificationLogController.getAllNotificationLogs);

// Get Notification Log By ID
router.get('/notificationLog/getById/:id', notificationLogController.getNotificationLogById);

// Update Notification Log
router.put('/notificationLog/update/:id', notificationLogController.updateNotificationLog);

// Delete Notification Log
router.delete('/notificationLog/delete/:id', notificationLogController.deleteNotificationLog);

module.exports = router;
