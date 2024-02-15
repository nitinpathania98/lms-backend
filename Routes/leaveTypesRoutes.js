const express = require('express');
const router = express.Router();
const leaveTypesController = require('../Controllers/leaveTypesController');

router.post('/', leaveTypesController.submitLeaveTypes);
router.get('/', leaveTypesController.getLeaveTypesDetails);

module.exports = router;