import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthReady: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginPending: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    login: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      state.isAuthReady = true;
    },
    loginFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthReady = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { loginPending, login, loginFailed, logout, clearError } = authSlice.actions;
export default authSlice.reducer;