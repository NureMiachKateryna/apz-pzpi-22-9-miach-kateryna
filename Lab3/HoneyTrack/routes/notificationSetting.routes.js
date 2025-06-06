// routes/notificationSetting.routes.js
const express = require('express');
const router = express.Router();
const notificationSettingController = require('../controllers/notificationSetting.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, notificationSettingController.setNotificationSetting); 
router.get('/', authMiddleware, notificationSettingController.getNotificationSettings);
router.delete('/:settingId', authMiddleware, notificationSettingController.deleteNotificationSetting);

module.exports = router;