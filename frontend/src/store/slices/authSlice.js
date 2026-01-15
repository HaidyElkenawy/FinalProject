import { createSlice } from '@reduxjs/toolkit';
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 1. Start Loading
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // 2. Login/Register Success
    authSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },

    // 3. Failure
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 4. Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { authStart, authSuccess, authFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;