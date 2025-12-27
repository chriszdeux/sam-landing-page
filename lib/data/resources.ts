

export interface Resource {
  id: string;
  name: string;
  type: 'Mineral' | 'Energy' | 'Liquido' | 'Gas' | 'Tecnología' | 'Exótico';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  image: string;
  color: string;
}

export const resourcesData: Resource[] = [
  {
    id: 'iron',
    name: 'Hierro',
    type: 'Mineral',
    rarity: 'Common',
    description: 'Metal fundamental para la construcción de estructuras y naves básicas.',
    image: 'https://placehold.co/400x300/2a2a2a/a1a1a1/png?text=Hierro',
    color: '#a1a1a1' 
  },
  {
    id: 'gold',
    name: 'Oro',
    type: 'Mineral',
    rarity: 'Rare',
    description: 'Conductor excelente utilizado en componentes electrónicos de precisión.',
    image: 'https://placehold.co/400x300/2a2a2a/ffd700/png?text=Oro',
    color: '#ffd700'
  },
  {
    id: 'hydrogen',
    name: 'Isótopos de Hidrógeno',
    type: 'Gas',
    rarity: 'Common',
    description: 'Combustible esencial para reactores de fusión y propulsores convencionales.',
    image: 'https://placehold.co/400x300/2a2a2a/3498db/png?text=Hidrogeno',
    color: '#3498db'
  },
  {
    id: 'antimatter',
    name: 'Antimateria',
    type: 'Energy',
    rarity: 'Legendary',
    description: 'Fuente de energía extremadamente volátil y potente para motores de distorsión.',
    image: 'https://placehold.co/400x300/2a2a2a/e74c3c/png?text=Antimateria',
    color: '#e74c3c'
  },
  {
    id: 'water',
    name: 'Agua Purificada',
    type: 'Liquido',
    rarity: 'Common',
    description: 'Vital para el soporte de vida y la agricultura hidropónica en las colonias.',
    image: 'https://placehold.co/400x300/2a2a2a/00ced1/png?text=Agua',
    color: '#00ced1'
  },
  {
    id: 'plutonium',
    name: 'Plutonio Enriquecido',
    type: 'Energy',
    rarity: 'Rare',
    description: 'Material radioactivo utilizado en armamento nuclear y reactores avanzados.',
    image: 'https://placehold.co/400x300/2a2a2a/2ecc71/png?text=Plutonio',
    color: '#2ecc71'
  },
  {
    id: 'titanium',
    name: 'Aleación de Titanio',
    type: 'Mineral',
    rarity: 'Rare',
    description: 'Metal ligero y resistente, crucial para blindaje de naves de combate.',
    image: 'https://placehold.co/400x300/2a2a2a/95a5a6/png?text=Titanio',
    color: '#95a5a6'
  },
  {
    id: 'helium3',
    name: 'Helio-3',
    type: 'Gas',
    rarity: 'Epic',
    description: 'Isótopo no radioactivo ideal para fusión limpia. Muy codiciado.',
    image: 'https://placehold.co/400x300/2a2a2a/fab1a0/png?text=Helio-3',
    color: '#fab1a0'
  },
  {
    id: 'circuitry',
    name: 'Circuitos Cuánticos',
    type: 'Tecnología',
    rarity: 'Epic',
    description: 'Procesadores capaces de realizar cálculos hipercomplejos para la navegación IA.',
    image: 'https://placehold.co/400x300/2a2a2a/9b59b6/png?text=Circuitos',
    color: '#9b59b6'
  },
  {
    id: 'dark_matter',
    name: 'Materia Oscura',
    type: 'Exótico',
    rarity: 'Legendary',
    description: 'Sustancia misteriosa que desafía las leyes físicas. Usos desconocidos.',
    image: 'https://placehold.co/400x300/2a2a2a/2c3e50/png?text=Materia+Oscura',
    color: '#2c3e50'
  },
  {
    id: 'plasma',
    name: 'Células de Plasma',
    type: 'Energy',
    rarity: 'Rare',
    description: 'Baterías de alta densidad para armamento de energía dirigida.',
    image: 'https://placehold.co/400x300/2a2a2a/f1c40f/png?text=Plasma',
    color: '#f1c40f'
  },
  {
    id: 'nano_fiber',
    name: 'Nanofibra de Carbono',
    type: 'Tecnología',
    rarity: 'Epic',
    description: 'Material sintético más fuerte que el acero pero mucho más ligero.',
    image: 'https://placehold.co/400x300/2a2a2a/ecf0f1/png?text=Nanofibra',
    color: '#ecf0f1'
  }
];
