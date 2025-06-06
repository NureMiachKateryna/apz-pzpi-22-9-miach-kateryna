// client/src/services/authService.js
import apiClient from './api';

export const registerUser = async (userData) => {
    const payload = {
        username: userData.username,
        password: userData.password,
        email: userData.email,
    };
    return apiClient.post('/auth/register', payload);
};

export const loginUser = async (credentials) => {
    return apiClient.post('/auth/login', credentials);
};

export const getCurrentUser = async () => {
    return apiClient.get('/users/me');
};