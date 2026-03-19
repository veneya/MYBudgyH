const express = require('express');
const { registerUser, loginUser, getUser } = require('../Controllers/user.controllers');
const { validator, protect } = require('../middleware/auth.middleware'); 

const authRouter = express.Router();

authRouter.post('/register', validator, registerUser);  
authRouter.post('/login', loginUser);                  
authRouter.get('/user', protect, getUser);              

module.exports = authRouter;