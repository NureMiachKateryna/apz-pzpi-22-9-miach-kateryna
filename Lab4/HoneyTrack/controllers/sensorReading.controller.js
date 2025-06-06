// controllers/sensorReading.controller.js
const sensorReadingService = require('../services/sensorReadingService');
const { Sensor } = require('../models'); 

exports.addReading = async (req, res, next) => {
    try {
        const { sensor_id, value_type, value } = req.body;

        if (!sensor_id || value_type === undefined || value === undefined) {
            const err = new Error('sensor_id, value_type, and value are required.');
            err.statusCode = 400;
            return next(err); 
        }

       
        const sensorDevice = await Sensor.findByPk(sensor_id);
        if (!sensorDevice) {
            console.warn(`Attempt to add reading for non-existent sensor: ${sensor_id}`);
            const err = new Error(`Sensor with ID ${sensor_id} not found.`);
            err.statusCode = 404;
            return next(err);
        }

       
        const newReading = await sensorReadingService.addSensorReading(sensor_id, value_type, parseFloat(value));

        res.status(201).json(newReading);
    } catch (error) {
        next(error);
    }
};

exports.getReadingsForSensor = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { sensorId } = req.params;
        const { limit, startDate, endDate, valueType } = req.query;

      
        const readings = await sensorReadingService.getReadingsForSensor(sensorId, userId, { limit, startDate, endDate, valueType });
        res.status(200).json(readings);
    } catch (error) {
        next(error);
    }
};

exports.getLatestReading = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { sensorId } = req.params;
        const { valueType } = req.query;
        const reading = await sensorReadingService.getLatestReadingForSensor(sensorId, userId, valueType);
        if(!reading) {
            const err = new Error("No readings found for this sensor and type.");
            err.statusCode = 404;
            return next(err);
        }
        res.status(200).json(reading);
    } catch (error) {
        next(error);
    }
};