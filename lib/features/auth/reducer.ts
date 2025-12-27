import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from './types';
import { login, register, validateAccount, checkAuth, fetchWalletDetails, addWallet } from './actions';

const initialState: AuthState = {
  userInfo: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  status: 'idle',
  error: null,
  walletsInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.walletsInfo = null;
      localStorage.removeItem('token');
      localStorage.removeItem('_c'); // Clear credentials on logout
    },
    updateBalance: (state, action) => {
        if (state.userInfo) {
            state.userInfo.balance = action.payload;
        }
    },
    updateWalletAssets: (state, action) => {
        if (state.walletsInfo && state.walletsInfo.store) {
            const { symbol, quantity, name, id } = action.payload;
            const existingAsset = state.walletsInfo.store.find((a: any) => a.symbol === symbol || a.id === id);
            
            if (existingAsset) {
                existingAsset.quantity += quantity;
                // Remove if quantity <= 0? Maybe keep it as 0.
            } else if (quantity > 0) {
                // Add new asset
                state.walletsInfo.store.push({
                    id: id || 'temp-id',
                    name: name || symbol,
                    symbol: symbol,
                    quantity: quantity,
                    // Add other required fields if necessary with defaults
                });
            }
        }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Validate Account
      .addCase(validateAccount.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(validateAccount.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(validateAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
         state.status = 'loading';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
         state.status = 'succeeded';
         state.userInfo = action.payload;
         if (action.payload.token) {
            state.token = action.payload.token;
         }
      })
      .addCase(checkAuth.rejected, (state, action) => {
         state.status = 'idle'; 
         state.token = null;
         state.userInfo = null;
         state.walletsInfo = null;
      })
      // Fetch Wallet Details
      .addCase(fetchWalletDetails.fulfilled, (state, action) => {
         state.walletsInfo = action.payload.data;
         if (state.userInfo && state.userInfo.wallets) {
             const walletIndex = state.userInfo.wallets.findIndex(w => w.walletAddress === action.payload.walletId); // Assuming walletId is address
             if (walletIndex !== -1) {
                 state.userInfo.wallets[walletIndex].details = action.payload.data;
             }
         }
      })
      // Add Wallet
      .addCase(addWallet.fulfilled, (state, action) => {
          if (state.userInfo) {
              if (!state.userInfo.walletsSaved) {
                  state.userInfo.walletsSaved = [];
              }
              state.userInfo.walletsSaved.push({
                  label: action.payload.label,
                  walletAddress: action.payload.walletAddress,
              });
          }
      });
  },
});

export const { logout, updateBalance, updateWalletAssets } = authSlice.actions;
export default authSlice.reducer;
