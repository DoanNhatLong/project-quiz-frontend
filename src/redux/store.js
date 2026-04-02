import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import historyReducer from './historySlice';
import quizReducer from './quizSlice';
import examEditorReducer from './examEditorSlice';

const loadExamEditorState = () => {
    try {
        const serializedState = localStorage.getItem('exam_editor_draft');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (err) {
        console.log(err)
        return undefined;
    }
};

export const store = configureStore({
    reducer: {
        user: userReducer,
        history: historyReducer,
        quizzes: quizReducer,
        examEditor: examEditorReducer,
    },
    preloadedState: {
        examEditor: loadExamEditorState()
    }
});


store.subscribe(() => {
    try {
        const state = store.getState().examEditor;
        localStorage.setItem('exam_editor_draft', JSON.stringify(state));
    } catch (err) {
        console.error("Could not save state", err);
    }
});