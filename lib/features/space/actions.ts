import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { hadesApi } from "../../api";
import { EnvVariables } from "../../constants/variables";
import { Galaxy, SolarSystem, Planet } from "./types";

const normalizeData = (data: any): any => {
  if (Array.isArray(data)) return data.map(normalizeData);
  if (data !== null && typeof data === 'object') {
    const normalized: Record<string, any> = {};
    for (const key in data) {
      let newKey = key;
      if (key === 'system_count') newKey = 'systemCount';
      if (key === 'planet_count') newKey = 'planetCount';
      if (key === 'max_capacity') newKey = 'maxCapacity';
      if (key === 'terrain_hue') newKey = 'terrainHue';
      if (key === 'ocean_hue') newKey = 'oceanHue';
      if (key === 'fauna_hue') newKey = 'faunaHue';
      if (key === 'cloud_hue') newKey = 'cloudHue';
      if (key === 'has_rings') newKey = 'hasRings';
      normalized[newKey] = normalizeData(data[key]);
    }
    return normalized;
  }
  return data;
};

export const fetchGalaxies = createAsyncThunk<Galaxy[], void, { rejectValue: string }>(
  "space/fetchGalaxies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await hadesApi.get(`/space/galaxies`);
      const data = response.data.data || response.data;
      return normalizeData(data) as Galaxy[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch galaxies");
    }
  }
);

export const fetchSystemsByGalaxy = createAsyncThunk<{ galaxyId: string; systems: SolarSystem[] }, string, { rejectValue: string }>(
  "space/fetchSystems",
  async (galaxyId: string, { rejectWithValue }) => {
    try {
      const response = await hadesApi.get(`/space/galaxies/${galaxyId}/systems`);
      const data = response.data.data || response.data;
      return { galaxyId, systems: normalizeData(data) as SolarSystem[] };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch systems");
    }
  }
);

export const fetchPlanetsBySystem = createAsyncThunk<{ systemId: string; planets: Planet[] }, string, { rejectValue: string }>(
  "space/fetchPlanets",
  async (systemId: string, { rejectWithValue }) => {
    try {
      const response = await hadesApi.get(`/space/systems/${systemId}/planets`);
      const data = response.data.data || response.data;
      return { systemId, planets: normalizeData(data) as Planet[] };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch planets");
    }
  }
);
