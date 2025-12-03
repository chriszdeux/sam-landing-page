import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './features/uiSlice';
import gameReducer from './features/gameSlice';
import authReducer from './features/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      game: gameReducer,
      auth: authReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
