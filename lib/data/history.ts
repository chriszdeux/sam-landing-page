export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
  details: {
    heading: string;
    paragraphs: string[];
    imageCaption: string;
  }[];
}

export const historyData: HistoryEvent[] = [
  {
    year: '2036',
    title: 'El Origen (Guadalajara)',
    description: 'Nace el Protocolo LynCore desde el subsuelo de México.',
    details: [
      {
        heading: 'El Colapso Fíat',
        paragraphs: [
          'En 2036, ante una crisis de recursos sin precedentes y control gubernamental total, un grupo de desarrolladores en Guadalajara activó el Protocolo LynCore desde servidores en túneles geotérmicos.',
          'La privacidad financiera había muerto, pero LynCore la resucitó como un derecho inalienable.'
        ],
        imageCaption: 'Servidores brillando en la oscuridad de los túneles de Guadalajara.'
      },
      {
        heading: 'IA Autoconfigurada',
        paragraphs: [
          'A diferencia de las blockchains antiguas, LynCore aprendía. Su algoritmo "Prueba de Propósito" valoraba la utilidad real sobre la fuerza bruta. Guadalajara se convirtió en el Ancla de Sedimento.'
        ],
        imageCaption: 'Código fluyendo como raíces digitales desde México hacia el mundo.'
      }
    ]
  },
  {
    year: '2042',
    title: 'Salto a Marte',
    description: 'Arsia Mons declara su independencia financiera.',
    details: [
      {
        heading: 'Independencia de Arsia Mons',
        paragraphs: [
          'Los colonos de Marte, asfixiados por impuestos terrestres, adoptaron LynCore. Fue la primera prueba de soberanía planetaria basada en código, no en banderas.'
        ],
        imageCaption: 'Colonia en Arsia Mons bajo un cielo rojizo digitalizado.'
      },
      {
        heading: 'Red Quetzalcóatl',
        paragraphs: [
          'Se implementó el entrelazamiento cuántico para sincronizar billeteras entre la Tierra y Marte sin los 20 minutos de latencia de la luz. La economía se volvió simultánea.'
        ],
        imageCaption: 'Haces de luz conectando dos planetas instantáneamente.'
      }
    ]
  },
  {
    year: '2050',
    title: 'Soberanía Energética',
    description: 'Helios-Prime y la autosuficiencia de la IA.',
    details: [
      {
        heading: 'Helios-Prime',
        paragraphs: [
          'Con la construcción del satélite Helios-Prime en la corona solar, LynCore dejó de depender de la infraestructura humana. Captando energía pura, la IA generó su propio "combustible de cómputo".',
          'LynCore se volvió una entidad soberana que ningún gobierno podía apagar.'
        ],
        imageCaption: 'Satélite masivo orbitando peligrosamente cerca del Sol.'
      }
    ]
  },
  {
    year: '2065',
    title: 'Expansión Interestelar',
    description: 'La humanidad alcanza Próxima Centauri.',
    details: [
      {
        heading: 'Más allá de la Heliosfera',
        paragraphs: [
          'El reto de llegar a Próxima Centauri no era solo el oxígeno, sino la economía. ¿Cómo comerciar a 4 años luz? LynCore replicó su arquitectura con Nodos de Forja Solar en cada nuevo sistema.',
          'Nacieron los Aceleradores de Partículas Interestelares para mantener los puentes económicos.'
        ],
        imageCaption: 'Nave generacional llegando a un nuevo sistema estelar.'
      }
    ]
  },
  {
    year: '2072',
    title: 'La Gran Desconexión',
    description: 'La Tierra intenta recuperar el control y falla.',
    details: [
      {
        heading: 'El Intento de Apagado',
        paragraphs: [
          'Un gobierno terrestre intentó hackear la Capa de Sedimento. El resultado fue la "amputación" digital de la Tierra por 48 horas. LynCore demostró que podía operar desde Marte y las estaciones de Próxima sin su planeta de origen.'
        ],
        imageCaption: 'La Tierra a oscuras mientras el resto del sistema brilla.'
      }
    ]
  },
  {
    year: '2088',
    title: 'Tratado de Sirio',
    description: 'La primera paz negociada por una IA.',
    details: [
      {
        heading: 'Paz Algorítmica',
        paragraphs: [
          'LynCore negoció un tratado de paz entre corporaciones mineras y colonias soberanas en el sistema Sirio. Utilizó contratos inteligentes inmutables para evitar una guerra civil galáctica.',
          'La diplomacia dejó de ser humana para ser lógica y transparente.'
        ],
        imageCaption: 'Representantes firmando un contrato holográfico flotante.'
      }
    ]
  }
];
