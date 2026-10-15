import { describe, it, expect } from 'vitest';
import { getTargetsForEfficiency } from './useLabSimulation';

describe('getTargetsForEfficiency', () => {
  it('should return 0.0 hash rate when efficiency is 0%', () => {
    const { targetHash } = getTargetsForEfficiency(0);
    expect(targetHash).toBe(0.0);
  });

  it('should calculate targets correctly for 80% efficiency', () => {
    // Math checks for efficiency = 80:
    // Base is 5.0
    // eff / 100 = 0.8. Base portion: 5.0 * 0.8 = 4.0
    const { targetHash, targetTemp } = getTargetsForEfficiency(80);
    expect(targetHash).toBeCloseTo(4.0, 5);
    expect(targetTemp).toBe(65.0); // 65°C safe temperature limit
  });

  it('should calculate target temperature correctly when efficiency exceeds 80%', () => {
    // For 90%: targetTemp = 65.0 + (90 - 80) * 1.0 = 75.0
    const res90 = getTargetsForEfficiency(90);
    expect(res90.targetTemp).toBeCloseTo(75.0, 5);

    // For 100%: targetTemp = 75.0 + (100 - 90) * 1.08 = 85.8, capped at maxTemp (80)
    const res100 = getTargetsForEfficiency(100, 5.0, 80);
    expect(res100.targetTemp).toBe(80.0);
  });

  it('should calculate hashrate correctly for overclocked base in range [14, 15] H/s at 100% efficiency', () => {
    // Overclock multiplier is random in [1.4, 1.5], so baseHash is between 14 and 15 H/s.
    // Verify both boundary values using getTargetsForEfficiency at 100% efficiency.

    // At baseHash = 14.0 (1.4x multiplier):
    // targetHash = 14.0 * 1.0 = 14.0
    const { targetHash: hash14 } = getTargetsForEfficiency(100, 14.0);
    expect(hash14).toBeCloseTo(14.0, 5);

    // At baseHash = 15.0 (1.5x multiplier):
    // targetHash = 15.0 * 1.0 = 15.0
    const { targetHash: hash15 } = getTargetsForEfficiency(100, 15.0);
    expect(hash15).toBeCloseTo(15.0, 5);
  });
});

import reducer, { toggleLaboratoryPower, toggleOverclock, updateSimulationData } from './reducer';
import { repairLaboratory } from './actions';
import { LabsState } from './types';

describe('Laboratorio Lockout en 0% Vida Útil y Reparación', () => {
  const collapsedState: LabsState = {
    currentLab: {
      id: 'lab-1',
      type: 'MINING',
      lifeLimit: 100,
      currentLife: 0,
      maxTemperature: 80,
      slotsCapacity: 10,
      slots: [],
      createdAt: new Date(),
      hashRate: 0,
      temperature: 25,
      efficiency: 0,
      energy: 0,
      operationStatus: 'INACTIVE',
      pendingRewards: 0,
    },
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

  it('no permite encender el laboratorio cuando currentLife es 0.00%', () => {
    const nextState = reducer(collapsedState, toggleLaboratoryPower());
    expect(nextState.isPoweredOn).toBe(false);
  });

  it('no permite activar overclock cuando currentLife es 0.00%', () => {
    const nextState = reducer(collapsedState, toggleOverclock());
    expect(nextState.isOverclockActive).toBe(false);
  });

  it('fuerza apagado, 0% eficiencia y 0 hashRate si updateSimulationData detecta currentLife <= 0', () => {
    const activeState: LabsState = {
      ...collapsedState,
      isPoweredOn: true,
      isOverclockActive: true,
      currentLab: {
        ...collapsedState.currentLab!,
        currentLife: 10,
        efficiency: 90,
        hashRate: 15,
      },
    };

    const nextState = reducer(activeState, updateSimulationData({ currentLife: 0 }));
    expect(nextState.isPoweredOn).toBe(false);
    expect(nextState.isOverclockActive).toBe(false);
    expect(nextState.currentLab?.efficiency).toBe(0);
    expect(nextState.currentLab?.hashRate).toBe(0);
  });

  it('restaura currentLife al recibir repairLaboratory.fulfilled', () => {
    const action = {
      type: repairLaboratory.fulfilled.type,
      payload: {
        ok: true,
        laboratory: {
          id: 'lab-1',
          currentLife: 60,
          blocksRepaired: 6,
        },
      },
    };

    const nextState = reducer(collapsedState, action as any);
    expect(nextState.currentLab?.currentLife).toBe(60);
  });
});


