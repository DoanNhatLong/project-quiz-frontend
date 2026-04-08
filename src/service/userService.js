
import api from "../api/axios.js";

export const userService = {
    getAllUsers: (page = 0, size = 5) => {
        return api.get(`/users/admin`, {
            params: { page, size }
        })
            .then(response => response.data)
            .catch(() => []);
    },

    registerUser: (userData) => {
        const {username, email, password} = userData;
        return api.post(`/register`, {username, email, password});
    },

    checkDuplicate: (field, value, users) => {
        if (!value) return false;
        return users.some(user => user[field] === value);
    },

    loginUser: async (credentials) => {
        return await api.post(`/login`, credentials);
    },
    addXp: (payload) => {
        return api.post("/users/add-xp", payload)
            .then(response => response.data)
    },

    getChallengesInfo: (userId) => {
        return api.get(`/users/challenges/${userId}`)
            .then(response => response.data)
    }
};
export const getReview = (attemptId) => {
    return api.get(`/api/challenges/review/${attemptId}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Lỗi khi lấy thông tin review:", error);
        })
}

export const getSelectAnswer = (attemptId) => {
    return api.get(`/api/challenges/${attemptId}/answers`)
        .then(response => response.data)
}

export const getSnapshot = (attemptId) => {
    return api.get(`/users/snapshot/${attemptId}`)
        .then(response => response.data)
}

export const getAttempt = (attemptId) => {
    return api.get(`/users/attempt/${attemptId}`)
        .then(res => res.data)
}

export const sendReport = (payload) => {
    return api.post(`/report`, payload)
        .then(res => res.data)
}

export const getReport = (attemptId) => {
    return api.get(`/report/${attemptId}`)
        .then(res => res.data)
}

export const handleReport = (status) => {
    return api.get(`/report/get/${status}`)
        .then(res => res.data)
}

