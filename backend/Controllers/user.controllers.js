require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../models/User.models');

const generateToken = (id) => {          
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const registerUser = async (req, res) => {
    const { userName, userMailId, password, profileImage } = req.body;

    try {
        const userExist = await User.findOne({ userMailId });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            userName,
            userMailId,
            password,
            profileImage
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                userId: newUser._id,
                userName: newUser.userName,
                userMailId: newUser.userMailId,
                token: generateToken(newUser._id)
            }
        });

    } catch (error) {
        console.error("Error in registering user:", error);
        res.status(500).json({ message: "Not able to register the user" });
    }
};

const loginUser = async (req, res) => {
    const { userMailId, password } = req.body;

    try {                                        // ✅ fixed: added try/catch (was missing)
        const user = await User.findOne({ userMailId });

        if (!user) {
            return res.status(404).json({ message: "User not found" }); // ✅ added return
        }

        const isMatch = await user.comparePasswords(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" }); // ✅ added return
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                userId: user._id,
                userName: user.userName,
                userMailId: user.userMailId,
                token: generateToken(user._id),
            }
        });

    } catch (error) {
        console.error("Error in logging in:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.user._id;           // ✅ fixed: was "req.params.user._id" (wrong)
                                               //    req.user is set by auth middleware after token verification

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser, getUser };