import { createAsyncThunk } from '@reduxjs/toolkit';
import { getLabApi, updateLabStatusApi, injectPowerApi } from './api';

export const fetchLabData = createAsyncThunk(
  'labs/fetchLabData',
  async (labId: string, { rejectWithValue }) => {
    try {
      const data = await getLabApi(labId);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lab data');
    }
  },
  {
    condition: (labId, { getState }) => {
      const { reducerLabs } = getState() as { reducerLabs: { status: string; currentLab: any } };
      if (reducerLabs.status === 'loading' || (reducerLabs.currentLab && reducerLabs.currentLab.id === labId)) {
        return false;
      }
    }
  }
);

export const toggleLabStatus = createAsyncThunk(
  'labs/toggleLabStatus',
  async ({ labId, status }: { labId: string; status: 'ACTIVE' | 'INACTIVE' }, { rejectWithValue }) => {
    try {
      const data = await updateLabStatusApi(labId, status);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to update lab status');
    }
  }
);

export const injectPower = createAsyncThunk(
  'labs/injectPower',
  async ({ labId, blockchainId, energyAmount }: { labId: string; blockchainId: string; energyAmount: number }, { rejectWithValue }) => {
    try {
      const data = await injectPowerApi(labId, blockchainId, energyAmount);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to inject power');
    }
  }
);