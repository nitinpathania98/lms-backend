//importing modules
const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { sequelize } = require('../Models/index');

// Assigning users to the variable User
const User = db.User;

const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const data = {
            userName,
            email,
            password: await bcrypt.hash(password, 10),
        };
        //saving the user
        const user = await User.create(data);
        if (user) {
            return res.status(201).send(data);
        } else {
            return res.status(409).send("Details are not correct");
        }
    } catch (error) {
        console.log(error);
    }
};

// Get user details for the logged-in user using the token
const getUserDetails = async (req, res) => {
    try {
        const UserId = req.user.id;

        // Fetch user details along with profile details using Sequelize's include option
        const userWithDetails = await User.findOne({
            where: { id: UserId }
        });

        // Check if user details are found
        if (!userWithDetails) {
            return res.status(404).send("User not found");
        }

        // Custom SQL query to fetch additional user details
        const additionalDetails = await sequelize.query(`
            SELECT * FROM public."Users" u
            JOIN public."Profiles" p ON u.id = p."id" WHERE u.id = :userId;
        `, {
            replacements: { userId: UserId },
            type: sequelize.QueryTypes.SELECT
        });

        // Merge additional details with existing user details
        const mergedDetails = { ...userWithDetails.toJSON(), ...additionalDetails[0]};

        return res.status(200).send(mergedDetails);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};




// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).send(users);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

// Update user details
const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { designation, department, phoneNumber, country, state, city, address } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Update user details
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
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};


//login authentication
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            const isSame = await bcrypt.compare(password, user.password);
            if (isSame) {
                const accessToken = jwt.sign({ id: user.id, email: user.email, userName: user.userName }, process.env.secretKey, {
                    expiresIn: '1h',
                });

                // Generate refresh token
                const refreshToken = jwt.sign({ id: user.id, email: user.email, userName: user.userName }, process.env.refreshTokenSecret);

                // Save refresh token in the database (You may need to create a separate table for this)
                // Example:
                // await RefreshToken.create({ userId: user.id, token: refreshToken });

                // Send both tokens in the response
                return res.status(200).send({
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
            }
        }

        return res.status(401).send("Authentication failed");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};


module.exports = {
    signup,
    login,
    getAllUsers,
    getUserDetails,
    updateUserDetails
};