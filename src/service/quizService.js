import api from "../api/axios.js";


const API_BASE_URL = "http://localhost:8080/quizzes";
const API_ATTEMPTS_URL = "http://localhost:8080/quiz-attempts";

export const getQuestionsForPlay = async (quizId) => {
    try {
        const response = await api.get(`${API_BASE_URL}/${quizId}/play`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy câu hỏi bài thi:", error);
        throw error;
    }
};


export const submitQuizResult = async (submission) => {
    try {
        const response = await api.post(
            `${API_ATTEMPTS_URL}/submit`,
            submission
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi nộp bài thi:", error);
        throw error;
    }
};

export const getUserQuizAttempts = async (userId) => {
    try {
        const response = await api.get(`${API_ATTEMPTS_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử bài thi:", error);
        throw error;
    }
};

export const getQuizAttemptDetails = async (attemptId) => {
    try {
        const response = await api.get(`${API_ATTEMPTS_URL}/${attemptId}/answers`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết bài thi:", error);
        throw error;
    }
}

export const getQuizzesByCategory = (category) => {
    const params = category !== 'ALL' ? { language: category } : {};
        return api.get("/quizzes", {params})
            .then(res =>res.data)
    }
;