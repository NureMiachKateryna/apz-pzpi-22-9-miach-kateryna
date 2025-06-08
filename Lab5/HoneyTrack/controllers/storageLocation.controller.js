// controllers/storageLocation.controller.js
const storageLocationService = require('../services/storageLocationService');

exports.createStorageLocation = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const locationData = req.body;
        const newLocation = await storageLocationService.createStorageLocation(userId, locationData);
        res.status(201).json(newLocation);
    } catch (error) {
        next(error);
    }
};

exports.getAllStorageLocations = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const locations = await storageLocationService.getAllStorageLocationsForUser(userId);
        res.status(200).json(locations);
    } catch (error) {
        next(error);
    }
};

exports.getStorageLocationById = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const locationId = parseInt(req.params.locationId);
        if (isNaN(locationId)) return res.status(400).json({ error: 'Invalid location ID' });
        const location = await storageLocationService.getStorageLocationById(locationId, userId);
        if (!location) return res.status(404).json({ error: 'Storage location not found' });
        res.status(200).json(location);
    } catch (error) {
        next(error);
    }
};

exports.updateStorageLocation = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const locationId = parseInt(req.params.locationId);
        if (isNaN(locationId)) return res.status(400).json({ error: 'Invalid location ID' });
        const updateData = req.body;
        const updatedLocation = await storageLocationService.updateStorageLocation(locationId, userId, updateData);
        if (!updatedLocation) return res.status(404).json({ error: 'Storage location not found for update' });
        res.status(200).json(updatedLocation);
    } catch (error) {
        next(error);
    }
};

exports.deleteStorageLocation = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const locationId = parseInt(req.params.locationId);
        if (isNaN(locationId)) return res.status(400).json({ error: 'Invalid location ID' });
        await storageLocationService.deleteStorageLocation(locationId, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};