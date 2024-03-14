const db = require("../Models");
const jwt = require("jsonwebtoken");

const User = db.User;

const CreateUser = db.CreateUser;
const saveUser = async (req, res, next) => {
    try {
        const { userName, email } = req.body;

        const existingUsername = await User.findOne({ where: { userName } });
        if (existingUsername) return res.status(409).send("Username already taken");

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) return res.status(409).send("Email already exists");

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

const saveEmployee = async (req, res, next) => {
    try {
        const {  email } = req.body;

        const existingEmail = await CreateUser.findOne({ where: { email } });
        if (existingEmail) return res.status(409).send("Email already exists");

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Token not provided" });

    try {
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.secretKey);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Error verifying token:", error.message);

        const errorMessage = error.name === "JsonWebTokenError" ? "Invalid token" :
            error.name === "TokenExpiredError" ? "Token expired" :
            "Unauthorized";
        
        return res.status(401).json({ error: errorMessage });
    }
};

module.exports = { saveUser,saveEmployee, authenticateToken };
