import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    type: '',
    title: '',
    description: '',
    durationMinutes: 30,
    passScorePercentage: 0.7,
    targetQuestions: 20,
    selectedQuestions: []
};
const examEditorSlice = createSlice({
    name: 'examEditor',
    initialState,
    reducers: {
        updateExamInfo: (state, action) => {
            const { field, value } = action.payload;
            state[field] = value;
        },
        addQuestion: (state, action) => {
            const incomingQuestions = Array.isArray(action.payload)
                ? action.payload
                : [action.payload];

            incomingQuestions.forEach(newQ => {
                const isExist = state.selectedQuestions.some(q => q.id === newQ.id);
                if (!isExist) {
                    state.selectedQuestions.push(newQ);
                }
            });
        },
        removeQuestion: (state, action) => {
            const questionId = action.payload;
            state.selectedQuestions = state.selectedQuestions.filter(q => q.id !== questionId);
        },
        resetEditor: (state) => {
            return initialState;
        }
    }
});

export const { updateExamInfo, addQuestion, removeQuestion, resetEditor } = examEditorSlice.actions;
export default examEditorSlice.reducer;

