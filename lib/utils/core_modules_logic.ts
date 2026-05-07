import { StationModule } from "../types/core_modules";

export interface StationResources {
  energy: number;
  oxygen: number;
  crew: number;
  integrity: number;
}

export const calculateResources = (
  stationModules: StationModule[],
  serverResources?: StationResources | null
): StationResources => {
  let energy = 0;
  let oxygen = 0;
  let crew = 0;
  let totalVitality = 0;

  if (serverResources) {
    energy = serverResources.energy;
    oxygen = serverResources.oxygen;
    crew = serverResources.crew;
  }

  stationModules.forEach((mod) => {
    if (mod.isOperational && mod.isAnchored) {
      if (mod.moduleType === 'energy') {
        energy += mod.currentEnergyOutput || 0;
      } else if (mod.moduleType === 'bio') {
        oxygen += 25; // Example constant
      }
      // Add other logic as needed
      totalVitality += mod.baseVitality || 0;
    }
  });

  const integrity = stationModules.length > 0 
    ? totalVitality / stationModules.length 
    : (serverResources?.integrity || 100);

  return {
    energy,
    oxygen,
    crew,
    integrity
  };
};
