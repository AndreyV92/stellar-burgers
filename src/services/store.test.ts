import store, { rootReducer } from './store';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' } as any;

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual(store.getState());
  });
});
