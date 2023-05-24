import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../shared/store';

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type AuthState = { user: User | null }

const initialState: AuthState = {
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: state => {
      state.user = null;
    }
  }
});

export const { login, logout } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;