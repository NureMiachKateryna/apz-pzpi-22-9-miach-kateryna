// HONEYTRACK/controllers/auth.controller.js
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            const error = new Error("Username, password, and email are required.");
            error.statusCode = 400;
            return next(error);
        }
        if (password.length < 6) {
            const error = new Error("Password must be at least 6 characters long.");
            error.statusCode = 400;
            return next(error);
        }

        const userData = {
            username: username,
            password_hash: password, 
            email: email
           
        };

        const createdUser = await userService.createUser(userData);

        res.status(201).json({
            message: 'User registered successfully. Please log in.',
            user: {
                user_id: createdUser.user_id,
                username: createdUser.username,
                email: createdUser.email,
                role: createdUser.role
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            const error = new Error("Username and password are required.");
            error.statusCode = 400;
            return next(error);
        }

        const userInstance = await userService.findUserByUsernameWithPassword(username);

        if (!userInstance) {
            const error = new Error('Invalid credentials.'); 
            error.statusCode = 401; 
            return next(error);
        }

        if (!userInstance.is_active) {
            const error = new Error('User account is deactivated.');
            error.statusCode = 403; 
            return next(error);
        }
    

        const isMatch = await userInstance.validPassword(password);

        if (!isMatch) {
            const error = new Error('Invalid credentials.'); 
            error.statusCode = 401; 
            return next(error);
        }

        const payload = {
            user_id: userInstance.user_id,
            username: userInstance.username,
            role: userInstance.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

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