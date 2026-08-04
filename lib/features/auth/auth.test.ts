import { describe, it, expect } from 'vitest';
import authReducer from './reducer';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      userInfo: null,
      token: null,
      status: 'idle',
      error: null,
      walletsInfo: null,
    });
  });
});
