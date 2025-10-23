import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../../utils/types';

type TInitialState = {
  listItem: TIngredient[];
  isLoading: boolean;
  error: null | string;
};

const initialState: TInitialState = {
  listItem: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

const ingridientSlice = createSlice({
  name: 'ingridient',
  initialState: initialState,
  reducers: {},
  selectors: {},
  extraReducers(builder) {
    builder
      .addCase(fetchIngredients.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listItem = action.payload;
      });
  }
});

export const ingridientReducer = ingridientSlice.reducer;
