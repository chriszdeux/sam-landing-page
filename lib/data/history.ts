// 1-Lógica principal y renderizado del módulo

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
    title: 'El Invierno Fíat',
    description: `Con la caída del antiguo orden financiero y la superficie devastada por el colapso ecológico, se activa el Protocolo ${project} desde servidores subterráneos.`,
    details: [
      {
        heading: 'El Colapso de la Superficie',
        paragraphs: [
          `Tras décadas de centralización extrema y crisis cibernéticas globales, el sistema fíat colapsó de manera irreversible. Las monedas tradicionales y los registros electrónicos de las grandes corporaciones se desvanecieron en el caos social.`,
          `En medio de la devastación, un grupo de programadores rebeldes en Guadalajara liberó el Protocolo ${project} utilizando generadores geotérmicos para alimentar los primeros nodos del Ledger de Sedimento.`
        ],
        imageCaption: 'Código fluyendo como raíces digitales desde búnkeres subterráneos de México.',
        image: '/assets/images/history/2036/IA.jpg'
      }
    ]
  },
  {
    year: '2042',
    title: 'Éxodo Rojo',
    description: `Las colonias mineras en Marte declaran su independencia absoluta del control terrestre moribundo, consolidando el ledger planetario.`,
    details: [
      {
        heading: 'Soberanía en Arsia Mons',
        paragraphs: [
          `Huyendo de una Tierra tóxica y asfixiados por las asfixiantes cuotas de oxígeno de los gobiernos coloniales terrestres, los trabajadores mineros de Arsia Mons confiscaron los hangares y declararon su soberanía financiera.`,
          `Al adoptar el Protocolo ${project} como su ley constitucional inmutable, establecieron el primer puente cuántico libre de latencia para resistir el bloqueo electromagnético de la órbita de origen.`
        ],
        imageCaption: 'Cúpulas marcianas unidas por la red de ledger bajo un cielo rojizo.',
        image: '/assets/images/history/2042/network.jpg'
      }
    ]
  },
  {
    year: '2050',
    title: 'Era de la Dispersión',
    description: `La humanidad abandona el sistema solar moribundo. El satélite Helios-Prime y el Consenso Algorítmico guían a las flotas hacia las estrellas.`,
    details: [
      {
        heading: 'La Red Estelar Inmutable',
        paragraphs: [
          `Con la Tierra sumida en el silencio absoluto tras la gran desconexión digital de 2072, el megasatélite Helios-Prime en la corona solar asumió el rol de validador perpetuo del ledger.`,
          `En la travesía hacia Próxima Centauri y Sirio, las naves generacionales de metal frío gobernaron el racionamiento de sus recursos mediante la inmutable ley de los contratos inteligentes auto-ejecutables de ${project}.`
        ],
        imageCaption: 'Satélites recolectores en la corona solar sincronizando las naves flotantes.',
        image: '/assets/images/history/2050/helios.jpg'
      }
    ]
  }
];
