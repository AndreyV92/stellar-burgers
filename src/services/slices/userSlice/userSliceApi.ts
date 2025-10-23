import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';

import { getCookie, setCookie, deleteCookie } from '../../../utils/cookie';
import { refreshToken } from '../../../utils/burger-api';

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const forgotPass = createAsyncThunk(
  'user/password-forgot',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response;
  }
);

export const resetPass = createAsyncThunk(
  'user/reset',
  async (data: { password: string; token: string }) => {
    const response = await resetPasswordApi(data);
    return response;
  }
);

export const userApi = createAsyncThunk('user/userApi', async () => {
  const response = await getUserApi();
  return response;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const response = await logoutApi();
  return response;
});
