import { createSlice } from '@reduxjs/toolkit';
import { SpaceState } from './types';
import { fetchGalaxies, fetchSystemsByGalaxy, fetchPlanetsBySystem } from './actions';

const initialState: SpaceState = {
  galaxies: [],
  systems: {},
  planets: {},
  loading: false,
  error: null,
};

const spaceSlice = createSlice({
  name: 'space',
  initialState,
  reducers: {
    clearSpaceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Galaxies
      .addCase(fetchGalaxies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalaxies.fulfilled, (state, action) => {
        state.loading = false;
        state.galaxies = action.payload;
      })
      .addCase(fetchGalaxies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Systems
      .addCase(fetchSystemsByGalaxy.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSystemsByGalaxy.fulfilled, (state, action) => {
        state.loading = false;
        state.systems[action.payload.galaxyId] = action.payload.systems;
      })
      .addCase(fetchSystemsByGalaxy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Planets
      .addCase(fetchPlanetsBySystem.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlanetsBySystem.fulfilled, (state, action) => {
        state.loading = false;
        state.planets[action.payload.systemId] = action.payload.planets;
      })
      .addCase(fetchPlanetsBySystem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSpaceError } = spaceSlice.actions;
export default spaceSlice.reducer;
