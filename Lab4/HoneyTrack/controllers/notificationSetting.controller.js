// HONEYTRACK/controllers/notificationSetting.controller.js
const notificationSettingService = require('../services/notificationSettingService');

exports.setNotificationSetting = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const settingData = req.body;
        const setting = await notificationSettingService.createOrUpdateNotificationSetting(userId, settingData);
        res.status(200).json(setting);
    } catch (error) {
        next(error);
    }
};

exports.getNotificationSettings = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const settings = await notificationSettingService.getNotificationSettingsForUser(userId);
        res.status(200).json(settings);
    } catch (error) {
        next(error);
    }
};

exports.deleteNotificationSetting = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const settingId = parseInt(req.params.settingId);
        if (isNaN(settingId)) {
            const err = new Error('Invalid setting ID');
            err.statusCode = 400;
            return next(err);
        }
        await notificationSettingService.deleteNotificationSetting(settingId, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};