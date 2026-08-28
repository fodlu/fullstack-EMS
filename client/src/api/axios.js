import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
    baseURL: (import.meta.env.VITE_BASE_URL || "http://localhost:5000/api")
=======

    baseURL: (import.meta.env.VITE_BASE_URL || "http://localhost:5000/api")

>>>>>>> 1c495c5f0cfe822b9f7afc3e1eefa095e58e0cdf
})

// Attach Auth token to all network requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})

export default api;