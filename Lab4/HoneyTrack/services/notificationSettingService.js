// HONEYTRACK/services/notificationSettingService.js
const { NotificationSetting, User, Sensor } = require('../models');

async function createOrUpdateNotificationSetting(userId, settingData) {
    const user = await User.findByPk(userId);
    if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
    }

    if (!settingData.sensor_id) {
        const error = new Error('Sensor ID is required for notification setting.');
        error.statusCode = 400;
        throw error;
    }
    if (!settingData.parameter_type) {
        const error = new Error('Parameter type (temperature or humidity) is required.');
        error.statusCode = 400;
        throw error;
    }
    

    const isGeneralSensor = settingData.sensor_id === 'VIRTUAL_DHT_01'; 

    if (!isGeneralSensor) { 
        const sensor = await Sensor.findOne({
            where: {
                sensor_id: settingData.sensor_id,
                user_id: userId
            }
        });
        if (!sensor) {
            const error = new Error('Sensor not found or not associated with this user.');
            error.statusCode = 404;
            throw error;
        }
    } else { 
        const sensor = await Sensor.findByPk(settingData.sensor_id);
        if (!sensor) {
            const error = new Error(`General sensor with ID ${settingData.sensor_id} not found in the system.`);
            error.statusCode = 404;
            throw error;
        }
    }

    try {
        let setting = await NotificationSetting.findOne({
            where: {
                user_id: userId, 
                sensor_id: settingData.sensor_id,
                parameter_type: settingData.parameter_type
            }
        });

        const dataToSave = {
            min_threshold: settingData.min_threshold !== undefined ? (settingData.min_threshold === '' ? null : parseFloat(settingData.min_threshold)) : null,
            max_threshold: settingData.max_threshold !== undefined ? (settingData.max_threshold === '' ? null : parseFloat(settingData.max_threshold)) : null,
            is_enabled: settingData.is_enabled !== undefined ? settingData.is_enabled : true
        };

        if (setting) {
            setting = await setting.update(dataToSave);
        } else {
            setting = await NotificationSetting.create({
                user_id: userId,
                sensor_id: settingData.sensor_id,
                parameter_type: settingData.parameter_type,
                ...dataToSave
            });
        }
        return setting.get({ plain: true });
    } catch (error) {
        console.error(`[Service] Error creating/updating notification setting: ${error.message}`, error);
        throw new Error("Could not save notification setting.");
    }
}


async function getNotificationSettingsForUser(userId) {
    try {
        const settings = await NotificationSetting.findAll({
            where: { user_id: userId },
            include: [{ model: Sensor, as: 'sensor', attributes: ['sensor_id', 'name', 'type'], required: false }],
            order: [['sensor_id', 'ASC'], ['parameter_type', 'ASC']]
        });
        return settings.map(s => s.get({ plain: true }));
    } catch (error) {
        console.error(`[Service] Error fetching notification settings for user ${userId}: ${error.message}`);
        throw new Error('Could not fetch notification settings.');
    }
}

async function getActiveSettingsForSensorAndType(sensorId, parameterType) {
    try {
        return await NotificationSetting.findAll({
            where: {
                sensor_id: sensorId,
                parameter_type: parameterType,
                is_enabled: true
            },
            include: [{model: User, as: 'user', attributes:['user_id', 'email']}]
        });
    } catch (error) {
        console.error(`[Service] Error fetching active settings for sensor ${sensorId}, type ${parameterType}: ${error.message}`);
        throw new Error('Could not fetch active notification settings.');
    }
}

async function deleteNotificationSetting(settingId, userId) {
    const setting = await NotificationSetting.findOne({
        where: { setting_id: settingId, user_id: userId }
    });
    if (!setting) {
        const error = new Error('Notification setting not found or access denied.');
        error.statusCode = 404;
        throw error;
    }
    try {
        await setting.destroy();
        return { message: 'Notification setting deleted successfully.' };
    } catch (error) {
        console.error(`[Service] Error deleting notification setting ${settingId}: ${error.message}`);
        throw new Error('Could not delete notification setting.');
    }
}

module.exports = {
    createOrUpdateNotificationSetting,
    getNotificationSettingsForUser,
    getActiveSettingsForSensorAndType,
    deleteNotificationSetting
};