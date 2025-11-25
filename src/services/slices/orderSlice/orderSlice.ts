import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TInitialState = {
  orders: TOrder[];
  error: string | null;
  isLoading: boolean;
  feed: { total: number; totalToday: number };
  orderData: null | TOrder;
};

export const initialState: TInitialState = {
  orders: [],
  error: null,
  isLoading: false,
  feed: { total: 0, totalToday: 0 },
  orderData: null
};

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async () => await getOrdersApi()
);

export const fetchFeeds = createAsyncThunk(
  'order/fetchFeeds',
  async () => await getFeedsApi()
);

export const fetchOrderData = createAsyncThunk(
  'orderData/getOrderByNumberApi',
  async (number: number) => await getOrderByNumberApi(number)
);

const orderSlice = createSlice({
  name: 'orderSlice',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOrders.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '';
        state.orders = [];
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload;
      })

      .addCase(fetchFeeds.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.orders = [];
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '';
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.feed = {
          totalToday: action.payload.totalToday,
          total: action.payload.total
        };
      })
      .addCase(fetchOrderData.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '';
        state.orderData = null;
      })
      .addCase(fetchOrderData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // предполагаем, что API вернёт объект { orders: TOrder[] }
        state.orderData = action.payload.orders[0] ?? null;
      });
  }
});

export const ordersReducer = orderSlice.reducer;
