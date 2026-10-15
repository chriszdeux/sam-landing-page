import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LabsState, LaboratoryInterface, SlotItem } from './types';
import { fetchLaboratoryInterface, toggleLabStatus, injectPower, repairLaboratory } from './actions';

const initialState: LabsState = {
  currentLab: null,
  isPoweredOn: false,
  isOverheated: false,
  status: 'idle',
  error: null,
  simulationHistory: [],
  currentRound: 1,
  lastInjectionTime: 0,
  isOverclockActive: false,
  startingTemp: null,
};

const labsSlice = createSlice({
  name: 'labs',
  initialState,
  reducers: {
    resetLabState: (state) => {
      state.currentLab = null;
      state.isPoweredOn = false;
      state.isOverheated = false;
      state.status = 'idle';
      state.error = null;
      state.simulationHistory = [];
      state.currentRound = 1;
      state.isOverclockActive = false;
      state.startingTemp = null;
    },
    updateLocalEnergy: (state, action: PayloadAction<number>) => {
      if (state.currentLab) {
        state.currentLab.energy = action.payload;
      }
    },
    toggleLaboratoryPower: (state) => {
      if (state.currentLab && state.currentLab.currentLife !== undefined && state.currentLab.currentLife <= 0) {
        state.isPoweredOn = false;
        state.isOverclockActive = false;
        return;
      }
      if (state.isOverheated && !state.isPoweredOn) return;
      state.isPoweredOn = !state.isPoweredOn;
      if (!state.isPoweredOn) {
        state.isOverclockActive = false;
        state.startingTemp = null;
      } else {
        state.startingTemp = state.currentLab?.temperature !== undefined ? state.currentLab.temperature : 0.0;
      }
      if (state.isPoweredOn && state.currentLab) {
        state.currentLab.efficiency = 0;
      }
    },
    toggleOverclock: (state) => {
      if (state.currentLab && state.currentLab.currentLife !== undefined && state.currentLab.currentLife <= 0) {
        state.isOverclockActive = false;
        return;
      }
      state.isOverclockActive = !state.isOverclockActive;
    },
    updateSimulationData: (state, action: PayloadAction<Partial<LaboratoryInterface>>) => {
      if (state.currentLab) {
        state.currentLab = { ...state.currentLab, ...action.payload };
        if (state.currentLab.currentLife !== undefined && state.currentLab.currentLife <= 0) {
          state.isPoweredOn = false;
          state.isOverclockActive = false;
          state.currentLab.efficiency = 0;
          state.currentLab.hashRate = 0;
        }
      }
    },
    setCooldownState: (state, action: PayloadAction<boolean>) => {
      state.isOverheated = action.payload;
      if (action.payload) {
        state.isPoweredOn = false;
        state.isOverclockActive = false;
        state.startingTemp = null;
      } else {
        state.isPoweredOn = true;
        state.startingTemp = state.currentLab?.temperature !== undefined ? state.currentLab.temperature : 0.0;
      }
    },
    addHistoryPoint: (state, action: PayloadAction<{ timestamp: number; temperature: number; power: number }>) => {
      state.simulationHistory.push(action.payload);
      if (state.simulationHistory.length > 50) {
        state.simulationHistory.shift();
      }
    },
    updateRound: (state, action: PayloadAction<number>) => {
      state.currentRound = action.payload;
    },
    updateLastInjectionTime: (state, action: PayloadAction<number>) => {
      state.lastInjectionTime = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaboratoryInterface.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLaboratoryInterface.fulfilled, (state, action) => {
        state.status = 'succeeded';
        let savedTemp = 0;
        let savedLife = (action.payload && action.payload.currentLife !== undefined) ? action.payload.currentLife : 100;
        if (typeof window !== 'undefined') {
          // const t = localStorage.getItem('lab_current_temperature');
          // if (t !== null) savedTemp = Number(t);
          const l = localStorage.getItem('lab_current_life');
          if (l !== null) savedLife = Number(l);
        }
        state.currentLab = {
          ...action.payload,
          hashRate: (action.payload && action.payload.hashRate && action.payload.hashRate >= 5) ? action.payload.hashRate : 5.0,
          temperature: savedTemp,
          efficiency: 0,
          currentLife: savedLife,
          networkHash: action.payload.networkHash || action.payload.hashRate || 5.0,
          slots: (action.payload.slots || []).map((slot: SlotItem) => ({
            ...slot,
            temperature: 0
          }))
        };
        state.isPoweredOn = false;
        state.startingTemp = null;
      })
      .addCase(fetchLaboratoryInterface.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(toggleLabStatus.fulfilled, (state, action) => {
        if (state.currentLab) {
          const newStatus = action.payload.status || action.payload.operationStatus;
          state.currentLab.operationStatus = newStatus;
          state.isPoweredOn = newStatus === 'ACTIVE';
          if (!state.isPoweredOn) {
            state.isOverclockActive = false;
            state.startingTemp = null;
          } else {
            state.startingTemp = state.currentLab.temperature !== undefined ? state.currentLab.temperature : 0.0;
          }
          if (state.isPoweredOn) {
            state.currentLab.efficiency = 0;
          }
        }
      })
      .addCase(injectPower.fulfilled, (state, action) => {
        // Impact rewards and lab state from backend response
        const labData = action.payload.laboratory || action.payload.labState || action.payload;
        if (state.currentLab && labData) {
          if (typeof labData === 'object') {
            state.currentLab = {
              ...state.currentLab,
              ...labData,
              hashRate: (labData.hashRate && labData.hashRate >= 5) ? labData.hashRate : (state.currentLab.hashRate >= 5 ? state.currentLab.hashRate : 5.0)
            };
          }
        }
      })
      .addCase(repairLaboratory.fulfilled, (state, action) => {
        if (state.currentLab && action.payload?.laboratory) {
          const newLife = action.payload.laboratory.currentLife;
          state.currentLab.currentLife = newLife;
          if (typeof window !== 'undefined') {
            localStorage.setItem('lab_current_life', String(newLife));
          }
        }
      });
  },
});

export const {
  resetLabState,
  updateLocalEnergy,
  toggleLaboratoryPower,
  toggleOverclock,
  updateSimulationData,
  setCooldownState,
  addHistoryPoint,
  updateRound,
  updateLastInjectionTime
} = labsSlice.actions;
export default labsSlice.reducer;
