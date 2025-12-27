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
        actionSanitizer: (action: any) => {
            return action.type === 'auth/login/fulfilled' && action.payload 
                ? { ...action, payload: '<<LONG_BLOB>>' } 
                : action;
        },
        stateSanitizer: (state: any) => {
             return state.auth && state.auth.userInfo && state.auth.userInfo.transactions
                ? { ...state, auth: { ...state.auth, userInfo: { ...state.auth.userInfo, transactions: '<<LONG_BLOB>>' } } }
                : state;
        }
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
