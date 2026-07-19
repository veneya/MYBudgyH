const express = require('express');
const { registerUser, loginUser, getUser, forgotPassword, resetPassword, updateProfileImage } = require('../Controllers/user.controllers');
const { validator, protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const authRouter = express.Router();

authRouter.post('/register', validator, registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/user', protect, getUser);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.put('/upload-profile', protect, upload.single('profileImage'), updateProfileImage);

module.exports = authRouter;