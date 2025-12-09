import { getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TInitialState = {
  error: string | null;
  isLoading: boolean;
  orderData: TOrder | null;
  orderAccept: boolean;
  orderRequest: boolean;
};

export const initialState: TInitialState = {
  error: null,
  isLoading: false,
  orderData: null,
  orderAccept: false,
  orderRequest: false
};

export const fetchOrderSubmit = createAsyncThunk(
  'orderSubmit/fetchOrderSubmit',
  async (data: string[]) => await orderBurgerApi(data)
);

const orderSubmitSlice = createSlice({
  name: 'orderSlice',
  initialState: initialState,
  reducers: {
    closeModalOrderSubmit: (state) => {
      state.orderData = null;
      state.orderRequest = false;
    }
  },
  selectors: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOrderSubmit.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.orderAccept = false;
        state.orderRequest = true;
      })
      .addCase(fetchOrderSubmit.rejected, (state, action) => {
        state.isLoading = false;
        state.orderAccept = false;
        state.orderRequest = false;
        state.error = action.error.message || '';
      })
      .addCase(fetchOrderSubmit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload.order;
        state.orderAccept = true;
        state.orderRequest = false;
      });
  }
});

export const { closeModalOrderSubmit } = orderSubmitSlice.actions;
export const fetchOrderSubmitReducer = orderSubmitSlice.reducer;
