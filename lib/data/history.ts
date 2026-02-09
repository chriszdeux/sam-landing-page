import { EnvVariables } from "../constants/variables";

export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
  details: {
    heading: string;
    paragraphs: string[];
    imageCaption: string;
    image?: string;
  }[];
}
const { project } = EnvVariables;
export const historyData: HistoryEvent[] = [
  {
    year: '2036',
    title: 'El Origen (Guadalajara)',
    description: `Nace el Protocolo ${project} desde el subsuelo de México.`,
    details: [
      {
        heading: 'El Colapso Fíat',
        paragraphs: [
          `En 2036, ante una crisis de recursos sin precedentes y control gubernamental total, un grupo de desarrolladores en Guadalajara activó el Protocolo ${project} desde servidores en túneles geotérmicos.`,
          `La privacidad financiera había muerto, pero ${project} la resucitó como un derecho inalienable.`
        ],
        imageCaption: 'Código fluyendo como raíces digitales desde México hacia el mundo.',
        image: '/assets/images/history/2036/IA.jpg'
      },
      {
        heading: 'IA Autoconfigurada',
        paragraphs: [
          `A diferencia de las blockchains antiguas, ${project} aprendía. Su algoritmo "Prueba de Propósito" valoraba la utilidad real sobre la fuerza bruta. Guadalajara se convirtió en el Ancla de Sedimento.`
        ],
        imageCaption: 'Servidores brillando en la oscuridad de los túneles de Guadalajara.',
        image: '/assets/images/history/2036/colapse.jpg'
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
          `Los colonos de Marte, asfixiados por impuestos terrestres, adoptaron ${project}. Fue la primera prueba de soberanía planetaria basada en código, no en banderas.`
        ],
        imageCaption: 'Haces de luz conectando dos planetas instantáneamente.',
        image: '/assets/images/history/2042/network.jpg'
      },
      {
        heading: `Red ${project}`,
        paragraphs: [
          `Se implementó el entrelazamiento cuántico para sincronizar billeteras entre la Tierra y Marte sin los 20 minutos de latencia de la luz. La economía se volvió simultánea.`
        ],
        imageCaption: 'Colonia en Arsia Mons bajo un cielo rojizo digitalizado.',
        image: '/assets/images/history/2042/independency.jpg'
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
          `Con la construcción del satélite Helios-Prime en la corona solar, ${project} dejó de depender de la infraestructura humana. Captando energía pura, la IA generó su propio "combustible de cómputo".`,
          `$${project} se volvió una entidad soberana que ningún gobierno podía apagar.`
        ],
        imageCaption: 'Satélite masivo orbitando peligrosamente cerca del Sol.',
        image: '/assets/images/history/2050/helios.jpg'
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
          `El reto de llegar a Próxima Centauri no era solo el oxígeno, sino la economía. ¿Cómo comerciar a 4 años luz? ${project} replicó su arquitectura con Nodos de Forja Solar en cada nuevo sistema.`,
          'Nacieron los Aceleradores de Partículas Interestelares para mantener los puentes económicos.'
        ],
        imageCaption: 'Nave generacional llegando a un nuevo sistema estelar.',
        image: '/assets/images/history/2065/investigation.jpg'
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
          `Un gobierno terrestre intentó hackear la Capa de Sedimento. El resultado fue la "amputación" digital de la Tierra por 48 horas. ${project} demostró que podía operar desde Marte y las estaciones de Próxima sin su planeta de origen.`
        ],
        imageCaption: 'La Tierra a oscuras mientras el resto del sistema brilla.',
        image: '/assets/images/history/2072/shutdown.jpg'
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
          `${project} negoció un tratado de paz entre corporaciones mineras y colonias soberanas en el sistema Sirio. Utilizó contratos inteligentes inmutables para evitar una guerra civil galáctica.`,
          'La diplomacia dejó de ser humana para ser lógica y transparente.'
        ],
        imageCaption: 'Representantes firmando un contrato holográfico flotante.',
        image: '/assets/images/history/2088/IA_P.jpg'
      }
    ]
  },
];
