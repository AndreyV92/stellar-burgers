import { userReducer } from './userSlice';
import {
  registerUser,
  loginUser,
  forgotPass,
  userApi,
  updateUser,
  logoutUser
} from './userSliceApi';
import type { TUser } from '../../../utils/types';

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

const fakeUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('userSlice reducer', () => {
  test('должен вернуть initial state', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('registerUser.fulfilled', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: { user: fakeUser }
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      registerError: null,
      userData: fakeUser
    });
  });

  test('loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: { user: fakeUser }
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      loginError: null,
      isAuthenticated: true,
      userData: fakeUser
    });
  });

  test('logoutUser.fulfilled (успешный выход)', () => {
    const loggedInState: TInitialState = {
      ...initialState,
      isAuthenticated: true,
      userData: fakeUser
    };

    const action = {
      type: logoutUser.fulfilled.type,
      payload: { success: true }
    };

    const state = userReducer(loggedInState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      userData: null,
      isAuthenticated: false,
      userDataError: null
    });
  });

  test('logoutUser.rejected (ошибка выхода)', () => {
    const loggedInState: TInitialState = {
      ...initialState,
      isAuthenticated: true,
      userData: fakeUser
    };

    const action = { type: logoutUser.rejected.type };
    const state = userReducer(loggedInState, action);

    expect(state.isLoading).toBe(false);
    expect(state.userDataError).toBe('Ошибка при выходе из аккаунта');
    expect(state.userData).toEqual(fakeUser);
  });

  test('updateUser.fulfilled', () => {
    const updatedUser: TUser = { ...fakeUser, name: 'Updated User' };

    const action = {
      type: updateUser.fulfilled.type,
      payload: { user: updatedUser }
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      updateUserError: null,
      userData: updatedUser
    });
  });

  test('forgotPass.rejected', () => {
    const action = {
      type: forgotPass.rejected.type,
      error: { message: 'Ошибка при восстановлении пароля' }
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      forgotPassError: 'Ошибка при восстановлении пароля'
    });
  });

  test('userApi.fulfilled (успешная проверка авторизации)', () => {
    const action = {
      type: userApi.fulfilled.type,
      payload: { user: fakeUser }
    };
    const state = userReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      authenticatedError: null,
      userData: fakeUser,
      isAuthenticated: true
    });
  });

  test('userApi.rejected (ошибка авторизации)', () => {
    const action = {
      type: userApi.rejected.type,
      error: { message: 'Не авторизован' }
    };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.authenticatedError).toBe('Не авторизован');
  });
});