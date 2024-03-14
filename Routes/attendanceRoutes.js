const express = require("express");
const router = express.Router();
const AttendanceController = require("../Controllers/attendanceController");

router.post("/attendance", AttendanceController.createAttendance);
router.post("/attendance/signin", AttendanceController.signin);

router.get("/attendance", AttendanceController.getAllAttendance);

router.get("/attendance/:id", AttendanceController.getAttendanceById);

router.put("/attendance/:id", AttendanceController.updateAttendance);
router.put("/attendance/signout/:id", AttendanceController.signout);

router.delete("/attendance/:id", AttendanceController.deleteAttendance);

module.exports = router;
