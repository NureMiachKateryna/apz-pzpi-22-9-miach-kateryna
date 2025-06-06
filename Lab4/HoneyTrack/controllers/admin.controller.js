// HONEYTRACK/controllers/admin.controller.js
const userService = require('../services/userService'); 

exports.changeUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;   

        if (!role) {
            const error = new Error('New role is required.');
            error.statusCode = 400;
            return next(error);
        }

        const updatedUser = await userService.changeUserRoleByAdmin(parseInt(userId), role);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.setUserActiveStatus = async (req, res, next) => {
    try {
        const { userId } = req.params; 
        const { isActive } = req.body; 

        if (isActive === undefined || typeof isActive !== 'boolean') {
            const error = new Error('isActive status (true or false) is required.');
            error.statusCode = 400;
            return next(error);
        }

        const updatedUser = await userService.setUserActiveStatusByAdmin(parseInt(userId), isActive);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};