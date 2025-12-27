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
    year: '2024',
    title: 'El Colapso',
    description: 'La economía global se fractura. Las monedas fiat pierden su valor.',
    details: [
      {
        heading: 'La Caída de los Gigantes',
        paragraphs: [
          'En los últimos meses de 2024, la inflación global alcanzó niveles insostenibles. Los sistemas bancarios tradicionales, sobrecargados por décadas de deuda y políticas monetarias inestables, comenzaron a fallar en cadena.',
          'El dólar y el euro perdieron su hegemonía en cuestión de semanas, sumiendo a los mercados internacionales en el caos. Las cadenas de suministro se rompieron, y la confianza en las instituciones centralizadas se evaporó.'
        ],
        imageCaption: 'Gráficos bursátiles en rojo colapsando sobre un fondo de ciudades oscuras.'
      },
      {
        heading: 'El Despertar Descentralizado',
        paragraphs: [
          'En medio de la incertidumbre, las comunidades comenzaron a organizarse. Sin un ente central en quien confiar, la población volvió su mirada hacia sistemas alternativos de valor.',
          'Fue un periodo de dura transición, pero necesario para sembrar las semillas de lo que vendría después: una economía basada en la verdad matemática y no en la promesa política.'
        ],
        imageCaption: 'Redes digitales peer-to-peer iluminándose en el mapa global.'
      }
    ]
  },
  {
    year: '2025',
    title: 'El Renacimiento Digital',
    description: 'Surge SAM como el nuevo estándar económico descentralizado.',
    details: [
      {
        heading: 'Génesis de SAM',
        paragraphs: [
          'De las cenizas del sistema anterior surgió SAM (Sistema Autónomo Monetario). No era solo una moneda, sino un protocolo completo de gestión de recursos y gobernanza algorítmica.',
          'SAM eliminó la necesidad de intermediarios humanos corruptibles. Su código inmutable garantizaba la equidad y la transparencia en cada transacción.'
        ],
        imageCaption: 'El logotipo de SAM brillando como un faro digital.'
      },
      {
        heading: 'Adopción Global',
        paragraphs: [
          'La adopción fue rápida. Ciudades enteras comenzaron a integrar SAM en su infraestructura básica. La energía, el transporte y los servicios públicos se tokenizaron, creando una economía fluida y eficiente.',
          'La humanidad había encontrado una nueva forma de coordinarse, liberando un potencial de cooperación nunca antes visto.'
        ],
        imageCaption: 'Ciudades futuristas integradas con flujos de datos visibles.'
      }
    ]
  },
  {
    year: '2028',
    title: 'La Expansión',
    description: 'La humanidad mira hacia las estrellas en busca de nuevos recursos.',
    details: [
      {
        heading: 'Límites Terrestres',
        paragraphs: [
          'Con la economía estabilizada, el siguiente desafío se hizo evidente: los recursos de la Tierra eran finitos. Para asegurar la prosperidad continua de la civilización impulsada por SAM, era necesario mirar hacia arriba.',
          'Las grandes corporaciones descentralizadas (DACs) comenzaron a financiar los programas espaciales más ambiciosos de la historia.'
        ],
        imageCaption: 'Lanzamiento masivo de cohetes reutilizables hacia la órbita.'
      },
      {
        heading: 'Minería de Asteroides',
        paragraphs: [
          'Las primeras sondas autónomas regresaron con datos prometedores. El cinturón de asteroides contenía más metales preciosos y minerales raros que todas las reservas terrestres combinadas.',
          'Se inició la carrera por la minería espacial, no impulsada por banderas nacionales, sino por el consenso de la red SAM.'
        ],
        imageCaption: 'Drones mineros extrayendo recursos de un asteroide.'
      }
    ]
  },
  {
    year: '2030',
    title: 'La Era de la Colonización',
    description: 'Se establecen las primeras colonias en el sistema solar.',
    details: [
      {
        heading: 'Base Luna Alpha',
        paragraphs: [
          'La Luna se convirtió en el primer puerto espacial industrial. Las refinerías de Helio-3 proporcionaron la energía limpia necesaria para impulsar naves hacia Marte y más allá.',
          'La vida en las colonias era dura pero llena de propósito. Los colonos, pagados en SAM, se convirtieron en los nuevos pioneros de la humanidad.'
        ],
        imageCaption: 'Cúpulas habitables en la superficie lunar con la Tierra de fondo.'
      },
      {
        heading: 'Terraformación Incipiente',
        paragraphs: [
          'En Marte, los primeros experimentos de terraformación comenzaron a dar frutos. Jardines hidropónicos bajo cúpulas de cristal no solo proveían alimento, sino que simbolizaban la esperanza de un segundo hogar.',
          'La sociedad multiplanetaria dejaba de ser ciencia ficción para convertirse en realidad palpable.'
        ],
        imageCaption: 'Invernaderos marcianos brillando en el paisaje rojo.'
      }
    ]
  },
  {
    year: '2035',
    title: 'La Federación Galáctica',
    description: 'Se forma un gobierno unificado para gestionar los recursos del sistema solar.',
    details: [
      {
        heading: 'Unificación Política',
        paragraphs: [
          'La distancia entre los mundos requería una nueva forma de organización. La Federación Galáctica nació no como un imperio, sino como una red de nodos autónomos interconectados por SAM.',
          'Las decisiones se tomaban mediante votaciones cuadráticas en la blockchain, asegurando que cada voz, desde la Tierra hasta Europa, fuera escuchada.'
        ],
        imageCaption: 'Consejo holográfico con representantes de diferentes colonias.'
      },
      {
        heading: 'La Paz de los Recursos',
        paragraphs: [
          'Con la abundancia de recursos del sistema solar gestionada eficientemente, los conflictos bélicos por territorio y materiales se volvieron obsoletos.',
          'La humanidad entró en una edad dorada de innovación científica y cultural.'
        ],
        imageCaption: 'Naves de carga pacíficas cruzando el vacío espacial.'
      }
    ]
  },
  {
    year: '2040',
    title: 'El Descubrimiento del Vacío',
    description: 'Se detectan señales de una antigua civilización en los bordes del sistema.',
    details: [
      {
        heading: 'La Señal',
        paragraphs: [
          'Los radiotelescopios de espacio profundo en la órbita de Plutón captaron una anomalía. Una señal estructurada, matemática, que no provenía de ninguna fuente humana.',
          'No era ruido cósmico. Era un mensaje. O quizás, una advertencia.'
        ],
        imageCaption: 'Visualización de onda de datos compleja y misteriosa.'
      },
      {
        heading: 'El Primer Contacto',
        paragraphs: [
          'SAM decodificó parte del mensaje, revelando coordenadas hacia un punto en el Cinturón de Kuiper. Una expedición se prepara para investigar.',
          'La humanidad se encuentra ante su mayor umbral: no estamos solos, y el universo es mucho más antiguo y extraño de lo que imaginábamos.'
        ],
        imageCaption: 'Una estructura alienígena colosal emergiendo de la oscuridad del espacio.'
      }
    ]
  },
];
