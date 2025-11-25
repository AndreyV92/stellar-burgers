import {
  ordersReducer,
  fetchOrders,
  fetchFeeds,
  fetchOrderData,
  initialState
} from './orderSlice';
import type { TOrder } from '@utils-types';

const sampleOrder: TOrder = {
  _id: 'order-1',
  ingredients: ['1', '2'],
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2024-02-17T13:10:27.612Z',
  updatedAt: '2024-02-17T13:10:28.088Z',
  number: 100,
};

const feedsPayload = {
  orders: [sampleOrder],
  total: 2000,
  totalToday: 50
};

describe('orderSlice reducer', () => {
  test('должен вернуть initial state', () => {
    expect(ordersReducer(undefined, { type: '' })).toEqual(initialState);
  });


  test('fetchOrders.pending', () => {
    const action = { type: fetchOrders.pending.type };
    const state = ordersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('fetchOrders.fulfilled', () => {
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: [sampleOrder]
    };
    const state = ordersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      orders: [sampleOrder],
      isLoading: false,
      error: null
    });
  });

  test('fetchOrders.rejected', () => {
    const action = {
      type: fetchOrders.rejected.type,
      error: { message: 'Ошибка загрузки заказов' }
    };
    const state = ordersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка загрузки заказов',
      orders: []
    });
  });

  test('fetchFeeds.pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = ordersReducer(
      {
        ...initialState,
        orders: [sampleOrder]
      },
      action
    );

    expect(state).toEqual({
      ...initialState,
      orders: [],
      isLoading: true,
      error: null
    });
  });

  test('fetchFeeds.fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: feedsPayload
    };
    const state = ordersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      orders: [sampleOrder],
      feed: { total: 2000, totalToday: 50 },
      isLoading: false,
      error: null
    });
  });

  test('fetchFeeds.rejected', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: 'Ошибка загрузки фида' }
    };
    const state = ordersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка загрузки фида'
    });
  });


  test('fetchOrderData.pending', () => {
    const action = { type: fetchOrderData.pending.type };
    const state = ordersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('fetchOrderData.fulfilled', () => {
    const action = {
      type: fetchOrderData.fulfilled.type,
      payload: { orders: [sampleOrder] }
    };
    const state = ordersReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orderData).toEqual(sampleOrder);
  });

  test('fetchOrderData.rejected', () => {
    const action = {
      type: fetchOrderData.rejected.type,
      error: { message: 'Ошибка загрузки заказа' }
    };
    const state = ordersReducer(
      { ...initialState, orderData: sampleOrder },
      action
    );

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка загрузки заказа',
      orderData: null
    });
  });
});