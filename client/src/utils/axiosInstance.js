import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
<<<<<<< HEAD
    baseURL: API_URL,
=======
    baseURL: "https://mybudgyh.onrender.com",  // for local development
>>>>>>> 760ddff91b74a4d2853857fd833e5a321e8e4abc
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
