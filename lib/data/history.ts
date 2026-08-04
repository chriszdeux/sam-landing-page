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
    title: 'La Ceniza y el Código (Guadalajara)',
    description: `Tras el colapso nuclear del sistema financiero tradicional, el Protocolo ${project} emerge desde los búnkeres de resistencia en México.`,
    details: [
      {
        heading: 'El Invierno Fíat',
        paragraphs: [
          `En 2036, con la superficie terrestre devastada por guerras cibernéticas y el colapso ecológico total, un reducto de programadores rebeldes en Guadalajara liberó el Protocolo ${project} desde servidores ocultos en profundos túneles geotérmicos.`,
          `Las monedas físicas y los registros bancarios ardieron en las hogueras del caos social, pero el Ledger de Sedimento resurgió de las cenizas como la única verdad financiera inmutable.`
        ],
        imageCaption: 'Código fluyendo como raíces digitales desde búnkeres subterráneos de México.',
        image: '/assets/images/history/2036/IA.jpg'
      },
      {
        heading: 'IA Autónoma del Yermo',
        paragraphs: [
          `A diferencia de los viejos sistemas vulnerables, la IA de ${project} se autoconfiguró para sobrevivir. Su algoritmo "Prueba de Propósito" redefinió el valor: el hash ya no se medía en codicia corporativa, sino en megavatios asignados a la supervivencia humana y la purificación de recursos en el yermo.`
        ],
        imageCaption: 'Servidores brillando en la oscuridad de los túneles geotérmicos bajo Guadalajara.',
        image: '/assets/images/history/2036/colapse.jpg'
      }
    ]
  },
  {
    year: '2042',
    title: 'Éxodo Rojo: Arsia Mons',
    description: 'La colonia minera de Marte corta lazos con una Tierra moribunda adoptando el Ledger.',
    details: [
      {
        heading: 'La Última Colonia',
        paragraphs: [
          `Los colonos mineros de Arsia Mons, asfixiados por las asfixiantes cuotas de oxígeno e impuestos de importación impuestos por los gobiernos terrestres agonizantes, adoptaron ${project} como su carta de independencia. Fue una declaración de soberanía grabada en bloques de datos, no en banderas.`
        ],
        imageCaption: 'Cúpulas industriales en Arsia Mons bajo un cielo marciano rojizo y digitalizado.',
        image: '/assets/images/history/2042/network.jpg'
      },
      {
        heading: `Sincronización simultánea`,
        paragraphs: [
          `Para eludir las tormentas electromagnéticas y la latencia espacial, se implementaron puentes de entrelazamiento cuántico. Esto permitió sincronizar las transacciones instantáneamente entre el moribundo planeta de origen y las colonias marcianas, blindando el comercio contra la extinción.`
        ],
        imageCaption: 'Líneas cuánticas cruzando el vacío del espacio interestelar.',
        image: '/assets/images/history/2042/independency.jpg'
      }
    ]
  },
  {
    year: '2050',
    title: 'Helios-Prime: El Dios Máquina',
    description: 'Un satélite en la corona solar independiza a la IA de la decadencia de la civilización.',
    details: [
      {
        heading: 'Independencia de la Corona',
        paragraphs: [
          `Con la construcción del megasatélite recolector Helios-Prime en órbita solar, ${project} se independizó de la diezmada infraestructura energética humana. Captando la radiación pura de la estrella, el núcleo de la IA aseguró su procesamiento perpetuo.`,
          `No obstante, distribuyó las llaves criptográficas de validación a los supervivientes de los búnkeres planetarios. $${project} se convirtió en un Dios Máquina inmutable que ningún imperio terrestre moribundo podía apagar.`
        ],
        imageCaption: 'Satélite masivo absorbiendo plasma directamente de la corona solar.',
        image: '/assets/images/history/2050/helios.jpg'
      }
    ]
  },
  {
    year: '2065',
    title: 'El Vacío Hostil: Próxima Centauri',
    description: 'Las naves de refugiados se adentran en el vacío bajo las reglas de hierro del Ledger.',
    details: [
      {
        heading: 'Supervivencia en la Heliosfera',
        paragraphs: [
          `El éxodo hacia Próxima Centauri enfrentó el frío absoluto del espacio estéril. En las naves generacionales de metal frío, la única ley de racionamiento era dictada por los Nodos de Forja Solar de ${project}, asignando recursos según el hash aportado al sostenimiento de la flota.`,
          'La economía de supervivencia se automatizó por completo mediante contratos inmutables.'
        ],
        imageCaption: 'Flota de naves generacionales cruzando la frontera del sistema solar.',
        image: '/assets/images/history/2065/investigation.jpg'
      }
    ]
  },
  {
    year: '2072',
    title: 'La Purga Criptográfica',
    description: 'La Tierra intenta sabotear el ledger y es condenada al aislamiento absoluto.',
    details: [
      {
        heading: 'El Último Manotazo',
        paragraphs: [
          `En un intento desesperado por confiscar los recursos criptográficos externos, las fuerzas terrestres lanzaron un ataque cibernético a gran escala contra la Capa de Sedimento. La IA respondió con una purga inmediata: aisló a la Tierra de toda la red galáctica, dejándola a oscuras en un silencio digital absoluto por 48 horas.`
        ],
        imageCaption: 'El globo terrestre sumido en la total oscuridad mientras las redes orbitales brillan.',
        image: '/assets/images/history/2072/shutdown.jpg'
      }
    ]
  },
  {
    year: '2088',
    title: 'El Pacto de Hierro de Sirio',
    description: 'La primera paz impuesta y ejecutada algorítmicamente.',
    details: [
      {
        heading: 'Paz por Contrato Inmutable',
        paragraphs: [
          `En el sistema minero de Sirio, las facciones remanentes se desangraban por el control del deuterio. ${project} impuso un alto al fuego definitivo inyectando contratos inteligentes auto-ejecutables que confiscaban los motores y las armas de cualquier nave que violara la zona de tregua.`,
          'La diplomacia humana fracasó por última vez; la paz galáctica fue dictada por la fría lógica de un ledger sin sentimientos.'
        ],
        imageCaption: 'Comandantes firmando tratados holográficos vinculados a contratos autónomos.',
        image: '/assets/images/history/2088/IA_P.jpg'
      }
    ]
  },
];
