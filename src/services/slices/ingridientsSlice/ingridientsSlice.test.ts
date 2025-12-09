import { ingridientReducer, fetchIngredients } from './ingridientsSlice';
import type { TIngredient } from '../../../utils/types';
import { initialState } from './ingridientsSlice';

const sampleIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 150,
    price: 100,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile'
  },
  {
    _id: '2',
    name: 'Начинка',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 30,
    calories: 250,
    price: 200,
    image: 'image2',
    image_large: 'image_large2',
    image_mobile: 'image_mobile2'
  }
];

describe('ingridientSlice reducer', () => {
  test('должен вернуть initial state', () => {
    expect(ingridientReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingridientReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: sampleIngredients
    };
    const state = ingridientReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: null,
      listItem: sampleIngredients
    });
  });

  test('fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка при загрузке ингредиентов' }
    };
    const state = ingridientReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка при загрузке ингредиентов'
    });
  });
});
