require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../models/User.models');
const crypto = require('crypto');
const { sendResetEmail } = require('../utils/email');

const generateToken = (id) => {          
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
    const { userName, userMailId, password, profileImage } = req.body;

    try {
        const existing = await User.findOne({
            $or: [
                { userMailId: userMailId.toLowerCase() },
                { userName: userName.toLowerCase() }
            ]
        });
        if (existing) {
            const message = existing.userMailId === userMailId.toLowerCase()
                ? "User already exists"
                : "Username already taken";
            return res.status(400).json({ message });
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
        // Handle duplicate key errors (race conditions) gracefully
        if (error.code === 11000) {
            return res.status(400).json({ message: "User already exists" });
        }
        console.error("❌ ERROR in registerUser:", error);
        res.status(500).json({
            message: "Not able to register the user",
            error: error.message
        });
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

const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ userMailId: req.body.userMailId.toLowerCase() });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        await sendResetEmail(user.userMailId, resetLink);

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        res.json({ message: 'Reset link sent to email' });
    } catch (error) {
        console.error('Password-reset email failed:', error.message);
        res.status(502).json({ message: 'Unable to send reset email. Check the mail server configuration.' });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
};

const updateProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profileImage: imageUrl },
            { new: true }
        ).select('-password');

        res.status(200).json({
            message: "Profile image updated successfully",
            user: user
        });
    } catch (error) {
        console.error("Error updating profile image:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser, getUser, forgotPassword, resetPassword, updateProfileImage };
