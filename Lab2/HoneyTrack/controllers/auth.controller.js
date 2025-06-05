// controllers/auth.controller.js
const userService = require('../services/userService'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const { User } = require('../models'); 

exports.register = async (req, res, next) => {
    try {
  
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Username, password and email are required." });
        }

        const user = await userService.createUser(userToCreate);
        
        res.status(201).json({ message: 'User registered successfully', userId: user.user_id });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

  
        const userInstance = await User.findOne({ where: { username } });

        if (!userInstance) {
            return res.status(401).json({ message: 'Invalid credentials (user not found).' });
        }

        const isMatch = await userInstance.validPassword(password); 

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (password mismatch).' });
        }

        const payload = {
            user_id: userInstance.user_id,
            username: userInstance.username
         
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); 

        const { password_hash, ...userWithoutPassword } = userInstance.get({ plain: true });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        next(error);
    }
};