import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  role: null,
};

// Load initial state from localStorage if it exists
const persistedState = localStorage.getItem('auth')
  ? JSON.parse(localStorage.getItem('auth'))
  : initialState;

const authSlice = createSlice({
  name: 'auth',
  initialState: persistedState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.role = user?.role;
      state.username = user?.username;
      localStorage.setItem('auth', JSON.stringify({ user, token, role: user?.role }));
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('auth');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;