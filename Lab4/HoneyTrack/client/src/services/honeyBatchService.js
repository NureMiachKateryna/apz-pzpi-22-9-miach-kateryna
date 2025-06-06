// client/src/services/honeyBatchService.js
import apiClient from './api';

export const getAllHoneyBatches = async () => {
    try {
        const response = await apiClient.get('/honey-batches');
        return response.data;
    } catch (error) {
        console.error("Error fetching honey batches:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const createHoneyBatch = async (batchData) => {
    try {
        const response = await apiClient.post('/honey-batches', batchData);
        return response.data;
    } catch (error) {
        console.error("Error creating honey batch:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const updateHoneyBatch = async (batchId, updateData) => {
    try {
        const response = await apiClient.put(`/honey-batches/${batchId}`, updateData);
        return response.data;
    } catch (error) {
        console.error(`Error updating honey batch ${batchId}:`, error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const deleteHoneyBatch = async (batchId) => {
    try {
    
        await apiClient.delete(`/honey-batches/${batchId}`);
        return { success: true, message: 'Batch deleted successfully' };
    } catch (error) {
        console.error(`Error deleting honey batch ${batchId}:`, error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};


export const getStorageLocations = async () => {
    try {
        const response = await apiClient.get('/storage-locations');
        return response.data;
    } catch (error) {
        console.error("Error fetching storage locations:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};


export const getAllStorageLocations = async () => {
    try {
        const response = await apiClient.get('/storage-locations');
        return response.data;
    } catch (error) {
        console.error("Error fetching storage locations:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};

export const createStorageLocation = async (locationData) => {
    try {
        const response = await apiClient.post('/storage-locations', locationData);
        return response.data;
    } catch (error) {
        console.error("Error creating storage location:", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};