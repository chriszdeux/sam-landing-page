import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

interface Asset {
  id: string;
  identification: {
    name: string;
    symbol: string;
    image128: string;
    image256: string;
  };
  financial: {
    price: number;
    change24h: number;
    marketCap?: string; // Optional as it's not in the sample
    volume?: string;    // Optional as it's not in the sample
    supply?: string;    // Optional as it's not in the sample
  };
  additionalInfo: {
    pColor: string;
    sColor: string;
    description?: string;
  };
  history?: { date: string; price: number }[];
}

interface EconomyState {
  assets: Asset[];
  selectedAsset: Asset | null;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalMarketCap: string;
  totalVolume: string;
}

const initialState: EconomyState = {
  assets: [],
  selectedAsset: null,
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  totalMarketCap: '0',
  totalVolume: '0',
};

// Async Thunks
export const fetchAssets = createAsyncThunk(
  'economy/fetchAssets',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      // Backend route: GET /blockchain/cryptocurrencies (maps to getCryptocurrencies)
      const response = await api.get(`/blockchain/crypto`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assets');
    }
  }
);

export const fetchAssetDetails = createAsyncThunk(
  'economy/fetchAssetDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      // Backend route: GET /blockchain/cryptocurrencies/:id (maps to getCryptoInfo)
      const response = await api.get(`/blockchain/crypto/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch asset details');
    }
  }
);

export const buyAsset = createAsyncThunk(
  'economy/buyAsset',
  async ({ assetId, amount }: { assetId: string; amount: number }, { rejectWithValue }) => {
    try {
      // Backend route: POST /blockchain/trades/start-buy-transaction
      const response = await api.post('/blockchain/trades/start-buy-transaction', {
        networkId: assetId, // Assuming assetId maps to networkId
        amount
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to buy asset');
    }
  }
);

export const sellAsset = createAsyncThunk(
  'economy/sellAsset',
  async ({ assetId, amount }: { assetId: string; amount: number }, { rejectWithValue }) => {
    try {
      // Backend route: POST /blockchain/trades/start-sell-transaction
      const response = await api.post('/blockchain/trades/start-sell-transaction', {
        networkId: assetId, // Assuming assetId maps to networkId
        amount
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sell asset');
    }
  }
);

const economySlice = createSlice({
  name: 'economy',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearSelectedAsset: (state) => {
      state.selectedAsset = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Assets
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        // Handle response structure: array or object with assets property
        if (Array.isArray(action.payload)) {
          state.assets = action.payload;
          state.totalPages = 1; // Default if no pagination info
        } else {
          state.assets = action.payload.assets || [];
          state.totalPages = action.payload.totalPages || 1;
          state.totalMarketCap = action.payload.totalMarketCap || '0';
          state.totalVolume = action.payload.totalVolume || '0';
        }
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Asset Details
      .addCase(fetchAssetDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAsset = action.payload;
      })
      .addCase(fetchAssetDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Buy Asset
      .addCase(buyAsset.fulfilled, (state) => {
        // Optionally refresh assets or user balance here
      })
      // Sell Asset
      .addCase(sellAsset.fulfilled, (state) => {
        // Optionally refresh assets or user balance here
      });
  },
});

export const { setPage, clearSelectedAsset } = economySlice.actions;
export default economySlice.reducer;
