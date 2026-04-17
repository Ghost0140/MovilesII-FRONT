import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Este "Interceptor" actúa como un peaje: cada vez que sale una petición,
// revisa si hay un token en el localStorage y lo pega.
clienteAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default clienteAxios;