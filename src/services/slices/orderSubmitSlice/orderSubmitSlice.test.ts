import {
  fetchOrderSubmitReducer,
  closeModalOrderSubmit,
  fetchOrderSubmit,
  initialState,
  TInitialState
} from './orderSubmitSlice';
import type { TOrder } from '@utils-types';


const sampleOrder: TOrder = {
  _id: 'order-1',
  ingredients: ['1', '2'],
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '2024-02-17T13:10:27.612Z',
  updatedAt: '2024-02-17T13:10:28.088Z',
  number: 101,
};

describe('orderSubmitSlice reducer', () => {
  test('должен вернуть initial state', () => {
    expect(fetchOrderSubmitReducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  test('fetchOrderSubmit.pending', () => {
    const action = { type: fetchOrderSubmit.pending.type };
    const state = fetchOrderSubmitReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null,
      orderAccept: false,
      orderRequest: true
    });
  });

  test('fetchOrderSubmit.fulfilled', () => {
    const action = {
      type: fetchOrderSubmit.fulfilled.type,
      payload: { order: sampleOrder }
    };
    const state = fetchOrderSubmitReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: null,
      orderData: sampleOrder,
      orderAccept: true,
      orderRequest: false
    });
  });

  test('fetchOrderSubmit.rejected', () => {
    const action = {
      type: fetchOrderSubmit.rejected.type,
      error: { message: 'Не удалось оформить заказ' }
    };
    const state = fetchOrderSubmitReducer(
      { ...initialState, orderRequest: true },
      action
    );

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      orderAccept: false,
      orderRequest: false,
      error: 'Не удалось оформить заказ'
    });
  });

  test('closeModalOrderSubmit очищает данные заказа', () => {
    const startState: TInitialState = {
      ...initialState,
      orderData: sampleOrder,
      orderRequest: true
    };

    const state = fetchOrderSubmitReducer(startState, closeModalOrderSubmit());

    expect(state.orderData).toBeNull();
    expect(state.orderRequest).toBe(false);
  });
});