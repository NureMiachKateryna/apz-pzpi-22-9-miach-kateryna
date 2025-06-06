import apiClient from './api';


export const getAllUsersAdmin = async () => {
    try {
        const response = await apiClient.get('/admin/users'); 
        return response.data;
    } catch (error) {
        console.error("Error fetching all users (admin):", error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};


export const updateUserRoleAdmin = async (targetUserId, newRole) => {
    try {
        const response = await apiClient.put(`/admin/users/${targetUserId}/role`, { role: newRole });
        return response.data; 
    } catch (error) {
        console.error(`Error updating role for user ${targetUserId}:`, error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};


export const updateUserActiveStatusAdmin = async (targetUserId, isActive) => {
    try {
        const response = await apiClient.put(`/admin/users/${targetUserId}/status`, { isActive: isActive });
        return response.data;
    } catch (error) {
        console.error(`Error updating active status for user ${targetUserId}:`, error.response || error.message);
        if (error.response) throw error.response;
        throw error;
    }
};