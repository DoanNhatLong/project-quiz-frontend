import api from "../api/axios.js";

export const getQuestions = (quizId, page, search) => {
    return api.get(`/admin/questions/${quizId}`, {
        params: {
            page: page,
            size: 10,
            content: search
        }
    })
        .then(res => res.data)
};

export const getQuestion = (questionId) => {
    return api.get(`/admin/questions/question/${questionId}`)
        .then(res => res.data);
};

export const updateQuestion = (questionId, questionPayload) => {
    return api.put(`/questions/${questionId}`, questionPayload)
        .then(res => res.data);
};

export const createExam = (examPayload) => {
    return api.post("/admin/exams/create", examPayload)
        .then(res => res.data);
};

export const getAllExams = () => {
    return api.get("/admin/exams")
        .then(res => res.data);
}

export const getExam = (examId) => {
    return api.get(`/admin/exams/${examId}`)
        .then(res => res.data);
}

export const getExamQuestions = (examId, page) => {
    return api.get(`/admin/exams/${examId}/questions`, {
        params: {
            page: page,
            size: 10
        }
    })
        .then(res => res.data);
}

export const createChallenger = (challengerPayload) => {
    return api.post("/admin/challenges/create", challengerPayload)
        .then(res => res.data);
}

export const getAllChallengers = () => {
    return api.get("/api/challenges/find")
        .then(res => res.data);
}

export const getAllSubjects = () => {
    return api.get("/admin/subjects")
        .then(res => {
            const data = res.data;
            if (Array.isArray(data)) {
                return data.sort((a, b) => a.id - b.id);
            }
            return data;
        });
}

export const createSubject = (subjectPayload) => {
    return api.post("/admin/subjects/create", subjectPayload)
        .then(res => res.data);
}

export const getSubject = (quizId) => {
    return api.get(`/admin/subjects/quizzes/${quizId}`)
        .then(res => res.data);
}

export const deleteExam = (examId) => {
    return api.delete(`/admin/exams/${examId}`)
        .then(res => res.data);
}

export const getChallengerById = (challengeId) => {
    return api.get(`/api/challenges/${challengeId}`)
        .then(res => res.data);
}

export const getChallengerExam = (examId) => {
    return api.get(`/api/challenges/exam/${examId}`)
        .then(res => res.data);
}

export const createSnapshot = (snapshotPayload) => {
    return api.post("/api/challenges/snapshot", snapshotPayload)
        .then(res => res.data);
}

export const createAttempt = (examId, userId, challengeId) => {
    return api.post(`/api/challenges/attempts/${examId}/${userId}/${challengeId} `)
        .then(res => res.data);
}

export const tempExam = (payload) => {
    return api.post("/api/challenges/tempExam", payload)
        .then(res => res.data);
}

export const getTempAnswer = (attemptId) => {
    return api.get(`/api/challenges/${attemptId}/answers`)
        .then(res => res.data);
}

export const calculateScore = (attemptId) => {
    return api.post(`/api/challenges/${attemptId}/calculate`)
        .then(res => res.data);
}

export const getAllAdminLogs = (actionType) => {
    return api.get("/admin/details/log", {
        params: {
            actionType: actionType
        }
    })
        .then(res => res.data);
};

export const getDuration = (examId) => {
    return api.get(`/duration/${examId}`)
        .then(res => res.data);
}

export const getStats = () => {
    return api.get ("/admin/details/count")
        .then (res =>res.data)

}

export const checkExam = (userId) => {
    return api.get (`/admin/challenges/check/${userId}`)
        .then(res =>res.data)
}

export const checkResult = (examId) =>{
    return api.get (`/check/${examId}`)
        .then(res => res.data)
}

