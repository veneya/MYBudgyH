const jwt = require('jsonwebtoken');
const User = require('../models/User.models');

// ✅ This middleware now does TWO things:
//    1. Validates required fields on register (validator)
//    2. Verifies JWT token on protected routes (protect)

const validator = (req, res, next) => {
    const { userName, userMailId, password } = req.body; // ✅ fixed: was "username/usermail", now matches controller

    if (!userName || !userMailId || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(userMailId)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    next();
};

// ✅ Added: JWT protect middleware for protected routes (needed by getUser)
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { validator, protect };