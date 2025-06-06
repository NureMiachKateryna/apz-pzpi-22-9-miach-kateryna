// HONEYTRACK/services/userService.js
const { User } = require('../models'); 

async function createUser(userData) {
    try {
        const newUser = await User.create(userData);
        const { password_hash, ...userWithoutPassword } = newUser.get({ plain: true });
        return userWithoutPassword;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            let readableField = field;
            if (field === 'username') readableField = 'Username';
            if (field === 'email') readableField = 'Email';
            throw new Error(`${readableField} already exists.`);
        }
        console.error("Error creating user in service:", error);
        throw new Error("Could not create user due to a server error.");
    }
}

async function findUserByUsernameWithPassword(username) {
    const user = await User.findOne({ where: { username } });
    return user;
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
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        const updatedUser = await user.update(updateData);
        const { password_hash, ...userWithoutPassword } = updatedUser.get({ plain: true });
        return userWithoutPassword;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            let readableField = field;
            if (field === 'email') readableField = 'Email';
            throw new Error(`${readableField} already exists.`);
        }
        console.error(`Error updating user ${userId} in service:`, error);
        if (error.statusCode !== 404) {
             throw new Error("Could not update user due to a server error.");
        }
        throw error;
    }
}

async function deleteUser(userId) {
   
    const user = await User.findByPk(userId);
    if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
    }
    await user.destroy();
    return true;
}

async function getAllUsers() {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        return users.map(user => user.get({ plain: true }));
    } catch (error) {
        console.error("Error fetching all users in service:", error);
        throw new Error("Could not fetch users due to a server error.");
    }
}

async function changeUserRoleByAdmin(targetUserId, newRole) {
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
        const error = new Error('Target user not found.');
        error.statusCode = 404;
        throw error;
    }

    if (!['ROLE_USER', 'ROLE_ADMIN'].includes(newRole)) {
        const error = new Error('Invalid role specified. Allowed roles are ROLE_USER, ROLE_ADMIN.');
        error.statusCode = 400;
        throw error;
    }

    try {
        targetUser.role = newRole;
        await targetUser.save();
        const { password_hash, ...userWithoutPassword } = targetUser.get({ plain: true });
        return userWithoutPassword;
    } catch (error) {
        console.error(`Error changing role for user ${targetUserId}:`, error);
        throw new Error("Could not change user role.");
    }
}

async function setUserActiveStatusByAdmin(targetUserId, isActive) {
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
        const error = new Error('Target user not found.');
        error.statusCode = 404;
        throw error;
    }

    if (typeof isActive !== 'boolean') {
        const error = new Error('Invalid active status. Must be true or false.');
        error.statusCode = 400;
        throw error;
    }

    try {
        targetUser.is_active = isActive;
        await targetUser.save();
        const { password_hash, ...userWithoutPassword } = targetUser.get({ plain: true });
        return userWithoutPassword;
    } catch (error) {
        console.error(`Error changing active status for user ${targetUserId}:`, error);
        throw new Error("Could not change user active status.");
    }
}


module.exports = {
    createUser,
    findUserByUsernameWithPassword,
    findUserById,
    updateUser,
    deleteUser,
    getAllUsers,
    changeUserRoleByAdmin,       
    setUserActiveStatusByAdmin 
};