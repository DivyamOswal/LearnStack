import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean; // true until the initial "am I logged in" check completes
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
    finishInitializing: (state) => {
      state.isInitializing = false;
    },
  },
});

export const { setUser, clearUser, finishInitializing } = authSlice.actions;
export default authSlice.reducer;