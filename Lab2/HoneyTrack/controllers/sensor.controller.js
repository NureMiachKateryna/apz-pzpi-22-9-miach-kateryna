// controllers/sensor.controller.js
const sensorService = require('../services/sensorService');

exports.registerSensor = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const sensorData = { ...req.body, user_id: userId };
        const newSensor = await sensorService.registerSensor(userId, sensorData);
        res.status(201).json(newSensor);
    } catch (error) {
        next(error);
    }
};

exports.getAllSensors = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const sensors = await sensorService.getAllSensorsForUser(userId);
        res.status(200).json(sensors);
    } catch (error) {
        next(error);
    }
};

exports.getSensorById = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { sensorId } = req.params; 
        const sensor = await sensorService.getSensorById(sensorId, userId);
        if (!sensor) {
            return res.status(404).json({ error: 'Sensor not found or access denied' });
        }
        res.status(200).json(sensor);
    } catch (error) {
        next(error);
    }
};

exports.updateSensor = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { sensorId } = req.params;
        const updateData = req.body;
        const updatedSensor = await sensorService.updateSensor(sensorId, userId, updateData);
        if (!updatedSensor) { 
            return res.status(404).json({ error: 'Sensor not found or access denied for update' });
        }
        res.status(200).json(updatedSensor);
    } catch (error) {
        next(error);
    }
};

exports.deleteSensor = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { sensorId } = req.params;
        await sensorService.deleteSensor(sensorId, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};