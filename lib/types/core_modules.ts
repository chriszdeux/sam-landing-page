export type StationModuleType = 'energy' | 'science' | 'bio' | 'habitat';

export interface StationModuleAnchors {
  northConnected: boolean;
  southConnected: boolean;
  eastConnected: boolean;
  westConnected: boolean;
}

export interface StationModulePosition {
  xPos: number;
  yPos: number;
}

export interface StationModule {
  userId: string;
  moduleId: string;
  moduleType: StationModuleType;
  baseVitality: number;
  radiationResistance: number;
  thaoCost: number;
  currentEnergyOutput: number;
  isOperational: boolean;
  isAnchored?: boolean;
  anchors?: StationModuleAnchors;
  positionCoordinates?: StationModulePosition;
  usePrimitiveShape?: boolean;
  shapeType?: "octagon" | "square" | "triangle" | "circle" | "rectangle";
  status?: "active" | "pendingConfirmation";
}
