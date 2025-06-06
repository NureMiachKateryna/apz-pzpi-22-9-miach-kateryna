// HONEYTRACK/controllers/user.controller.js
const userService = require('../services/userService');

exports.getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user || !req.user.user_id) {
            const error = new Error('Not authenticated or user ID missing in token');
            error.statusCode = 401;
            return next(error);
        }
        const userId = req.user.user_id;
        const user = await userService.findUserById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateCurrentUser = async (req, res, next) => {
    try {
        if (!req.user || !req.user.user_id) {
            const error = new Error('Not authenticated or user ID missing in token');
            error.statusCode = 401;
            return next(error);
        }
        const userId = req.user.user_id;
        const updateData = req.body;
        const allowedUpdates = {};
        if (updateData.email !== undefined) allowedUpdates.email = updateData.email;
       

        if (Object.keys(allowedUpdates).length === 0) {
            const error = new Error('No valid fields to update provided.');
            error.statusCode = 400;
            return next(error);
        }
        const updatedUser = await userService.updateUser(userId, allowedUpdates);
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.statusCode === 404) return next(error); 
        if (error.message.toLowerCase().includes('already exists')) {
            error.statusCode = 409; 
            return next(error);
        }
        next(error);
    }
};


exports.getAllUsersForAdmin = async (req, res, next) => {
    try {
       
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};