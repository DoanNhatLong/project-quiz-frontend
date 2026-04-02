import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../api/axios.js";

// 1. Thunk để fetch toàn bộ quiz từ Backend
export const fetchAllQuizzes = createAsyncThunk(
    'quizzes/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/quizzes');
            return response.data; // Giả sử trả về mảng []
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const quizSlice = createSlice({
    name: 'quizzes',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Bạn có thể thêm các reducer thủ công ở đây (ví dụ: xóa 1 quiz khỏi list sau khi API thành công)
        removeQuizFromStore: (state, action) => {
            state.items = state.items.filter(quiz => quiz.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllQuizzes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAllQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { removeQuizFromStore } = quizSlice.actions;
export default quizSlice.reducer;