export interface SlotItem {
  id: string;
  name: string;
  hashRate: number; // Replaced powerMining
  maxTemperature: number;
  lifeLimit: number;
  currentUsage: number;
  temperature: number; // Dual thermal management
}

export interface LaboratoryInterface {
  id: string;
  type: "MINING";
  lifeLimit: number;
  currentLife: number;
  maxTemperature: number;
  slotsCapacity: number;
  hashRate: number; // Replaced powerBase
  energy: number;
  slots: SlotItem[];
  createdAt: string | Date;
  
  // Client-side simulation properties
  temperature: number; // Global lab temperature
  efficiency: number;
  operationStatus: 'ACTIVE' | 'INACTIVE';
  pendingRewards: number;
  maxEnergy?: number;
}

export interface LabsState {
  currentLab: LaboratoryInterface | null;
  isPoweredOn: boolean;
  isOverheated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  simulationHistory: { timestamp: number; temperature: number; power: number }[];
  currentRound: number;
  lastInjectionTime: number;
  isOverclockActive?: boolean;
}
