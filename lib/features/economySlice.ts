// 1-Definir interfaz para activos financieros y estado
// 2-Configurar acciones asíncronas para operar con activos
// 3-Crear slice con reducers síncronos y asíncronos
// 4-Exportar acciones para controlar el estado
// 5-Exportar reducer para la tienda

//# 1-Definir interfaz para activos financieros y estado
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
    marketCap?: string; 
    volume?: string;    
    supply?: string;    
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

//# 2-Configurar acciones asíncronas para operar con activos
export const fetchAssets = createAsyncThunk(
  'economy/fetchAssets',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      // NOTE: Parameters are currently unused but kept for future pagination support
      // console.debug('Fetching assets with:', { page, limit });
      const response = await api.get(`/blockchain/crypto`);
      return response.data;
    } catch (error: unknown) {
      const errorObj = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch assets');
    }
  }
);

export const fetchAssetDetails = createAsyncThunk(
  'economy/fetchAssetDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      
      const response = await api.get(`/blockchain/crypto/${id}`);
      return response.data;
    } catch (error: unknown) {
      const errorObj = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch asset details');
    }
  }
);

export const buyAsset = createAsyncThunk(
  'economy/buyAsset',
  async ({ assetId, amount }: { assetId: string; amount: number }, { rejectWithValue }) => {
    try {
      
      const response = await api.post('/blockchain/trades/start-buy-transaction', {
        networkId: assetId, 
        amount
      });
      return response.data;
    } catch (error: unknown) {
      const errorObj = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(errorObj.response?.data?.message || 'Failed to buy asset');
    }
  }
);

export const sellAsset = createAsyncThunk(
  'economy/sellAsset',
  async ({ assetId, amount }: { assetId: string; amount: number }, { rejectWithValue }) => {
    try {
      
      const response = await api.post('/blockchain/trades/start-sell-transaction', {
        networkId: assetId, 
        amount
      });
      return response.data;
    } catch (error: unknown) {
      const errorObj = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(errorObj.response?.data?.message || 'Failed to sell asset');
    }
  }
);

//# 3-Crear slice con reducers síncronos y asíncronos
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
      
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        
        if (Array.isArray(action.payload)) {
          state.assets = action.payload;
          state.totalPages = 1; 
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
      
      .addCase(buyAsset.fulfilled, () => {
        // Handle successful purchase if needed
      })
      
      .addCase(sellAsset.fulfilled, () => {
        // Handle successful sale if needed
      });
  },
});

//# 4-Exportar acciones para controlar el estado
export const { setPage, clearSelectedAsset } = economySlice.actions;

//# 5-Exportar reducer para la tienda
export default economySlice.reducer;
