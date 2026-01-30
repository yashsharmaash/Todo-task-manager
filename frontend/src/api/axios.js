import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    // Important for cookie-based auth
    withCredentials: true
});

// Response interceptor to handle 401s (token expiration)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Check if we are not already on the login page to avoid loops
            if (window.location.pathname !== '/login') {
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
