import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { userReducer } from './slices/userSlice/userSlice';
import { ingridientReducer } from './slices/ingridientsSlice/ingridientsSlice';
import { fetchOrderSubmitReducer } from './slices/orderSubmitSlice/orderSubmitSlice';
import { makeBurgerReducer } from './slices/makeBurgerSlise/makeBurgerSlise';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ordersReducer } from './slices/orderSlice/orderSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ingridients: ingridientReducer,
  orderSubmit: fetchOrderSubmitReducer,
  makeBurger: makeBurgerReducer,
  orders: ordersReducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
