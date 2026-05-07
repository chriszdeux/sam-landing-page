import { calculateResources, StationResources } from './core_modules_logic';
import { StationModule } from '../types/core_modules';
import { describe, it, expect } from 'vitest';

describe('calculateResources', () => {
  const initialResources: StationResources = {
    energy: 100,
    oxygen: 50,
    crew: 10,
    integrity: 100
  };

  it('should calculate resources correctly for energy and bio modules', () => {
    const modules: StationModule[] = [{
      moduleId: '1',
      moduleType: 'energy',
      isOperational: true,
      isAnchored: true,
      currentEnergyOutput: 50,
      baseVitality: 100,
      radiationResistance: 0.162,
      thaoCost: 1000,
      userId: 'user1'
    } as any, {
      moduleId: '2',
      moduleType: 'bio',
      isOperational: true,
      isAnchored: true,
      currentEnergyOutput: 0,
      baseVitality: 100,
      radiationResistance: 0.162,
      thaoCost: 1000,
      userId: 'user1'
    } as any];

    const result = calculateResources(modules, initialResources);
    
    expect(result.energy).toBe(150);
    expect(result.oxygen).toBe(75);
    expect(result.integrity).toBe(100);
  });

  it('should only count operational and anchored modules', () => {
    const modules: StationModule[] = [{
      moduleId: '1',
      moduleType: 'energy',
      isOperational: false,
      isAnchored: true,
      currentEnergyOutput: 50,
      baseVitality: 100,
      radiationResistance: 0.162,
      thaoCost: 1000,
      userId: 'user1'
    } as any];

    const result = calculateResources(modules, initialResources);
    expect(result.energy).toBe(100);
  });
});
