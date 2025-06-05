import axios from 'axios';
import { API_PATHS, BASE_URL } from './apiPath';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor to add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                if (error.config.url === API_PATHS.AUTH.GET_PROFILE) {
                    window.location.href = '/'; // Redirect to login on unauthorized access
                }
            } else if (error.response.status >= 500) {
                alert('Server error, please try again later.');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;