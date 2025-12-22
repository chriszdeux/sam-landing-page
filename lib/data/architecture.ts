export interface Building {
  id: string;
  name: string;
  type: 'Administrativo' | 'Recolección' | 'Procesamiento' | 'Transporte' | 'Defensa' | 'Investigación';
  level: number;
  description: string;
  image: string;
  color: string;
}

export const architectureData: Building[] = [
  {
    id: 'command_center',
    name: 'Centro de Comando',
    type: 'Administrativo',
    level: 1,
    description: 'El corazón de tu colonia. Gestiona recursos y desbloquea nuevas tecnologías.',
    image: 'https://placehold.co/400x300/1a1a2e/00f3ff/png?text=Centro+Comando',
    color: '#00f3ff'
  },
  {
    id: 'crystal_mine',
    name: 'Mina de Cristal',
    type: 'Recolección',
    level: 1,
    description: 'Extrae cristales puros necesarios para componentes ópticos avanzados.',
    image: 'https://placehold.co/400x300/1a1a2e/d600ff/png?text=Mina+Cristal',
    color: '#d600ff'
  },
  {
    id: 'solar_refinery',
    name: 'Refinería Solar',
    type: 'Procesamiento',
    level: 2,
    description: 'Convierte la radiación estelar en células de energía condensada.',
    image: 'https://placehold.co/400x300/1a1a2e/ffb700/png?text=Refineria',
    color: '#ffb700'
  },
  {
    id: 'space_port',
    name: 'Puerto Espacial',
    type: 'Transporte',
    level: 3,
    description: 'Permite el comercio interplanetario y la gestión de flotas.',
    image: 'https://placehold.co/400x300/1a1a2e/ff0055/png?text=Puerto+Espacial',
    color: '#ff0055'
  },
  {
    id: 'defense_turret',
    name: 'Torreta de Plasma',
    type: 'Defensa',
    level: 2,
    description: 'Defensa automatizada contra incursiones piratas.',
    image: 'https://placehold.co/400x300/1a1a2e/ff3333/png?text=Torreta',
    color: '#ff3333'
  },
  {
    id: 'research_lab',
    name: 'Laboratorio Cuántico',
    type: 'Investigación',
    level: 4,
    description: 'Investiga anomalías y desarrolla nueva tecnología.',
    image: 'https://placehold.co/400x300/1a1a2e/00ff9d/png?text=Laboratorio',
    color: '#00ff9d'
  },
  {
    id: 'fusion_reactor',
    name: 'Reactor de Fusión',
    type: 'Recolección',
    level: 5,
    description: 'Generación masiva de energía mediante fusión de isótopos.',
    image: 'https://placehold.co/400x300/1a1a2e/3498db/png?text=Reactor',
    color: '#3498db'
  },
  {
    id: 'trade_hub',
    name: 'Nexus Comercial',
    type: 'Administrativo',
    level: 3,
    description: 'Centro logístico para coordinar rutas comerciales complejas.',
    image: 'https://placehold.co/400x300/1a1a2e/9b59b6/png?text=Nexus',
    color: '#9b59b6'
  },
];
