// services/sensorService.js
const { Sensor, User, StorageLocation } = require('../models');

async function registerSensor(userId, sensorData) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found for registering sensor.');
    }
    if (sensorData.location_id) {
        const location = await StorageLocation.findOne({
            where: { location_id: sensorData.location_id, user_id: userId }
        });
        if (!location) {
            throw new Error('Storage location not found or access denied for this sensor.');
        }
    }
    try {
        const existingSensor = await Sensor.findByPk(sensorData.sensor_id);
        if (existingSensor) {
            throw new Error(`Sensor with ID ${sensorData.sensor_id} already exists.`);
        }
        const newSensor = await Sensor.create({ ...sensorData, user_id: userId });
        return newSensor.get({ plain: true });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError' || error.message.includes('already exists')) {
             throw new Error(`Sensor with ID ${sensorData.sensor_id} already registered.`);
        }
        console.error("Error registering sensor:", error);
        throw new Error("Could not register sensor.");
    }
}

async function getSensorById(sensorId, userId) {
    const sensor = await Sensor.findOne({
        where: { sensor_id: sensorId, user_id: userId },
        include: [{ model: StorageLocation, as: 'storageLocation'}]
    });
    return sensor ? sensor.get({ plain: true }) : null;
}

async function getAllSensorsForUser(userId) {
    const sensors = await Sensor.findAll({
        where: { user_id: userId },
        include: [{ model: StorageLocation, as: 'storageLocation'}],
        order: [['name', 'ASC']]
    });
    return sensors.map(s => s.get({ plain: true }));
}

async function updateSensor(sensorId, userId, updateData) {
    const sensor = await Sensor.findOne({
        where: { sensor_id: sensorId, user_id: userId }
    });
    if (!sensor) {
        throw new Error('Sensor not found or access denied.');
    }
    if (updateData.location_id && updateData.location_id !== sensor.location_id) {
        const location = await StorageLocation.findOne({
            where: { location_id: updateData.location_id, user_id: userId }
        });
        if (!location) {
            throw new Error('Target storage location not found or access denied.');
        }
    }
    try {
        const updatedSensor = await sensor.update(updateData);
        return updatedSensor.get({ plain: true });
    } catch (error) {
        console.error(`Error updating sensor ${sensorId}:`, error);
        throw new Error("Could not update sensor.");
    }
}

async function deleteSensor(sensorId, userId) {
    const sensor = await Sensor.findOne({
        where: { sensor_id: sensorId, user_id: userId }
    });
    if (!sensor) {
        throw new Error('Sensor not found or access denied.');
    }
    await sensor.destroy(); 
    return { message: 'Sensor deleted successfully.' };
}

async function updateSensorLastActive(sensorId) {
    try {
        await Sensor.update({ last_active_at: new Date() }, { where: { sensor_id: sensorId } });
    } catch (error) {
        console.error(`Error updating last active time for sensor ${sensorId}:`, error);
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