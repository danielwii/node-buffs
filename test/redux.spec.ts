import { reduxAction, reduxTAction } from '../src/redux';

describe('reduxAction', () => {
  it('should return correct action', () => {
    expect(reduxAction('TEST', { test: 1 }, 'error message')).toEqual({
      error: 'error message',
      payload: { test: 1 },
      type: 'TEST',
    });
    expect(reduxAction('TEST', { test: 1 })).toEqual({
      error: undefined,
      payload: { test: 1 },
      type: 'TEST',
    });
    expect(reduxAction('TEST')).toEqual({
      error: undefined,
      payload: {},
      type: 'TEST',
    });
  });
});

describe('reduxTAction', () => {
  it('should return correct action', () => {
    expect(reduxTAction('TEST', { test: 1 }, 'error message')).toEqual({
      transient: true,
      error: 'error message',
      payload: { test: 1 },
      type: 'TEST',
    });
    expect(reduxTAction('TEST', { test: 1 })).toEqual({
      transient: true,
      error: undefined,
      payload: { test: 1 },
      type: 'TEST',
    });
    expect(reduxTAction('TEST')).toEqual({
      transient: true,
      error: undefined,
      payload: {},
      type: 'TEST',
    });
  });
});
