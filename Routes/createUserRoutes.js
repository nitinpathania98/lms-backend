const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/createUserController");
const { authenticateToken, saveEmployee } = require("../Middlewares/userAuth");

// Create a new user
router.post("/users", saveEmployee, UserController.createUser);
router.post("/users/login", UserController.login);

// Get all users
router.get("/users", UserController.getAllUsers);

// Get user by ID
router.get("/users/:id", UserController.getUserById);
router.get("/user/details", authenticateToken, UserController.getUserDetails);
// Update user
router.put("/users/:id", UserController.updateUser);

// Delete user
router.delete("/users/:id", UserController.deleteUser);

module.exports = router;
