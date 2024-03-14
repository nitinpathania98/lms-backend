const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { sequelize } = require("../Models/index");

// Function to generate a random password
function generateRandomPassword() {
  return Math.random().toString(36).slice(-8);
}

const UserController = {
  createUser: async (req, res) => {
    try {
      const { name, email, department } = req.body;

      const password = generateRandomPassword();
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await db.CreateUser.create({
        name,
        email,
        department,
        password: hashedPassword,
      });
      // Send email with user details
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "nitinsingh2111998@gmail.com",
          pass: "qkybgjzsudeflfqy",
        },
      });

      const mailOptions = {
        from: "nitinsingh2111998@gmail.com",
        to: email,
        subject: "Invitation to the Application",
        html: `
              <p>Hello ${name},</p>
              <p>Welcome to the Application!</p>
              <p>Your account has been created successfully.</p>
              <p>Email: ${email}</p>
              <p>Password: ${password}</p>
              <p>Please click <a href="http://localhost:3000/login">here</a> to log in.</p>
            `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await db.CreateUser.findAll();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getUserDetails: async (req, res) => {
    try {
      const UserId = req.params.id;
      const user = await db.CreateUser.findOne({ where: { id: UserId } });
      const attendanceDetails = await sequelize.query(
        `
              SELECT * FROM public."CreateUsers" c
              JOIN public."Attendances" a ON c.id = a."UserId" WHERE c.id = :userId;
          `,
        { replacements: { userId: UserId }, type: sequelize.QueryTypes.SELECT }
      );
      const mergedDetails = {
        ...user.toJSON(),
        attendance: attendanceDetails,
      };
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(mergedDetails);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const UserId = req.params.id;
      const user = await db.CreateUser.findOne({ where: { id: UserId } });
      const attendanceDetails = await sequelize.query(
        `
              SELECT * FROM public."CreateUsers" c
              JOIN public."Attendances" a ON c.id = a."UserId" WHERE c.id = :userId;
          `,
        { replacements: { userId: UserId }, type: sequelize.QueryTypes.SELECT }
      );
      const mergedDetails = {
        ...user.toJSON(),
        attendance: attendanceDetails,
      };
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(mergedDetails);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, department } = req.body;
      const user = await db.CreateUser.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await user.update({ name, department });
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await db.CreateUser.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.CreateUser.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).send("Authentication failed");
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.secretKey,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.refreshTokenSecret
      );
      return res.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
        UserId: user.id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = UserController;
