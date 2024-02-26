const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { sequelize } = require('../Models/index');

const User = db.User;

const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const data = { userName, email, password: await bcrypt.hash(password, 10) };
        const user = await User.create(data);
        return user ? res.status(201).send(data) : res.status(409).send("Details are not correct");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

const getUserDetails = async (req, res) => {
    try {
        const UserId = req.user.id;
        const userWithDetails = await User.findOne({ where: { id: UserId } });
        if (!userWithDetails) return res.status(404).send("User not found");
        const additionalDetails = await sequelize.query(`
            SELECT * FROM public."Users" u
            JOIN public."Profiles" p ON u.id = p."UserId" WHERE u.id = :userId;
        `, { replacements: { userId: UserId }, type: sequelize.QueryTypes.SELECT });
        const leaveRequestDetails = await sequelize.query(`
        SELECT * FROM public."Users" u
        JOIN public."LeaveRequests" l ON u.id = l."UserId" WHERE u.id = :userId;
    `, { replacements: { userId: UserId }, type: sequelize.QueryTypes.SELECT });
        console.log("lr",leaveRequestDetails)
        const mergedDetails = { ...userWithDetails.toJSON(), ...additionalDetails[0], ...leaveRequestDetails[0] };
        return res.status(200).send([mergedDetails]);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).send(users);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).send("User not found");
        const { designation, department, phoneNumber, country, state, city, address } = req.body;
        user.designation = designation;
        user.department = department;
        user.phoneNumber = phoneNumber;
        user.country = country;
        user.state = state;
        user.city = city;
        user.address = address;
        await user.save();
        return res.status(200).send(user);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).send("Authentication failed");
        const accessToken = jwt.sign({ id: user.id, email: user.email, userName: user.userName }, process.env.secretKey, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id, email: user.email, userName: user.userName }, process.env.refreshTokenSecret);
        return res.status(200).send({ id: user.id, userName: user.userName, email: user.email, accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { signup, login, getAllUsers, getUserDetails, updateUserDetails };
