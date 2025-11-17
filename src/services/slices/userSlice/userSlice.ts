import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '../../../utils/types';
import {
  registerUser,
  loginUser,
  forgotPass,
  resetPass,
  userApi,
  updateUser,
  logoutUser
} from './userSliceApi';

type TInitialState = {
  isLoading: boolean;
  userData: TUser | null;
  registerError: null | string;
  loginError: null | string;
  logoutError: null | string;
  updateUserError: null | string;
  forgotPassError: null | string;
  userDataError: null | string;
  isAuthenticated: boolean;
  authenticatedError: null | string;
};

const initialState: TInitialState = {
  isLoading: false,
  userData: null,
  registerError: null,
  loginError: null,
  logoutError: null,
  updateUserError: null,
  forgotPassError: null,
  userDataError: null,
  isAuthenticated: false,
  authenticatedError: null
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  selectors: {},
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        (state.registerError = action.error.message || ''),
          (state.isLoading = false);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerError = null;
        state.isLoading = false;
        state.userData = action.payload.user;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.error.message || '';
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginError = null;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.userData = action.payload.user;
      })
      .addCase(forgotPass.pending, (state, action) => {
        state.isLoading = true;
        state.forgotPassError = null;
      })
      .addCase(forgotPass.rejected, (state, action) => {
        state.forgotPassError = action.error.message || '';
        state.isLoading = false;
      })
      .addCase(forgotPass.fulfilled, (state, action) => {
        state.loginError = null;
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.isLoading = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.updateUserError = action.error.message || '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isLoading = false;
        state.updateUserError = null;
      })
      .addCase(resetPass.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.isLoading = false;
        state.forgotPassError = action.error.message || '';
      })
      .addCase(resetPass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.forgotPassError = null;
      })
      .addCase(userApi.pending, (state, action) => {
        state.authenticatedError = null;
        state.isLoading = true;
      })
      .addCase(userApi.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.authenticatedError = action.error.message || '';
      })
      .addCase(userApi.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userData = action.payload.user;
        state.isLoading = false;
        state.authenticatedError = null;
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.isLoading = true;
        state.userDataError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.userDataError = 'Ошибка при выходе из аккаунта';
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          state.userData = null;
          state.userDataError = null;
          state.isAuthenticated = false;
        } else {
          state.userDataError = 'Ошибка при выходе из аккаунта';
        }
        state.isLoading = false;
      });
  }
});

export const userReducer = userSlice.reducer;
