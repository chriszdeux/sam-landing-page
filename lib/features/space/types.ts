export interface Galaxy {
  id: string;
  name: string;
  seed: string;
  systemCount: number;
}

export interface SolarSystem {
  id: string;
  galaxyId: string;
  name: string;
  starType: string;
  planetCount: number;
  coordinates: { x: number; y: number };
}

export interface Planet {
  id: string;
  systemId: string;
  name: string;
  type: string;
  population: number;
  maxCapacity: number;
  seed: string;
  terrainHue: number;
  oceanHue: number;
  faunaHue: number;
  cloudHue: number;
  radius: number;
  hasRings: boolean;
  biome?: string;
  atmosphere?: number;
  gravity?: number;
  orbitIndex?: number;
  orbitDistance?: number;
  orbitAngle?: number;
}

export interface SpaceState {
  galaxies: Galaxy[];
  systems: Record<string, SolarSystem[]>; // galaxyId -> systems
  planets: Record<string, Planet[]>; // systemId -> planets
  loading: boolean;
  error: string | null;
}
