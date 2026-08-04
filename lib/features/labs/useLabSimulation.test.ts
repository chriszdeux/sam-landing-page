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

