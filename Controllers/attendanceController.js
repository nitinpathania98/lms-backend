const db = require("../Models");

const AttendanceController = {
  signin: async (req, res) => {
    try {
      const { UserId, timeIn, date } = req.body;

      // Check if an entry for the given date and UserId already exists
      const existingEntry = await db.Attendance.findOne({
        where: {
          UserId,
          date,
        },
      });

      if (existingEntry) {
        // If an entry already exists for the given date and UserId, return an error
        return res.status(400).json({
          error: "Attendance record already exists for this date and user",
        });
      }

      // Save the attendance record to the database using Sequelize model
      const newAttendance = await db.Attendance.create({
        UserId,
        timeIn,
        date,
        status: "Active", // Set status to "Active" upon sign-in
      });

      res.json(newAttendance);
    } catch (error) {
      console.error("Error adding attendance record:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  signout: async (req, res) => {
    try {
      const { timeOut } = req.body;
      const attendanceId = req.params.id;

      // Update the attendance record in the database using Sequelize model
      const attendance = await db.Attendance.findByPk(attendanceId);
      if (!attendance) {
        return res.status(404).json({ error: "Attendance record not found" });
      }

      const currentDate = new Date();
      const timeIn = attendance.timeIn;
      const signOutTime = timeOut;

      // Combine current date with time strings
      const combinedTimeIn = `${currentDate.toDateString()} ${timeIn}`;
      const combinedSignOutTime = `${currentDate.toDateString()} ${signOutTime}`;

      const timeInDate = new Date(combinedTimeIn);
      const signOutDate = new Date(combinedSignOutTime);

      attendance.timeOut = signOutTime;
      const timeDifference = signOutDate.getTime() - timeInDate.getTime();

      if (!isNaN(timeDifference)) {
        console.log(timeDifference);
        const hours = timeDifference / (1000 * 60 * 60);
        attendance.totalHours = hours;

        // Determine status based on total hours
        if (hours === 0) {
          attendance.status = "Leave";
        } else if (hours < 4) {
          attendance.status = "Leave (Half Day)";
        } else if (hours < 7) {
          attendance.status = "Short Leave";
        } else if (hours === 8) {
          attendance.status = "Present";
        } else if (hours > 8) {
          // Handle cases where total hours exceed 8
          attendance.status = "Present (Extra Hours)";
        }
      } else {
        console.log("Invalid date input");
      }

      await attendance.save();

      // Return the updated attendance record in the response
      return res.status(200).json({
        id: attendance.id,
        timeOut: attendance.timeOut,
        totalHours: attendance.totalHours,
        status: attendance.status,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  createAttendance: async (req, res) => {
    try {
      const { UserId, date, timeIn, timeOut, totalHours, status } = req.body;
      const Attendance = await db.Attendance.create({
        UserId,
        date: new Date(date).toISOString().split("T")[0],
        timeIn,
        timeOut,
        totalHours,
        status,
      });
      return res.status(201).json(Attendance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllAttendance: async (req, res) => {
    try {
      const allAttendances = await db.Attendance.findAll({
        include: [{ model: db.CreateUser, as: "CreateUser" }],
      });

      // Extracting only the "name" property from the nested "CreateUser" object
      const modifiedAttendances = allAttendances.map((attendance) => ({
        id: attendance.id,
        UserId: attendance.UserId,
        date: attendance.date,
        timeIn: attendance.timeIn,
        timeOut: attendance.timeOut,
        totalHours: attendance.totalHours,
        status: attendance.status,
        createdAt: attendance.createdAt,
        updatedAt: attendance.updatedAt,
        // Extracting "name" from "CreateUser"
        userName: attendance.CreateUser ? attendance.CreateUser.name : null,
      }));

      return res.status(200).json(modifiedAttendances);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAttendanceById: async (req, res) => {
    try {
      const AttendanceId = req.params.id;
      const Attendance = await db.Attendance.findByPk(AttendanceId);
      if (!Attendance) {
        return res.status(404).json({ error: "Leave request not found" });
      }
      return res.status(200).json(Attendance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateAttendance: async (req, res) => {
    try {
      const AttendanceId = req.params.id;
      const { UserId, date, timeIn, timeOut, totalHours, status } = req.body;
      const Attendance = await db.Attendance.findByPk(AttendanceId);
      if (!Attendance) {
        return res.status(404).json({ error: "Leave request not found" });
      }
      await Attendance.update({
        UserId,
        date: new Date(date).toISOString().split("T")[0],
        timeIn,
        timeOut,
        totalHours,
        status,
      });
      return res.status(200).json(Attendance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteAttendance: async (req, res) => {
    try {
      const AttendanceId = req.params.id;
      const Attendance = await db.Attendance.findByPk(AttendanceId);
      if (!Attendance) {
        return res.status(404).json({ error: "Leave request not found" });
      }
      await Attendance.destroy();
      return res
        .status(200)
        .json({ message: "Leave request deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = AttendanceController;
