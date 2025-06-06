// HONEYTRACK/services/sensorService.js
const { Sensor, User, StorageLocation, Sequelize } = require('../models');

async function registerSensor(userId, sensorData) {
    const { sensor_id, name, type, location_id } = sensorData;

    const user = await User.findByPk(userId);
    if (!user) {
        const error = new Error('User not found for registering sensor.');
        error.statusCode = 404;
        throw error;
    }

    if (location_id) {
        const location = await StorageLocation.findOne({
            where: { location_id: location_id, user_id: userId }
        });
        if (!location) {
            const error = new Error('Storage location not found or access denied for this sensor.');
            error.statusCode = 404;
            throw error;
        }
    }

    try {
        const existingSensor = await Sensor.findByPk(sensor_id);
        if (existingSensor) {
            const error = new Error(`Sensor with ID ${sensor_id} already exists.`);
            error.statusCode = 409; // Conflict
            throw error;
        }
        const newSensor = await Sensor.create({
            sensor_id,
            name,
            type,
            location_id: location_id || null,
            user_id: userId
        });
        return newSensor.get({ plain: true });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`Sensor with ID ${sensor_id} already registered.`);
        }
        console.error("Error registering sensor in service:", error);
        throw new Error("Could not register sensor due to a server error.");
    }
}

async function getSensorById(sensorId, userId) {
    try {
        const sensor = await Sensor.findOne({
            where: { sensor_id: sensorId, user_id: userId },
            include: [{ model: StorageLocation, as: 'storageLocation', attributes: ['location_id', 'name'], required: false }]
        });
        return sensor ? sensor.get({ plain: true }) : null;
    } catch (error) {
        console.error(`Error fetching sensor ${sensorId} by ID:`, error);
        throw new Error('Could not fetch sensor.');
    }
}

async function getAllSensorsForUser(userId) {
    try {
        const sensors = await Sensor.findAll({
            where: { user_id: userId },
            include: [{ model: StorageLocation, as: 'storageLocation', attributes: ['location_id', 'name'], required: false }],
            order: [['name', 'ASC'], ['createdAt', 'DESC']]
        });
        return sensors.map(s => s.get({ plain: true }));
    } catch (error) {
        console.error(`Error fetching sensors for user ${userId}:`, error);
        throw new Error('Could not fetch sensors.');
    }
}

async function updateSensor(sensorId, userId, updateData) {
    const { name, type, location_id } = updateData;
    try {
        const sensor = await Sensor.findOne({
            where: { sensor_id: sensorId, user_id: userId }
        });
        if (!sensor) {
            const error = new Error('Sensor not found or access denied.');
            error.statusCode = 404;
            throw error;
        }

        if (location_id && location_id !== sensor.location_id) {
            const location = await StorageLocation.findOne({
                where: { location_id: location_id, user_id: userId }
            });
            if (!location) {
                const error = new Error('Target storage location not found or access denied.');
                error.statusCode = 404;
                throw error;
            }
        }

        sensor.name = name !== undefined ? name : sensor.name;
        sensor.type = type !== undefined ? type : sensor.type;
        sensor.location_id = location_id !== undefined ? (location_id || null) : sensor.location_id;

        await sensor.save();
        return sensor.get({ plain: true });
    } catch (error) {
        console.error(`Error updating sensor ${sensorId} in service:`, error);
        if (error.statusCode === 404) throw error;
        throw new Error("Could not update sensor due to a server error.");
    }
}

async function deleteSensor(sensorId, userId) {
    try {
        const sensor = await Sensor.findOne({
            where: { sensor_id: sensorId, user_id: userId }
        });
        if (!sensor) {
            const error = new Error('Sensor not found or access denied.');
            error.statusCode = 404;
            throw error;
        }
        await sensor.destroy();
        return true;
    } catch (error) {
        console.error(`Error deleting sensor ${sensorId} in service:`, error);
        if (error.statusCode === 404) throw error;
        throw new Error("Could not delete sensor due to a server error.");
    }
}

async function updateSensorLastActive(sensorId) {
    try {
        await Sensor.update({ last_active_at: new Date() }, { where: { sensor_id: sensorId } });
    } catch (error) {
        console.error(`[Service] Failed to update last_active_at for sensor ${sensorId}: ${error.message}`);
    }
}

module.exports = {
    registerSensor,
    getSensorById,
    getAllSensorsForUser,
    updateSensor,
    deleteSensor,
    updateSensorLastActive
};