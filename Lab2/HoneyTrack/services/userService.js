// services/userService.js
const { User } = require('../models');

async function createUser(userData) {
    try {
        const newUser = await User.create(userData);
        const { password_hash, ...userWithoutPassword } = newUser.get({ plain: true });
        return userWithoutPassword;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`);
        }
        console.error("Error creating user:", error);
        throw new Error("Could not create user.");
    }
}

async function findUserByUsername(username) {
    const user = await User.findOne({
        where: { username },
        attributes: { exclude: ['password_hash'] }
    });
    return user ? user.get({ plain: true }) : null;
}

async function findUserById(userId) {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password_hash'] }
    });
    return user ? user.get({ plain: true }) : null;
}

async function updateUser(userId, updateData) {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        const updatedUser = await user.update(updateData);
        const { password_hash, ...userWithoutPassword } = updatedUser.get({ plain: true });
        return userWithoutPassword;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
             const field = error.errors[0].path;
            throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`);
        }
        console.error(`Error updating user ${userId}:`, error);
        throw new Error("Could not update user.");
    }
}

async function deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found.');
    }
    await user.destroy();
    return { message: 'User deleted successfully.' };
}

async function getAllUsers() {
    const users = await User.findAll({
        attributes: { exclude: ['password_hash'] }
    });
    return users.map(user => user.get({ plain: true }));
}

module.exports = {
    createUser,
    findUserByUsername,
    findUserById,
    updateUser,
    deleteUser,
    getAllUsers
};