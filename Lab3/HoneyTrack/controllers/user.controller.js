// controllers/user.controller.js
const userService = require('../services/userService'); 

// Отримати дані поточного аутентифікованого користувача
exports.getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ message: 'Not authenticated or user ID missing in token' });
        }

        const userId = req.user.user_id;
        const user = await userService.findUserById(userId); 

        if (!user) {
       
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Оновити дані поточного аутентифікованого користувача
exports.updateCurrentUser = async (req, res, next) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ message: 'Not authenticated or user ID missing in token' });
        }

        const userId = req.user.user_id;
        const updateData = req.body;


        const allowedUpdates = {};
        if (updateData.email !== undefined) {
            allowedUpdates.email = updateData.email;
        }

        if (Object.keys(allowedUpdates).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update provided.' });
        }


        const updatedUser = await userService.updateUser(userId, allowedUpdates); 

        res.status(200).json(updatedUser);
    } catch (error) {
        // Обробка помилок, наприклад, якщо email вже зайнятий
        if (error.message.toLowerCase().includes('already exists')) {
            return res.status(409).json({ message: error.message }); 
        }
        next(error);
    }
};