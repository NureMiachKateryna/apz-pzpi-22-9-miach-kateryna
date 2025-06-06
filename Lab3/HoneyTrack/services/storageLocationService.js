// services/storageLocationService.js
const { StorageLocation, User } = require('../models');

async function createStorageLocation(userId, locationData) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found for creating storage location.');
    }
    try {
        const newLocation = await StorageLocation.create({ ...locationData, user_id: userId });
        return newLocation.get({ plain: true });
    } catch (error) {
        console.error("Error creating storage location:", error);
        throw new Error("Could not create storage location.");
    }
}

async function getStorageLocationById(locationId, userId) {
    const location = await StorageLocation.findOne({
        where: { location_id: locationId, user_id: userId }
    });
    return location ? location.get({ plain: true }) : null;
}

async function getAllStorageLocationsForUser(userId) {
    const locations = await StorageLocation.findAll({
        where: { user_id: userId },
        order: [['name', 'ASC']]
    });
    return locations.map(loc => loc.get({ plain: true }));
}

async function updateStorageLocation(locationId, userId, updateData) {
    const location = await StorageLocation.findOne({
        where: { location_id: locationId, user_id: userId }
    });
    if (!location) {
        throw new Error('Storage location not found or access denied.');
    }
    try {
        const updatedLocation = await location.update(updateData);
        return updatedLocation.get({ plain: true });
    } catch (error) {
        console.error(`Error updating storage location ${locationId}:`, error);
        throw new Error("Could not update storage location.");
    }
}

async function deleteStorageLocation(locationId, userId) {
    const location = await StorageLocation.findOne({
        where: { location_id: locationId, user_id: userId }
    });
    if (!location) {
        throw new Error('Storage location not found or access denied.');
    }
    await location.destroy();
    return { message: 'Storage location deleted successfully.' };
}

module.exports = {
    createStorageLocation,
    getStorageLocationById,
    getAllStorageLocationsForUser,
    updateStorageLocation,
    deleteStorageLocation
};