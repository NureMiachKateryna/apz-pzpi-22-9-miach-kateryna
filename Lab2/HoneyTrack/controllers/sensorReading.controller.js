// controllers/sensorReading.controller.js
const sensorReadingService = require('../services/sensorReadingService');
const sensorService = require('../services/sensorService'); 


exports.addReading = async (req, res, next) => {
    try {
        const { sensor_id, value_type, value } = req.body;
        if (!sensor_id || value_type === undefined || value === undefined) {
            return res.status(400).json({ error: 'sensor_id, value_type, and value are required.' });
        }

        const sensorExists = await sensorService.getSensorById(sensor_id, req.user.user_id); 
        if (!sensorExists && req.user) { 
             return res.status(404).json({ error: 'Sensor not found for this user.' });
        } else if (!sensorExists && !req.user) { 

             console.warn(`Attempt to add reading for non-existent sensor: ${sensor_id}`);
             return res.status(404).json({ error: `Sensor with ID ${sensor_id} not found.`});
        }

        const newReading = await sensorReadingService.addSensorReading(sensor_id, value_type, value);

        res.status(201).json(newReading);
    } catch (error) {
        next(error);
    }
};

// Отримання показань для конкретного датчика (користувачем)
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
        if(!reading) return res.status(404).json({message: "No readings found for this sensor and type."});
        res.status(200).json(reading);
    } catch (error) {
        next(error);
    }
};