// controllers/alert.controller.js
const alertService = require('../services/alertService');


exports.getAlerts = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { limit, isRead } = req.query;
        const alerts = await alertService.getAlertsForUser(userId, { limit, isRead });
        res.status(200).json(alerts);
    } catch (error) {
        next(error);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const alertId = parseInt(req.params.alertId);
        if (isNaN(alertId)) return res.status(400).json({ error: 'Invalid alert ID' });

        const updatedAlert = await alertService.markAlertAsRead(alertId, userId);
        if (!updatedAlert) return res.status(404).json({ error: 'Alert not found or already read' });
        res.status(200).json(updatedAlert);
    } catch (error) {
        next(error);
    }
};

exports.markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const result = await alertService.markAllAlertsAsReadForUser(userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteAlert = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const alertId = parseInt(req.params.alertId);
         if (isNaN(alertId)) return res.status(400).json({ error: 'Invalid alert ID' });

        await alertService.deleteAlert(alertId, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};