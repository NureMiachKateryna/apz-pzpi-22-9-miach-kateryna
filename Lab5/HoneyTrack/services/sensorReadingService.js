// HONEYTRACK/services/sensorReadingService.js
const { SensorReading, Sensor, User, NotificationSetting, Alert, Sequelize } = require('../models');
const alertService = require('./alertService');

async function addSensorReading(sensorIdFromDevice, valueType, value) {
    let newReadingInstance;
    try {
        newReadingInstance = await SensorReading.create({
            sensor_id: sensorIdFromDevice,
            value_type: valueType,
            value: value
        });

        Sensor.update({ last_active_at: new Date() }, { where: { sensor_id: sensorIdFromDevice } })
            .catch(err => console.error(`[Service] Failed to update last_active_at for sensor ${sensorIdFromDevice}: ${err.message}`));

        try {
            const sensorDetails = await Sensor.findByPk(sensorIdFromDevice);
            const sensorDisplayName = sensorDetails?.name || sensorIdFromDevice;

            const activeSettingsForThisSensor = await NotificationSetting.findAll({
                where: {
                    sensor_id: sensorIdFromDevice,
                    parameter_type: valueType,
                    is_enabled: true
                },
                include: [{ model: User, as: 'user', attributes: ['user_id', 'email'] }]
            });

            for (const setting of activeSettingsForThisSensor) {
                if (!setting.user || !setting.user.user_id) {
                    console.warn(`[Service] NotificationSetting ID ${setting.setting_id} for sensor ${sensorIdFromDevice} has no valid associated user. Skipping alert generation for this setting.`);
                    continue;
                }
                
                const userIdForAlert = setting.user.user_id;
                let alertMessage = null;
                let alertLevel = "warning";

                if (setting.min_threshold !== null && value < setting.min_threshold) {
                    alertMessage = `Увага! ${valueType === 'temperature' ? 'Температура' : 'Вологість'} (${value.toFixed(1)}) для датчика "${sensorDisplayName}" нижче вашої норми (${setting.min_threshold}).`;
                    alertLevel = "critical";
                } else if (setting.max_threshold !== null && value > setting.max_threshold) {
                    alertMessage = `Увага! ${valueType === 'temperature' ? 'Температура' : 'Вологість'} (${value.toFixed(1)}) для датчика "${sensorDisplayName}" вище вашої норми (${setting.max_threshold}).`;
                    alertLevel = "critical";
                }

                if (alertMessage) {
                    await alertService.createAlert({
                        user_id: userIdForAlert,
                        sensor_id: sensorIdFromDevice,
                        reading_id: newReadingInstance.reading_id,
                        message: alertMessage,
                        alert_level: alertLevel
                    });
                    console.log(`[ALERT GENERATED] For user ${userIdForAlert}, sensor ${sensorIdFromDevice}: ${alertMessage}`);
                }
            }
        } catch (alertCheckError) {
            console.error(`[Service] Error in alert checking/creation for sensor ${sensorIdFromDevice}: ${alertCheckError.message}`);
        }

        return newReadingInstance.get({ plain: true });

    } catch (error) {
        console.error(`[Service] Error adding sensor reading for sensor ${sensorIdFromDevice}: ${error.message}`);
        if (error.name === 'SequelizeForeignKeyConstraintError' && error.parent && error.parent.code === 'SQLITE_CONSTRAINT') {
            throw new Error(`Sensor with ID ${sensorIdFromDevice} does not exist. Please ensure the sensor is registered.`);
        }
        throw new Error("Could not add sensor reading due to a server error.");
    }
}

async function getReadingsForSensor(sensorId, userId, options = {}) {
    const sensor = await Sensor.findOne({ where: { sensor_id: sensorId, user_id: userId } });
    if (!sensor && sensorId !== "VIRTUAL_DHT_01") { 
        const error = new Error('Sensor not found or access denied.');
        error.statusCode = 404;
        throw error;
    }

    const { limit, startDate, endDate, valueType } = options;
    let whereClause = { sensor_id: sensorId };

    if (valueType) {
        whereClause.value_type = valueType;
    }
    if (startDate && endDate) {
        whereClause.timestamp = { [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
        whereClause.timestamp = { [Sequelize.Op.gte]: new Date(startDate) };
    } else if (endDate) {
        whereClause.timestamp = { [Sequelize.Op.lte]: new Date(endDate) };
    }

    try {
        const readings = await SensorReading.findAll({
            where: whereClause,
            order: [['timestamp', 'DESC']],
            limit: limit ? parseInt(limit, 10) : undefined
        });
        return readings.map(r => r.get({ plain: true }));
    } catch (error) {
        console.error(`[Service] Error fetching readings for sensor ${sensorId}: ${error.message}`);
        throw new Error('Could not fetch sensor readings.');
    }
}

async function getLatestReadingForSensor(sensorId, userId, valueType) {
    const sensor = await Sensor.findOne({ where: { sensor_id: sensorId, user_id: userId } });
     if (!sensor && sensorId !== "VIRTUAL_DHT_01") { 
        const error = new Error('Sensor not found or access denied.');
        error.statusCode = 404;
        throw error;
    }
    let whereClause = { sensor_id: sensorId };
    if (valueType) {
        whereClause.value_type = valueType;
    }
    try {
        const reading = await SensorReading.findOne({
            where: whereClause,
            order: [['timestamp', 'DESC']]
        });
        return reading ? reading.get({ plain: true }) : null;
    } catch (error) {
        console.error(`[Service] Error fetching latest reading for sensor ${sensorId}: ${error.message}`);
        throw new Error('Could not fetch latest sensor reading.');
    }
}

module.exports = {
    addSensorReading,
    getReadingsForSensor,
    getLatestReadingForSensor
};