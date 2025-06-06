// client/src/services/sensorService.js
import apiClient from './api';

export const getAllSensorsForUser = async () => {
    try {
        const response = await apiClient.get('/sensors');
        return response.data;
    } catch (error) {
        console.error("Error fetching user sensors:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const registerSensorOnFrontend = async (sensorData) => {
    try {
        const response = await apiClient.post('/sensors', sensorData);
        return response.data;
    } catch (error) {
        console.error("Error registering sensor:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const getSensorDetails = async (sensorId) => {
    try {
        const response = await apiClient.get(`/sensors/${sensorId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching sensor details for ${sensorId}:`, error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const updateSensorOnFrontend = async (sensorId, updateData) => {
    try {
        const response = await apiClient.put(`/sensors/${sensorId}`, updateData);
        return response.data;
    } catch (error) {
        console.error(`Error updating sensor ${sensorId}:`, error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const deleteSensorOnFrontend = async (sensorId) => {
    try {
        await apiClient.delete(`/sensors/${sensorId}`);
        return { success: true };
    } catch (error) {
        console.error(`Error deleting sensor ${sensorId}:`, error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};