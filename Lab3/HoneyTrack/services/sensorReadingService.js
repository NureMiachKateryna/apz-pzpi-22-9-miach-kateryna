// services/sensorReadingService.js
const { SensorReading, Sensor, User } = require('../models'); 

async function addSensorReading(sensorId, valueType, value) {
    try {
        const newReading = await SensorReading.create({
            sensor_id: sensorId,
            value_type: valueType,
            value: value
        });
        
        Sensor.update({ last_active_at: new Date() }, { where: { sensor_id: sensorId } })
            .catch(err => console.error(`[Service] Failed to update last_active_at for sensor ${sensorId}`, err));

        return newReading.get({ plain: true });
    } catch (error) {
        console.error(`Error adding sensor reading for sensor ${sensorId}:`, error);
        throw new Error("Could not add sensor reading.");
    }
}

async function getReadingsForSensor(sensorId, userId, options = {}) {

    const sensor = await Sensor.findOne({ where: { sensor_id: sensorId, user_id: userId } });
    if (!sensor) {
        throw new Error('Sensor not found or access denied.');
    }

    const { limit, startDate, endDate, valueType } = options;
    let whereClause = { sensor_id: sensorId };

    if (valueType) {
        whereClause.value_type = valueType;
    }
    if (startDate && endDate) {
        whereClause.timestamp = {
            [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
        };
    } else if (startDate) {
        whereClause.timestamp = {
            [Sequelize.Op.gte]: new Date(startDate)
        };
    } else if (endDate) {
        whereClause.timestamp = {
            [Sequelize.Op.lte]: new Date(endDate)
        };
    }

    const readings = await SensorReading.findAll({
        where: whereClause,
        order: [['timestamp', 'DESC']],
        limit: limit ? parseInt(limit, 10) : undefined
    });
    return readings.map(r => r.get({ plain: true }));
}

async function getLatestReadingForSensor(sensorId, userId, valueType) {
    const sensor = await Sensor.findOne({ where: { sensor_id: sensorId, user_id: userId } });
    if (!sensor) {
        throw new Error('Sensor not found or access denied.');
    }
    let whereClause = { sensor_id: sensorId };
    if (valueType) {
        whereClause.value_type = valueType;
    }
    const reading = await SensorReading.findOne({
        where: whereClause,
        order: [['timestamp', 'DESC']]
    });
    return reading ? reading.get({ plain: true }) : null;
}


module.exports = {
    addSensorReading,
    getReadingsForSensor,
    getLatestReadingForSensor
};