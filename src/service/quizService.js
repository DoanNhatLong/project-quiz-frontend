import api from "../api/axios.js";

export const getQuestionsForPlay = async (quizId) => {
    try {
        const response = await api.get(`quizzes/${quizId}/play`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy câu hỏi bài thi:", error);
        throw error;
    }
};


export const submitQuizResult = async (submission) => {
    try {
        const response = await api.post(
            `quiz-attempts/submit`,
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
        const response = await api.get(`quiz-attempts/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử bài thi:", error);
        throw error;
    }
};

export const getQuizAttemptDetails = async (attemptId) => {
    try {
        const response = await api.get(`quiz-attempts/${attemptId}/answers`);
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