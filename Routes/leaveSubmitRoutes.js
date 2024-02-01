const express = require('express')
const leaveSubmitController = require('../Controllers/leaveSubmitController')
const router = express.Router()


router.post('/leaveSubmit', leaveSubmitController.submitLeave)

module.exports = router;