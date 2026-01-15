import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './features/uiSlice';
import gameReducer from './features/gameSlice';
import authReducer from './features/auth/reducer';
import economyReducer from './features/economySlice';
import marketReducer from './features/market/reducer';
import blockchainReducer from './features/blockchain/reducer';
import transactionsReducer from './features/transactions/reducer';

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      game: gameReducer,
      auth: authReducer,
      economy: economyReducer,
      market: marketReducer,
      blockchain: blockchainReducer,
      transactions: transactionsReducer,
    },
    devTools: {
        actionSanitizer: (action) => {
            const typedAction = action as { type: string; payload?: unknown };
            return (typedAction.type === 'auth/login/fulfilled' && typedAction.payload 
                ? { ...typedAction, payload: '<<LONG_BLOB>>' } 
                : typedAction) as typeof action;
        },
        stateSanitizer: (state) => {
             const typedState = state as { auth?: { userInfo?: { transactions?: unknown } } };
             return (typedState.auth && typedState.auth.userInfo && typedState.auth.userInfo.transactions
                ? { ...typedState, auth: { ...typedState.auth, userInfo: { ...typedState.auth.userInfo, transactions: '<<LONG_BLOB>>' } } }
                : typedState) as typeof state;
        }
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
