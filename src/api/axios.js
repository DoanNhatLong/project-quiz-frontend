import axios from 'axios';
import {toast} from "react-toastify";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginApi = error.config.url.includes('/auth/login');

        if (error.response && error.response.status === 401 && !isLoginApi) {

            const serverMessage = error.response.data?.message || error.response.data;

            if (serverMessage === "Tài khoản đã đăng nhập ở thiết bị khác!") {
                toast.error("⚠️ " + serverMessage);
            } else {
                toast.warn("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            setTimeout(() => {
                window.location.href = '/login';
            }, 2500);
        }
        return Promise.reject(error);
    }
);
export default api;