export enum processingFrequencies {
  MEGA_CB = 10,
  GIGA_CB = 100,
  TERA_CB = 1000,
  PETA_CB = 10000
}

export const chronoBurstFreqTypes = {
  label: 'Chrono Burst',
  frequencies: {
    megaCB: { value: processingFrequencies.MEGA_CB, unit: 'Mcb' },
    gigaCB: { value: processingFrequencies.GIGA_CB, unit: 'Gcb' },
    teraCB: { value: processingFrequencies.TERA_CB, unit: 'Tcb' },
    petaCB: { value: processingFrequencies.PETA_CB, unit: 'Pcb' }
  }
};

export const getCBUnit = (val: number): string => {
  if (val >= processingFrequencies.PETA_CB) return 'Pcb';
  if (val >= processingFrequencies.TERA_CB) return 'Tcb';
  if (val >= processingFrequencies.GIGA_CB) return 'Gcb';
  return 'Mcb';
};

export const getCBDivisor = (val: number): number => {
  if (val >= processingFrequencies.PETA_CB) return processingFrequencies.PETA_CB;
  if (val >= processingFrequencies.TERA_CB) return processingFrequencies.TERA_CB;
  if (val >= processingFrequencies.GIGA_CB) return processingFrequencies.GIGA_CB;
  return processingFrequencies.MEGA_CB;
};
