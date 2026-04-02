import axios from 'axios';
import api from "../api/axios.js";

const AUTH_URL = 'http://localhost:8080/auth';
const USER_URL = 'http://localhost:8080/users';

export const userService = {
    getAllUsers: () => {
        return api.get(USER_URL)
            .then(response => response.data)
            .catch(() => []);
    },

    registerUser: (userData) => {
        const { username, email, password } = userData;
        return axios.post(`${AUTH_URL}/register`, { username, email, password });
    },

    checkDuplicate: (field, value, users) => {
        if (!value) return false;
        return users.some(user => user[field] === value);
    },

    loginUser: async (credentials) => {
        return await axios.post(`${AUTH_URL}/login`, credentials);
    },
    addXp: (payload) =>{
        return api.post("/users/add-xp", payload)
            .then(response => response.data)
    },

    getChallengesInfo: (userId) => {
        return api.get(`/users/challenges/${userId}`)
            .then(response => response.data)
    }
};
export const getReview = (attemptId) =>{
    return api.get(`/api/challenges/review/${attemptId}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Lỗi khi lấy thông tin review:", error);})
}

export const getSelectAnswer = (attemptId)=>{
    return api.get(`/api/challenges/${attemptId}/answers`)
        .then(response => response.data)
}

export const getSnapshot = (attemptId) =>{
    return api.get(`/users/snapshot/${attemptId}`)
        .then(response => response.data)
}