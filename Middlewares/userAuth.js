const express = require("express");
const db = require("../Models");
const jwt = require("jsonwebtoken");

const User = db.users;
const saveUser = async (req, res, next) => {
    try {
        const username = await User.findOne({
            where: {
                userName: req.body.userName,
            },
        });
        if (username) {
            return res.status(409).send("username already taken");
        }
        const emailcheck = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (emailcheck) {
            return res.status(409).send("Authentication failed");
        }
        next();
    } catch (error) {
        console.log(error);
    }
};

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Token not provided" });
    }

    try {
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.secretKey);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Error verifying token:", error.message);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
};

module.exports = {
    saveUser,
    authenticateToken
};