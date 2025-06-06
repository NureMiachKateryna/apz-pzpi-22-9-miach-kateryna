// client/src/services/notificationSettingService.js
import apiClient from './api';

export const getMyNotificationSettings = async () => {
    try {
        const response = await apiClient.get('/notification-settings');
        return response.data;
    } catch (error) {
        console.error("Error fetching notification settings:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const setNotificationSetting = async (settingData) => {
    try {
        const response = await apiClient.post('/notification-settings', settingData);
        return response.data;
    } catch (error) {
        console.error("Error setting notification setting:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};