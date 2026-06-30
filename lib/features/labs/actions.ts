import { createAsyncThunk } from '@reduxjs/toolkit';
import { getLabApi, updateLabStatusApi, injectPowerApi, createLabApi } from './api';

export const fetchLaboratoryInterface = createAsyncThunk(
  'labs/fetchLaboratoryInterface',
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
  async ({ labId, blockchainId, hashAmount, currentLife }: { labId: string; blockchainId: string; hashAmount: number; currentLife: number }, { rejectWithValue }) => {
    try {
      const data = await injectPowerApi(labId, blockchainId, hashAmount, currentLife);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to inject hash');
    }
  }
);

export const createLaboratory = createAsyncThunk(
  'labs/createLaboratory',
  async (payload: { slotsCapacity?: number; userId?: string } = {}, { rejectWithValue }) => {
    try {
      const data = await createLabApi(payload);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to create laboratory');
    }
  }
);