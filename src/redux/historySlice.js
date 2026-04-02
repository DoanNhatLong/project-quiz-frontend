import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getUserQuizAttempts} from '../service/quizService';

export const fetchUserHistory = createAsyncThunk(
    'history/fetchUserHistory',
    async (userId, { rejectWithValue }) => {
        try {
            return await getUserQuizAttempts(userId);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const historySlice = createSlice({
    name: 'history',
    initialState: {
        attempts: [],
        loading: false,
        error: null,
    },
    reducers: {
        addAttempt: (state, action) => {
            state.attempts.unshift(action.payload);
        },
        clearHistory: (state) => {
            state.attempts = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.attempts = action.payload;
            })
            .addCase(fetchUserHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { addAttempt, clearHistory } = historySlice.actions;
export default historySlice.reducer;