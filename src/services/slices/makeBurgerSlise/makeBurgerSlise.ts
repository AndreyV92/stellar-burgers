import { createSlice, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../../utils/types';

export type TInitialState = {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
};

export const initialState: TInitialState = {
  ingredients: [],
  bun: null
};

export const makeBurgerSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialState,
  reducers: {
    addItem: {
      reducer: (state, action) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id }, error: null, meta: null };
      }
    },
    upItem: (state, action) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index > 0) {
        [state.ingredients[index - 1], state.ingredients[index]] = [
          state.ingredients[index],
          state.ingredients[index - 1]
        ];
      }
    },
    deleteItem: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient._id !== action.payload._id
      );
    },
    downItem: (state, action) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },
    cleanIngridients: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
  }
});

export const { addItem, upItem, deleteItem, downItem, cleanIngridients } =
  makeBurgerSlice.actions;
export const makeBurgerReducer = makeBurgerSlice.reducer;
