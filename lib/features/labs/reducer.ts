import { createSlice } from '@reduxjs/toolkit';
import { LabsState } from './types';
import { fetchLabData, toggleLabStatus, injectPower } from './actions';

const initialState: LabsState = {
  currentLab: null,
  isPoweredOn: false,
  status: 'idle',
  error: null,
};

const labsSlice = createSlice({
  name: 'labs',
  initialState,
  reducers: {
    resetLabState: (state) => {
      state.currentLab = null;
      state.isPoweredOn = false;
      state.status = 'idle';
      state.error = null;
    },
    updateLocalEnergy: (state, action) => {
      if (state.currentLab) {
        state.currentLab.energy = action.payload;
      }
    },
    toggleLaboratoryPower: (state) => {
      state.isPoweredOn = !state.isPoweredOn;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLabData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentLab = action.payload;
        // Sync isPoweredOn with operationStatus from server if needed, 
        // but prompt implies manual toggle. Let's keep it manual as requested.
        if (action.payload.operationStatus === 'ACTIVE') {
          state.isPoweredOn = true;
        }
      })
      .addCase(fetchLabData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(toggleLabStatus.fulfilled, (state, action) => {
        if (state.currentLab) {
          const newStatus = action.payload.status || action.payload.operationStatus;
          state.currentLab.operationStatus = newStatus;
          state.isPoweredOn = newStatus === 'ACTIVE';
        }
      })
      .addCase(injectPower.fulfilled, (state, action) => {
        if (state.currentLab && action.payload.labState) {
          state.currentLab = { ...state.currentLab, ...action.payload.labState };
        }
      });
  },
});

export const { resetLabState, updateLocalEnergy, toggleLaboratoryPower } = labsSlice.actions;
export default labsSlice.reducer;
