import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // La URL de tu Spring Boot
});

export default api;