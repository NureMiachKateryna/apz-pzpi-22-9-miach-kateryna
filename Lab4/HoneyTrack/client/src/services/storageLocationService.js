// client/src/services/storageLocationService.js
import apiClient from './api';


export const getAllStorageLocations = async () => {
    try {
        
        const response = await apiClient.get('/storage-locations');
        return response.data; 
    } catch (error) {
        console.error("Error fetching storage locations:", error.response || error.message);
        if (error.response) { 
            throw error.response; 
        }
        throw error; 
    }
};


export const createStorageLocation = async (locationData) => {
    
    try {
        const response = await apiClient.post('/storage-locations', locationData);
        return response.data; 
    } catch (error) {
        console.error("Error creating storage location:", error.response || error.message);
        if (error.response) {
            throw error.response;
        }
        throw error;
    }
};


export const updateStorageLocation = async (locationId, updateData) => {
    
    try {
        const response = await apiClient.put(`/storage-locations/${locationId}`, updateData);
        return response.data; 
    } catch (error) {
        console.error(`Error updating storage location ${locationId}:`, error.response || error.message);
        if (error.response) {
            throw error.response;
        }
        throw error;
    }
};


export const deleteStorageLocation = async (locationId) => {
    try {
       
        const response = await apiClient.delete(`/storage-locations/${locationId}`);
        
        return response.data || { success: true, message: 'Storage location deleted successfully' };
    } catch (error) {
        console.error(`Error deleting storage location ${locationId}:`, error.response || error.message);
        if (error.response) {
            throw error.response;
        }
        throw error;
    }
};