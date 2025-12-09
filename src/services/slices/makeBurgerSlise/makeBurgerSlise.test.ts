import {
  makeBurgerReducer,
  addItem,
  upItem,
  deleteItem,
  downItem,
  cleanIngridients
} from './makeBurgerSlise';
import type { TConstructorIngredient, TIngredient } from '../../../utils/types';

import { initialState } from './makeBurgerSlise';
import { TInitialState } from './makeBurgerSlise';

const bun: TConstructorIngredient = {
  _id: 'bun-1',
  name: 'Булка N-200i',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 100,
  image: 'image-bun',
  image_large: 'image-bun-large',
  image_mobile: 'image-bun-mobile',
  id: 'bun-1-instance'
};

const ingredientOne: TConstructorIngredient = {
  _id: 'main-1',
  name: 'Котлета №1',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 30,
  calories: 250,
  price: 200,
  image: 'image-main-1',
  image_large: 'image-main-1-large',
  image_mobile: 'image-main-1-mobile',
  id: 'main-1-instance'
};

const ingredientTwo: TConstructorIngredient = {
  _id: 'main-2',
  name: 'Котлета №2',
  type: 'main',
  proteins: 25,
  fat: 15,
  carbohydrates: 35,
  calories: 300,
  price: 250,
  image: 'image-main-2',
  image_large: 'image-main-2-large',
  image_mobile: 'image-main-2-mobile',
  id: 'main-2-instance'
};

describe('makeBurgerSlice reducer', () => {
  test('должен вернуть initial state', () => {
    expect(makeBurgerReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('addItem: добавляет булку', () => {
    const state = makeBurgerReducer(initialState, addItem(bun as TIngredient));
    expect(state.bun?._id).toBe(bun._id);
  });

  test('addItem: добавляет начинку', () => {
    const state = makeBurgerReducer(
      initialState,
      addItem(ingredientOne as TIngredient)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(ingredientOne._id);
  });

  test('deleteItem: удаляет ингредиент по _id', () => {
    const startState: TInitialState = {
      bun,
      ingredients: [ingredientOne, ingredientTwo]
    };

    const state = makeBurgerReducer(startState, deleteItem({ _id: 'main-2' }));

    expect(state.ingredients).toEqual([ingredientOne]);
  });

  test('upItem: поднимает ингредиент выше', () => {
    const startState: TInitialState = {
      bun,
      ingredients: [ingredientOne, ingredientTwo]
    };

    const state = makeBurgerReducer(
      startState,
      upItem({ id: ingredientTwo.id })
    );

    expect(state.ingredients).toEqual([ingredientTwo, ingredientOne]);
  });

  test('downItem: опускает ингредиент ниже', () => {
    const startState: TInitialState = {
      bun,
      ingredients: [ingredientTwo, ingredientOne]
    };

    const state = makeBurgerReducer(
      startState,
      downItem({ id: ingredientTwo.id })
    );

    expect(state.ingredients).toEqual([ingredientOne, ingredientTwo]);
  });

  test('cleanIngridients: очищает конструктор', () => {
    const filledState: TInitialState = {
      bun,
      ingredients: [ingredientOne, ingredientTwo]
    };

    const state = makeBurgerReducer(filledState, cleanIngridients());
    expect(state).toEqual(initialState);
  });
});
