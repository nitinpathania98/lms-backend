//importing modules
const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");

// Assigning users to the variable User
const User = db.users;

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
            return res.status(201).send(user);
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
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        return res.status(200).send(user);
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

//login authentication
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({
            where: {
                email: email
            }
        });
        //if user email is found, compare password with bcrypt
        if (user) {
            const isSame = await bcrypt.compare(password, user.password);
            if (isSame) {
                let token = jwt.sign({ id: user.id, email: user.email, userName: user.userName }, process.env.secretKey, {
                    expiresIn: '1h',
                });
                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true });
                console.log("token is", token);
                //send user data
                return res.status(200).send({
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    token: token,
                });
            }
        } else {
            return res.status(401).send("Authentication failed");
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    signup,
    login,
    getAllUsers,
    getUserDetails
};