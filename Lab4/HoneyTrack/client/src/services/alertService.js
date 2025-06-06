// client/src/services/alertService.js
import apiClient from './api';

export const getRecentUnreadAlerts = async (limit = 5) => {
    try {
        const response = await apiClient.get(`/alerts?isRead=false&sortBy=timestamp&sortOrder=DESC&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recent unread alerts:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const getAllAlertsForUser = async (options = {}) => {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.isRead !== undefined) params.append('isRead', options.isRead);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    try {
        const response = await apiClient.get(`/alerts?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all alerts:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const markAlertAsReadOnClient = async (alertId) => {
    try {
        const response = await apiClient.patch(`/alerts/${alertId}/read`);
        return response.data;
    } catch (error) {
        console.error(`Error marking alert ${alertId} as read:`, error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};