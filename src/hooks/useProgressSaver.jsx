import { useCallback } from 'react';
import {tempExam} from "../service/adminService.js";

export const useProgressSaver = (attemptId) => {

    const trackProgress = useCallback(async (newAnswer) => {
        const STORAGE_KEY = `pending_answers_${attemptId}`;
        const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        const updatedData = [
            ...localData.filter(item => item.questionId !== newAnswer.questionId),
            newAnswer
        ];

        if (updatedData.length >= 5) {
            try {
                console.log("🚀 Đã lưu batch 5 câu xuống Database");
                await tempExam({ attemptId, data: updatedData });
                localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                console.error("❌ Lỗi lưu progress:", error);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
            }
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        }
    }, [attemptId]);

    return { trackProgress };
};