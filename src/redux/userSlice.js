import { createSlice } from '@reduxjs/toolkit';

// Hàm lấy dữ liệu ban đầu từ LocalStorage
const getInitialUser = () => {
    const item = localStorage.getItem('user');
    return item ? JSON.parse(item) : null;
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: getInitialUser(),
    },
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload;
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('user');
            }
        },
        updateXp: (state, action) => {
            if (state.data) {
                state.data.xp += action.payload;
                localStorage.setItem('user', JSON.stringify(state.data));
            }
        },
        logout: (state) => {
            state.data = null;
            localStorage.removeItem('user');
        }
    },
});

export const { setUser, logout , updateXp} = userSlice.actions;
export default userSlice.reducer;