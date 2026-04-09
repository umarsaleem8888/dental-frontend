
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem('isAuth') === 'true',
  user: localStorage.getItem('isAuth') === 'true' ? { email: 'abc@gamil.com', name: 'Admin User' } : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true;
      state.user = { email: action.payload.email, name: 'Admin User' };
      localStorage.setItem('isAuth', 'true');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('isAuth');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
