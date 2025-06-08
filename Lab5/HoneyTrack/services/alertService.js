// HONEYTRACK/services/alertService.js
const { Alert, User, Sensor, Sequelize } = require('../models');

async function createAlert(alertData) {
    try {
        const newAlert = await Alert.create(alertData);
        return newAlert.get({ plain: true });
    } catch (error) {
        console.error(`[Service] Error creating alert: ${error.message}`);
        throw new Error('Could not create alert.');
    }
}

async function getAlertsForUser(userId, options = {}) {
    const { limit = 10, isRead, sortBy = 'timestamp', sortOrder = 'DESC' } = options;
    let whereClause = { user_id: userId };

    if (isRead !== undefined) {
        whereClause.is_read = isRead === 'true' || isRead === true;
    }

    const order = [[sortBy, sortOrder.toUpperCase()]];

    try {
        const alerts = await Alert.findAll({
            where: whereClause,
            include: [
                { model: Sensor, as: 'sensor', attributes: ['sensor_id', 'name', 'type'], required: false }
            ],
            order: order,
            limit: limit ? parseInt(limit, 10) : undefined
        });
        return alerts.map(alert => alert.get({ plain: true }));
    } catch (error) {
        console.error(`[Service] Error fetching alerts for user ${userId}: ${error.message}`);
        throw new Error('Could not fetch alerts.');
    }
}

async function markAlertAsRead(alertId, userId) {
    const alert = await Alert.findOne({
        where: { alert_id: alertId, user_id: userId }
    });
    if (!alert) {
        const error = new Error('Alert not found or access denied.');
        error.statusCode = 404;
        throw error;
    }
    if (alert.is_read) {
        return alert.get({ plain: true });
    }
    try {
        alert.is_read = true;
        await alert.save();
        return alert.get({ plain: true });
    } catch (error) {
        console.error(`[Service] Error marking alert ${alertId} as read: ${error.message}`);
        throw new Error('Could not mark alert as read.');
    }
}

async function markAllAlertsAsReadForUser(userId) {
    try {
        const [affectedCount] = await Alert.update(
            { is_read: true },
            { where: { user_id: userId, is_read: false } }
        );
        return { message: `${affectedCount} alerts marked as read.` };
    } catch (error) {
        console.error(`[Service] Error marking all alerts as read for user ${userId}: ${error.message}`);
        throw new Error('Could not mark all alerts as read.');
    }
}

async function deleteAlert(alertId, userId) {
    const alert = await Alert.findOne({
        where: { alert_id: alertId, user_id: userId }
    });
    if (!alert) {
        const error = new Error('Alert not found or access denied.');
        error.statusCode = 404;
        throw error;
    }
    try {
        await alert.destroy();
        return { message: 'Alert deleted successfully.' };
    } catch (error) {
        console.error(`[Service] Error deleting alert ${alertId}: ${error.message}`);
        throw new Error('Could not delete alert.');
    }
}

module.exports = {
    createAlert,
    getAlertsForUser,
    markAlertAsRead,
    markAllAlertsAsReadForUser,
    deleteAlert
};