// services/alertService.js
const { Alert, User, Sensor, SensorReading } = require('../models');

async function createAlert(alertData) {
    
    const user = await User.findByPk(alertData.user_id);
    if (!user) {

        console.error(`User not found for alert: user_id ${alertData.user_id}`);
        return null; 
    }

    try {
        const newAlert = await Alert.create(alertData);
        return newAlert.get({ plain: true });
    } catch (error) {
        console.error("Error creating alert:", error);
        throw new Error("Could not create alert.");
    }
}

async function getAlertsForUser(userId, options = {}) {
    const { limit, isRead } = options;
    let whereClause = { user_id: userId };

    if (isRead !== undefined) {
        whereClause.is_read = isRead === 'true' || isRead === true;
    }

    const alerts = await Alert.findAll({
        where: whereClause,
        include: [
            { model: Sensor, as: 'sensor', attributes: ['sensor_id', 'name'] },
    
        ],
        order: [['timestamp', 'DESC']],
        limit: limit ? parseInt(limit, 10) : undefined
    });
    return alerts.map(alert => alert.get({ plain: true }));
}

async function markAlertAsRead(alertId, userId) {
    const alert = await Alert.findOne({
        where: { alert_id: alertId, user_id: userId }
    });
    if (!alert) {
        throw new Error('Alert not found or access denied.');
    }
    if (alert.is_read) {
        return alert.get({ plain: true }); 
    }
    try {
        const updatedAlert = await alert.update({ is_read: true });
        return updatedAlert.get({ plain: true });
    } catch (error) {
        console.error(`Error marking alert ${alertId} as read:`, error);
        throw new Error("Could not mark alert as read.");
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
        console.error(`Error marking all alerts as read for user ${userId}:`, error);
        throw new Error("Could not mark all alerts as read.");
    }
}

async function deleteAlert(alertId, userId) {
     const alert = await Alert.findOne({
        where: { alert_id: alertId, user_id: userId }
    });
    if (!alert) {
        throw new Error('Alert not found or access denied.');
    }
    await alert.destroy();
    return { message: 'Alert deleted successfully.' };
}


module.exports = {
    createAlert,
    getAlertsForUser,
    markAlertAsRead,
    markAllAlertsAsReadForUser,
    deleteAlert
};
