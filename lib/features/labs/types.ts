export interface LabData {
  id: string;
  userId: string;
  type?: string;
  powerMining: number;
  temperature: number;
  maxTemperature: number;
  efficiency: number;
  energy: number;
  maxEnergy: number;
  operationStatus: 'ACTIVE' | 'INACTIVE';
  lastEnergyUpdate?: string;
  lastProcessedAt?: string;
  capacity?: number;
  storage?: number;
}

export interface LabsState {
  currentLab: LabData | null;
  isPoweredOn: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
