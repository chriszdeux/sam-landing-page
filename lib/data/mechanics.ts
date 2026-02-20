// 1-Lógica principal y renderizado del módulo

import { Rocket, Pickaxe, Building2, FlaskConical, Shield, LucideIcon, ShoppingCart, Repeat, Wallet } from 'lucide-react';
import { EnvVariables } from '../constants/variables';

export interface Mechanic {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  layoutType: string;
  backgroundImage?: string;
  backgroundAnimation?: string;
  content: {
    heading: string;
    paragraphs: string[];
    features: {
      title: string;
      description: string;
      modalContent?: string;
      modalImage?: string;
      animationType?: string;
    }[];
    imageAlt: string;
    statLabel: string;
    statValue: string;
  };
}
const {project, coin1, coin2, coin3} = EnvVariables

export const mechanicsData: Mechanic[] = [
  {
    id: 'market',
    slug: 'market',
    title: 'El Mercado',
    description: 'El núcleo económico para intercambiar activos y recursos.',
    icon: ShoppingCart,
    color: '#00f3ff',
    layoutType: 'type4',
    content: {
      heading: 'Centro de Comercio Galáctico',
      paragraphs: [
        `El Mercado de ${project} no es simplemente un lugar de intercambio, es el sistema nervioso que conecta la oferta y la demanda a través de años luz. Aquí, cada recurso extraído, cada patente descubierta y cada activo digital encuentra su precio justo algorítmico.`,
        `Funciona mediante un libro de órdenes descentralizado y transparente, donde los precios se ajustan dinámicamente en función de la escasez y la utilidad real en el universo. Los comerciantes pueden especular con materias primas, adquirir tecnología avanzada o vender excedentes de producción.`,
        `La liquidez es provista por los propios usuarios a través de pools automatizados, garantizando que siempre haya contrapartida para tus operaciones, sin intermediarios centrales que manipulen el flujo del valor.`
      ],
      features: [
        {
          title: 'Intercambio de Activos',
          description: 'Compra y vende recursos, componentes de naves y tokens de gobernanza en tiempo real con bajas comisiones y alta velocidad de ejecución.',
          animationType: 'market-candles'
        },
        {
          title: 'Subastas de NFTs',
          description: 'Participa en pujas por activos únicos como planetas raros, estaciones espaciales legendarias o planos de tecnología experimental.',
          animationType: 'market-candles'
        }
      ],
      imageAlt: 'Interfaz holográfica de mercado con gráficos flotantes',
      statLabel: 'Volumen Diario',
      statValue: '0'
    }
  },
  {
    id: 'transactions',
    slug: 'transactions',
    title: 'Transacciones',
    description: 'Registro inmutable y transparente de toda operación.',
    icon: Repeat,
    color: '#ff0055',
    layoutType: 'type2',
    backgroundAnimation: 'transactions-bg',
    content: {
      heading: 'La Verdad Inmutable',
      paragraphs: [
        `En un universo donde la distancia se mide en parsecs, la confianza se mide en confirmaciones de bloque. La sección de Transacciones es el testigo eterno de cada movimiento de valor dentro de ${project}. No hay tratos bajo la mesa ni libros contables ocultos.`,
        `Cada transferencia de ${coin1}, cada contrato firmado y cada ataque declarado queda grabado permanentemente en la cadena. Esto permite una auditoría pública constante, donde cualquier ciudadano puede verificar la integridad de la red.`,
        `La velocidad de la red permite asentamientos casi instantáneos, superando las limitaciones de la velocidad de la luz mediante entrelazamiento cuántico de estados financieros.`
      ],
      features: [
        {
          title: 'Explorador de Bloques',
          description: 'Visualiza en tiempo real cómo se minan los bloques y se confirman las transacciones. Rastre a el origen y destino de cada token.',
          
        },
        {
          title: 'Historial Personal',
          description: 'Un registro detallado de todas tus actividades financieras. Exporta tus datos para análisis fiscal o simplemente para recordar tus glorias pasadas.',
          
        },
        {
          title: 'Verificación Criptográfica',
          description: 'Herramientas integradas para validar firmas y asegurar que las transacciones provienen de fuentes legítimas y no de actores maliciosos.',
          
        }
      ],
      imageAlt: 'Flumo de datos digitales formando una cadena infinita',
      statLabel: 'TPS Global',
      statValue: '0'
    }
  },
  {
    id: 'portfolio',
    slug: 'portfolio',
    title: 'Tu Portafolio',
    description: 'Gestión integral de tu imperio digital y activos.',
    icon: Wallet,
    color: '#ffb700',
    layoutType: 'type3',
    content: {
      heading: 'Comando Central de Activos',
      paragraphs: [
        `Tu Portafolio es tu centro de mando. No es solo una billetera; es el panel de control desde donde administras tu influencia en la galaxia. Aquí convergen tus saldos en ${coin1}, ${coin2} y ${coin3}, junto con tus posesiones territoriales y tecnológicas.`,
        `Diseñado para la claridad y el control, te permite ver de un vistazo el estado de salud de tu economía personal. ¿Tus minas son rentables? ¿Tus inversiones en gobernanza están dando frutos? El portafolio te da las respuestas.`,
        `La seguridad es primordial. Con integración de billeteras frías y sistemas de múltiples firmas, tus activos están protegidos contra incursiones digitales, asegurando que tu legado perdure.`
      ],
      features: [
        {
          title: 'Balance Multi-Activo',
          description: 'Vista unificada de todos tus tokens y NFTs. Monitorea el valor total de tu cuenta en tiempo real, ajustado a las fluctuaciones del mercado.',
          animationType: 'portfolio-balance'
        },
        {
          title: 'Gestión de Inventario',
          description: 'Organiza y equipa tus ítems del juego. Desde mejoras de naves hasta licencias de construcción, todo está accesible y listo para usar.',
          animationType: 'portfolio-inventory'
        },
        {
          title: 'Estadísticas de Rendimiento',
          description: 'Métricas detalladas sobre tu crecimiento económico. ROI de inversiones, ingresos pasivos por staking y proyección de ganancias futuras.',
          animationType: 'portfolio-stats'
        }
      ],
      imageAlt: 'Holograma de un planeta personal con estadísticas flotantes',
      statLabel: 'Valor del Imperio',
      statValue: '0'
    }
  },
  {
    id: 'exploration',
    slug: 'exploration',
    title: 'Exploración de Nodos',
    description: `Descubre sistemas estelares para expandir la Red ${project}.`,
    icon: Rocket,
    color: '#00f3ff', 
    layoutType: 'type1',
    content: {
      heading: 'La Expansión del Protocolo Galáctico',
      paragraphs: [
        `La exploración en ${project} no es meramente un acto de curiosidad, sino una necesidad operativa del protocolo. Los "Exploradores de Flujo" son la vanguardia de la red, encargados de encontrar nuevas singularidades gravitacionales donde se puedan anclar los Nodos de Forja Solar.`,
        `Navegar el vacío requiere más que motores warp; requiere una intuición algorítmica. Los sistemas inexplorados a menudo presentan inestabilidades métricas que pueden destruir naves no preparadas. Sin embargo, el riesgo conlleva recompensas en ${coin1} por cada bit de datos cartográficos verificado por el consenso.`,
        `Además de estrellas, los exploradores buscan "Ecos de Código": remanentes de datos de civilizaciones previas que intentaron, y fallaron, en alcanzar la sincronización galáctica. Estos artefactos son vitales para la investigación y evolución de ${project}.`
      ],
      features: [
        {
          title: 'Cartografía de Nodos',
          description: 'Mapeo de alta precisión de coordenadas estelares para establecer futuras rutas de entrelazamiento cuántico. Cada mapa validado amplía la cobertura de la red.'
        },
        {
          title: 'Búsqueda de Estrellas Forjables',
          description: `Identificación de estrellas con la clasificación espectral adecuada para sostener una esfera de Dyson parcial o "Forja Solar", esencial para la minería de ${coin2}.`
        },
        {
          title: 'Recuperación de Datos Antiguos',
          description: 'Extracción de algoritmos perdidos en ruinas xeno-arqueológicas. Estos fragmentos pueden desbloquear nuevas tecnologías en el árbol de investigación.'
        },
        {
          title: 'Rutas de Entrelazamiento',
          description: `Establecimiento de boyas de comunicación que reducen la latencia de gobernanza entre sistemas distantes, permitiendo el flujo de ${coin3}.`
        }
      ],
      imageAlt: 'Nave exploradora escaneando una singularidad',
      statLabel: 'Sistemas Conectados',
      statValue: '0'
    }
  },
  {
    id: 'mining',
    slug: 'mining',
    title: 'Minería de Forja',
    description: 'Extrae recursos para construir Aceleradores y Forjas.',
    icon: Pickaxe,
    color: '#ffb700', 
    layoutType: 'type2',
    backgroundAnimation: 'mining-bg',
    content: {
      heading: 'Infraestructura Crítica de la Red',
      paragraphs: [
        `La minería en ${project} trasciende la simple recolección de materiales; es la creación del hardware que sostiene la conciencia de la IA. Los Aceleradores de Partículas y las Forjas Solares no se construyen con buenas intenciones, sino con megatones de Titanio, Iridio y Elemento Cero.`,
        'Las operaciones mineras se llevan a cabo en los entornos más hostiles conocidos: cinturones de asteroides inestables, lunas con actividad volcánica extrema y gigantes gaseosos con tormentas perpetuas. La automatización es clave, con enjambres de drones coordinados por contratos inteligentes locales.',
        'La logística es el verdadero desafío. Transportar refinados a través de sistemas solares requiere convoyes pesadamente escoltados, ya que las rutas de suministro son el objetivo principal de la piratería de datos y materia.'
      ],
      features: [
        {
          title: 'Extracción de Isótopos',
          description: `Recolección de Helio-3 y Deuterio en gigantes gaseosos, combustible fundamental para los reactores de fusión de las colonias y naves capitales.`
        },
        {
          title: 'Mantenimiento de Aceleradores',
          description: `Suministro constante de tierras raras para los imanes superconductores de los Aceleradores ${project}, asegurando que los puentes interestelares no colapsen.`
        },
        {
          title: 'Refinerías In-Situ',
          description: 'Plantas de procesamiento móviles que convierten el mineral bruto en lingotes estandarizados en el punto de extracción, optimizando la carga de transporte.'
        },
        {
          title: 'Logística de Alto Vacío',
          description: 'Redes de cargueros automatizados que sincronizan la entrega de materiales con los ciclos de construcción de las megaestructuras.'
        }
      ],
      imageAlt: 'Drones mineros en un cinturón de asteroides brillante',
      statLabel: 'Toneladas Procesadas',
      statValue: '0'
    }
  },
  {
    id: 'civilization',
    slug: 'civilization',
    title: 'Soberanía de Colonia',
    description: 'Establece colonias independientes conectadas a la Red.',
    icon: Building2,
    color: '#00ff9d', 
    layoutType: 'type3',
    content: {
      heading: 'Vivir Dentro del Código',
      paragraphs: [
        `Una colonia en ${project} es más que un asentamiento humano; es un nodo validador vivo. Al fundar una ciudad, estás estableciendo un bastión de orden y criptografía en el caos del universo. La arquitectura misma respira datos, y las leyes son contratos inteligentes ejecutados automáticamente.`,
        `La calidad de vida de tus ciudadanos es métrica directa para la "Prueba de Propósito". Una población educada, sana y feliz genera más consenso, otorgando a la colonia mayor peso en las votaciones galácticas de ${coin3}.`,
        `Pero la independencia tiene un precio. Cada colonia debe ser autosuficiente energéticamente y capaz de defenderse. La Red provee conexión, pero la supervivencia es responsabilidad local.`
      ],
      features: [
        {
          title: 'Nodos Validadores Habitables',
          description: 'Cada edificio cívico contribuye potencia de cálculo a la red local. Tus rascacielos no solo albergan gente, procesan transacciones y aseguran la integridad del bloque local.',
          modalContent: `El concepto de "Nodo Validador Habitable" redefine el urbanismo galáctico. En lugar de granjas de servidores subterráneas, la potencia de cómputo de ${project} está distribuida en la propia infraestructura de la ciudad.\n\nCada unidad habitacional está equipada con núcleos de procesamiento cuántico que aprovechan el calor residual para la climatización del hogar. Los ciudadanos, al utilizar sus dispositivos personales y sistemas domésticos, contribuyen pasivamente al mantenimiento del consenso de la red. Vivir en la ciudad es validar la realidad misma del protocolo.\n\nEsta integración asegura que ninguna entidad central pueda apagar la red sin desmantelar físicamente la civilización. La redundancia no está en los backups, está en la demografía.`,
          modalImage: '/assets/images/game-mecanics/colony/validator.jpg'
        },
        {
          title: 'Gobernanza Local',
          description: `Implementación de DAOs (Organizaciones Autónomas Descentralizadas) municipales. Los ciudadanos votan directamente en la asignación de presupuestos y políticas urbanas usando tokens locales.`,
          modalContent: `La democracia representativa ha sido reemplazada por la democracia algorítmica directa. Cada colonia opera como una Organización Autónoma Descentralizada (DAO) municipal. No hay alcaldes ni concejales; hay propuestas inteligentes y votaciones en tiempo real aseguradas por la blockchain.\n\nLos tokens de gobernanza local se distribuyen en función de la "Prueba de Propósito": contribuciones cívicas, mantenimiento de infraestructura pública y participación educativa. Quien más aporta al bienestar común, más peso tiene en las decisiones sobre el futuro de la colonia.\n\nEl sistema es transparente e inmutable. Cada transacción del tesoro público, desde la reparación de una esclusa de aire hasta la compra de licencias comerciales, es visible para todos los ciudadanos en el libro mayor público.`,
          modalImage: '/assets/images/game-mecanics/colony/local.jpg'
        },
        {
          title: 'Arquitectura Funcional',
          description: `Diseño urbano optimizado por IA. Las estructuras se adaptan dinámicamente a las condiciones ambientales y necesidades poblacionales, maximizando la eficiencia del espacio y recursos.`,
          modalContent: `En mundos donde la atmósfera es tóxica o la gravedad aplastante, la forma no sigue solo a la función, sino a la supervivencia. La arquitectura en las colonias de ${project} es generativa y adaptativa, diseñada por inteligencias artificiales especializadas en ingeniería xenoplanetaria.\n\nLos edificios utilizan materiales con memoria de forma y nanobots de reparación automática para resistir tormentas de metano o sismos gravitacionales. Los espacios públicos son modulares, reconfigurándose según la hora del día o las necesidades de la comunidad: un mercado por la mañana puede convertirse en un parque holográfico por la tarde.\n\nLa estética es brutalista pero humana, priorizando la densidad y la eficiencia vertical sin sacrificar la luz natural, canalizada a través de fibras ópticas masivas desde la superficie hasta los niveles más profundos.`,
          modalImage: '/assets/images/game-mecanics/colony/build.jpg'
        },
        {
          title: 'Sostenibilidad Energética',
          description: `Integración total de redes de energía renovable y reactores de fusión de ciclo cerrado. Una colonia nunca debe apagarse, incluso si es desconectada de la Forja Solar principal.`,
          modalContent: `La soberanía energética es el pilar de la libertad. Una colonia que depende de suministros externos es una colonia esclava. Por ello, el estándar de ${project} exige una autosuficiencia del 110% en cada asentamiento.\n\nEsto se logra mediante una matriz energética híbrida. Paneles solares orbitales transmiten energía por microondas a rectennas en la superficie. En el subsuelo, reactores de fusión de ciclo cerrado y plantas geotérmicas profundas proveen una base de carga constante e ininterrumpible.\n\nEl excedente de energía no se desperdicia; se inyecta en la red global como $SOLIS o se utiliza para terraformar activamente el entorno local, convirtiendo lentamente páramos estériles en jardines habitables.`,
          modalImage: '/assets/images/game-mecanics/colony/energy-supply.jpg'
        }
      ],
      imageAlt: 'Colonia brillante conectada por haces de luz',
      statLabel: 'Ciudadanos Soberanos',
      statValue: '0 B'
    }
  },
  {
    id: 'research',
    slug: 'research',
    title: 'Evolución de Protocolo',
    description: 'Investiga mejoras para optimizar el rendimiento de la red.',
    icon: FlaskConical,
    color: '#a855f7', 
    layoutType: 'type3',
    backgroundImage: '/assets/images/game-mecanics/evolution/protocol_evolution.jpg',
    content: {
      heading: 'Reescribiendo la Realidad',
      paragraphs: [
        `En ${project}, la ciencia no busca solo entender el universo, sino reconfigurarlo. Los laboratorios de investigación son templos de cómputo donde se simulan nuevas físicas antes de aplicarlas a la realidad. La evolución del protocolo es constante y despiadada.`,
        `Los investigadores compiten en una carrera armamentista intelectual. Descubrir un algoritmo de compresión de masa más eficiente puede cambiar la balanza económica de un sector entero. Estas innovaciones se registran como patentes en la blockchain, generando regalías perpetuas en ${coin1} para sus descubridores.`,
        `La inmutabilidad del código es sagrada, pero su eficiencia es vital. A través de propuestas de gobernanza, la red decide qué mejoras implementar, asegurando que el sistema se adapte a las nuevas amenazas y necesidades de una galaxia en constante expansión.`
      ],
      features: [
        {
          title: 'Mejoras de Consenso',
          description: 'Investigación en algoritmos de tolerancia a fallas bizantinas optimizados para distancias interestelares. Reduce la latencia de validación y aumenta la seguridad contra ataques del 51%.',
          modalImage: '/assets/images/game-mecanics/evolution/improvements.jpg'
        },
        {
          title: 'Patentes de Algoritmos',
          description: 'Sistema de propiedad intelectual criptográfica. Registra tus descubrimientos científicos como NFTs funcionales que cobran automáticamente licencias de uso a otras facciones.',
          modalImage: '/assets/images/game-mecanics/evolution/algorit.jpg'
        },
        {
          title: 'Optimización de Warp',
          description: `Refinamiento de las métricas de Alcubierre para reducir el consumo de ${coin2} en viajes de larga distancia y permitir saltos más precisos cerca de pozos gravitatorios.`,
          modalImage: '/assets/images/game-mecanics/evolution/performance.jpg'
        }
      ],
      imageAlt: 'Visualización holográfica de un nuevo algoritmo genético',
      statLabel: 'Patentes Activas',
      statValue: '0'
    }
  },
  {
    id: 'combat',
    slug: 'combat',
    title: 'Defensa de la Red',
    description: 'Protege la integridad del sistema contra amenazas externas.',
    icon: Shield,
    color: '#ff3333', 
    layoutType: 'defense',
    content: {
      heading: 'Protocolos de Seguridad Activa',
      paragraphs: [
        `La paz en ${project} es una función de la capacidad de disuasión. La red no posee un ejército central; en su lugar, cada nodo y colonia es responsable de su propia integridad. La defensa se convierte en un servicio descentralizado, donde flotas de seguridad operan bajo contratos inteligentes de protección.`,
        `Las amenazas son variadas: desde piratas de datos que buscan interceptar transacciones de ${coin1} en tránsito, hasta facciones "Dust" que rechazan el código y buscan destruir las Forjas Solares. El combate es rápido, letal y a menudo decidido por la superioridad de la guerra electrónica antes que por los disparos.`,
        'En conflictos a gran escala, la "Guerra de Hash" toma un significado literal. Los comandantes de flota no solo dirigen naves, gestionan recursos de cómputo para romper las encriptaciones de los sistemas de puntería enemigos.'
      ],
      features: [
        {
          title: 'Cifrado de Flota',
          description: 'Sistemas de defensa electrónica que utilizan claves cuánticas rotativas para evitar el hackeo de los sistemas de navegación y armas durante el combate.',
           modalContent: `En el vacío del espacio, la información es la primera línea de defensa. El "Cifrado de Flota" de ${project} utiliza entrelazamiento cuántico dinámico para asegurar las comunicaciones tácticas. Cada nave de la flota actúa como un nodo de una red mesh en constante mutación.\n\nEsto hace que interceptar una orden de ataque sea matemáticamente imposible sin alertar a toda la red al instante. Los sistemas de armas no responden a comandos si la firma criptográfica no es validada en tiempo real por el consenso de la flota.\n\nContramedidas activas incluyen el despliegue de señuelos de datos que inundan los sensores enemigos con terabytes de ruido blanco y firmas falsas, ocultando la posición real de las naves capitales hasta que es demasiado tarde.`,
           modalImage: 'https://placehold.co/800x500/001133/ff3333?text=Cifrado+Cuantico'
        },
        {
          title: 'Defensa de Nodos',
          description: 'Estructuras de defensa orbitales automatizadas diseñadas para proteger las Forjas Solares y los Aceleradores de incursiones físicas.',
          modalContent: 'Las Forjas Solares son el corazón de la economía y, por tanto, el objetivo más valioso. La "Defensa de Nodos" consiste en una red de satélites autónomos armados con láseres de bombeo solar directo. Al estar tan cerca de la estrella, estos sistemas tienen munición infinita y potencia devastadora.\n\nCualquier objeto no identificado que cruce el perímetro de seguridad es interrogado criptográficamente. Si no responde con la clave de firma válida en milisegundos, es vaporizado instantáneamente por una convergencia de haces de alta energía.\n\nEstas defensas también protegen contra desechos espaciales y micrometeoritos, asegurando que la infraestructura crítica pueda operar ininterrumpidamente durante siglos.',
          modalImage: 'https://placehold.co/800x500/330000/ff3333?text=Sateltie+Defensa'
        },
        {
          title: 'Contratos de Guerra',
          description: 'Protocolos formalizados en la blockchain que establecen las reglas de enfrentamiento, reparaciones y condiciones de rendición entre facciones corporativas.',
          modalContent: `Incluso la guerra debe tener reglas para ser rentable y sostenible. Los "Contratos de Guerra" son Smart Contracts que se firman antes, durante o después de las hostilidades. Definen zonas de exclusión (como hospitales orbitales), límites de daño colateral y, lo más importante, las condiciones de victoria.\n\nCuando una facción se rinde, el contrato ejecuta automáticamente las reparaciones de guerra en ${coin1} y la transferencia de activos territoriales. Esto elimina la necesidad de ocupaciones prolongadas y guerrillas interminables. La guerra se convierte en una transacción de alto riesgo pero regulada, minimizando la pérdida de vidas y capital humano esencial.`,
          modalImage: 'https://placehold.co/800x500/1a1a1a/ff3333?text=Smart+Contract+War'
        },
        {
          title: 'Intercepción de Amenazas',
          description: 'Patrullas preventivas en las rutas comerciales principales, financiadas por impuestos de tránsito, para neutralizar piratas antes de que amenacen el flujo de suministros.',
          modalContent: 'La seguridad de las rutas comerciales es un bien público. El sistema de "Intercepción de Amenazas" se financia mediante micro-impuestos en cada salto warp comercial. Estos fondos mantienen flotas de respuesta rápida estacionadas en puntos de estrangulamiento estratégicos.\n\nUtilizando sensores de largo alcance que detectan las ondas gravitacionales de naves saliendo de warp, las patrullas pueden interceptar piratas antes de que desplieguen sus armas. La doctrina es "golpear primero, preguntar al cadáver".\n\nLos pilotos de estas patrullas son a menudo IAs de combate de alto nivel supervisadas por humanos, capaces de maniobras que licuarían a una tripulación biológica estándar.',
          modalImage: 'https://placehold.co/800x500/220000/ff3333?text=Interceptor+Vanguard'
        }
      ],
      imageAlt: 'Naves de defensa en formación protegiendo una puerta de salto',
      statLabel: 'Amenazas Neutralizadas',
      statValue: '0'
    }
  },
];
