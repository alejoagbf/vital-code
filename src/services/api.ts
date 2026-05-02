import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

// 1. Instancia base
export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 6000,
});

// 2. Interceptor: inyecta el token en cada petición
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('vitalcode_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// 3. Interceptor: expulsa al usuario si el token expira (Error 401)
apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('vitalcode_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);