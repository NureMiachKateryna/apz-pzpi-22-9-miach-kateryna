// services/notificationSettingService.js
const { NotificationSetting, User, Sensor } = require('../models');

async function createOrUpdateNotificationSetting(userId, settingData) {

    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found.');
    }
    if (settingData.sensor_id) {
        const sensor = await Sensor.findOne({ where: { sensor_id: settingData.sensor_id, user_id: userId }});
        if (!sensor) {
            throw new Error('Sensor not found or not associated with this user.');
        }
    } else {
  
        if (!settingData.sensor_id) { 
             throw new Error('Target for notification setting (e.g., sensor_id) must be provided.');
        }
    }

    try {
  
        let setting = await NotificationSetting.findOne({
            where: {
                user_id: userId,
                sensor_id: settingData.sensor_id || null, 
                parameter_type: settingData.parameter_type
            }
        });

        if (setting) {
        
            setting = await setting.update({
                min_threshold: settingData.min_threshold !== undefined ? settingData.min_threshold : null,
                max_threshold: settingData.max_threshold !== undefined ? settingData.max_threshold : null,
                is_enabled: settingData.is_enabled !== undefined ? settingData.is_enabled : true
            });
        } else {
     
            setting = await NotificationSetting.create({
                user_id: userId,
                sensor_id: settingData.sensor_id || null,
                parameter_type: settingData.parameter_type,
                min_threshold: settingData.min_threshold !== undefined ? settingData.min_threshold : null,
                max_threshold: settingData.max_threshold !== undefined ? settingData.max_threshold : null,
                is_enabled: settingData.is_enabled !== undefined ? settingData.is_enabled : true
            });
        }
        return setting.get({ plain: true });
    } catch (error) {
        console.error("Error creating or updating notification setting:", error);
        throw new Error("Could not save notification setting.");
    }
}

async function getNotificationSettingsForUser(userId) {
    const settings = await NotificationSetting.findAll({
        where: { user_id: userId },
        include: [{ model: Sensor, as: 'sensor', attributes: ['sensor_id', 'name', 'type'] }],
        order: [['sensor_id', 'ASC'], ['parameter_type', 'ASC']]
    });
    return settings.map(s => s.get({ plain: true }));
}

async function getActiveSettingsForSensorAndType(sensorId, parameterType) {
    return await NotificationSetting.findAll({
        where: {
            sensor_id: sensorId,
            parameter_type: parameterType,
            is_enabled: true
        },
        include: [{model: User, as: 'user', attributes:['user_id', 'email']}] 
    });
}

async function deleteNotificationSetting(settingId, userId) {
    const setting = await NotificationSetting.findOne({
        where: { setting_id: settingId, user_id: userId }
    });
    if (!setting) {
        throw new Error('Notification setting not found or access denied.');
    }
    await setting.destroy();
    return { message: 'Notification setting deleted successfully.' };
}

module.exports = {
    createOrUpdateNotificationSetting,
    getNotificationSettingsForUser,
    getActiveSettingsForSensorAndType,
    deleteNotificationSetting
};