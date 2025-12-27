
import { Rocket, Pickaxe, Building2, FlaskConical, Coins, Shield, LucideIcon } from 'lucide-react';

export interface Mechanic {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  layoutType: string;
  content: {
    heading: string;
    paragraphs: string[];
    features: string[];
    imageAlt: string;
    statLabel: string;
    statValue: string;
  };
}

export const mechanicsData = [
  {
    id: 'exploration',
    slug: 'exploration',
    title: 'Exploración Espacial',
    description: 'Descubre nuevos planetas y sistemas solares con recursos únicos.',
    icon: Rocket,
    color: '#00f3ff', // Cyan
    layoutType: 'type1',
    content: {
      heading: 'La Frontera Final Te Espera',
      paragraphs: [
        'La exploración en SAM no es solo moverse de un punto A a un punto B. Es una odisea calculada donde cada parsec cuenta. Los exploradores navegan a través de un universo generado proceduralmente, donde cada sistema estelar alberga secretos, anomalías gravitacionales y, lo más importante, oportunidades económicas inexploradas.',
        'Equipados con motores de distorsión de última generación, los jugadores pueden cartografiar sectores desconocidos. Los datos astrofísicos recolectados tienen un valor inmenso en el mercado de información, permitiendo a otros jugadores planificar rutas comerciales seguras o expediciones mineras.',
        'Pero el vacío no está vacío. Ruinas antiguas flotan en la oscuridad, protegidas por sistemas de defensa olvidados. Solo los capitanes más audaces, con naves preparadas para lo desconocido, podrán reclamar los tesoros que yacen en los confines de la galaxia conocida.'
      ],
      features: ['Generación Procedural de Galaxias', 'Sistemas de Escaneo Profundo', 'Mapeo de Rutas Comerciales', 'Eventos Cósmicos Aleatorios'],
      imageAlt: 'Nave exploradora frente a una nebulosa colorida',
      statLabel: 'Sistemas Descubiertos',
      statValue: '14,052'
    }
  },
  {
    id: 'mining',
    slug: 'mining',
    title: 'Recolección',
    description: 'Extrae minerales y recursos vitales para la expansión.',
    icon: Pickaxe,
    color: '#ffb700', // Gold/Orange
    layoutType: 'type2',
    content: {
      heading: 'El Motor de la Economía',
      paragraphs: [
        'La minería es el corazón palpitante de SAM. Sin materias primas, no hay flotas, no hay ciudades y no hay comercio. Desde la extracción de isótopos volátiles en gigantes gaseosos hasta la minería de núcleo en asteroides densos, cada operación requiere maquinaria especializada y una gestión de energía precisa.',
        'Los mineros deben equilibrar el riesgo y la recompensa. Las zonas más ricas en recursos suelen estar ubicadas en sectores inestables o disputados. ¿Arriesgarás tu flota de drones extractores en un cinturón de asteroides radiactivo por la promesa de Platino-Irridio?',
        'La tecnología de extracción evoluciona constantemente. Los jugadores pueden investigar láseres de fractura más eficientes, refinerías orbitales automatizadas y redes de transporte logístico para maximizar su rendimiento por ciclo.'
      ],
      features: ['Drones de Minería Autónomos', 'Refinerías Modulares', 'Gestión de Residuos', 'Prospección Geológica Avanzada'],
      imageAlt: 'Láseres de minería cortando un asteroide',
      statLabel: 'Toneladas Extraídas',
      statValue: '8.4M'
    }
  },
  {
    id: 'civilization',
    slug: 'civilization',
    title: 'Civilización',
    description: 'Construye y gestiona colonias prósperas.',
    icon: Building2,
    color: '#00ff9d', // Neon Green
    layoutType: 'type3',
    content: {
      heading: 'Construye el Futuro',
      paragraphs: [
        'Fundar una colonia es el primer paso hacia el imperio. En la superficie de mundos alienígenas, los jugadores deben diseñar hábitats sostenibles, gestionar la atmósfera y proveer para las necesidades de una población creciente. La felicidad de tus colonos impacta directamente en la productividad.',
        'La arquitectura en SAM es modular y funcional. Cada edificio tiene un propósito, desde los reactores de fusión que alimentan la red hasta los domos agrícolas que alimentan a la gente. La planificación urbana es clave: una colonia mal diseñada colapsará bajo su propio peso logístico.',
        'A medida que tu civilización crece, desbloquearás megaestructuras. Elevadores espaciales, anillos orbitales y esferas de Dyson son los monumentos definitivos al dominio humano sobre la materia y la energía.'
      ],
      features: ['Planificación Urbana Modular', 'Gestión de Felicidad y Recursos', 'Terraformación Planetaria', 'Megaestructuras Orbitales'],
      imageAlt: 'Ciudad futurista bajo una cúpula en Marte',
      statLabel: 'Población Total',
      statValue: '2.1B'
    }
  },
  {
    id: 'research',
    slug: 'research',
    title: 'Laboratorio',
    description: 'Investiga nuevas tecnologías y mejoras.',
    icon: FlaskConical,
    color: '#d600ff', // Purple
    layoutType: 'type4',
    content: {
      heading: 'Innovación sin Límites',
      paragraphs: [
        'El estancamiento es la muerte. En los laboratorios de SAM, la ciencia roza la magia. Los árboles tecnológicos son vastos y se ramifican en disciplinas como la propulsión cuántica, la inteligencia artificial sintiente y la bioingeniería genética.',
        'La investigación no es pasiva; requiere datos experimentales, muestras raras y, a menudo, la colaboración de múltiples facciones. Los descubrimientos más importantes otorgan patentes que generan regalías cada vez que otros jugadores utilizan tu tecnología.',
        '¿Te centrarás en la eficiencia industrial o en la superioridad militar? ¿O quizás desbloquearás los secretos de la conciencia digital? El camino que elijas definirá las capacidades de tu facción por generaciones.'
      ],
      features: ['Árboles Tecnológicos Ramificados', 'Patentes y Regalías', 'Investigación Colaborativa', 'Prototipos Experimentales'],
      imageAlt: 'Científicos trabajando en un holograma de ADN complejo',
      statLabel: 'Tecnologías Patentadas',
      statValue: '4,096'
    }
  },
  {
    id: 'economy',
    slug: 'economy',
    title: 'Economía',
    description: 'Comercia recursos y activos en un mercado libre.',
    icon: Coins,
    color: '#ff0055', // Red/Pink
    layoutType: 'type1',
    content: {
      heading: 'El Mercado Nunca Duerme',
      paragraphs: [
        'La economía de SAM es completamente dirigida por los jugadores. No hay NPCs fijando precios; cada transacción refleja la oferta y la demanda real del servidor. Los comerciantes astutos pueden hacer fortunas arbitrando precios entre sistemas estelares distantes.',
        'Los contratos inteligentes permiten acuerdos comerciales complejos, préstamos, seguros y futuros. Puedes especular con el precio del hidrógeno o acaparar el mercado de chips de silicio. Pero ten cuidado: la manipulación del mercado puede atraer la atención de reguladores o sindicatos rivales.',
        'Crea tu propia moneda corporativa, emite acciones de tu alianza y paga dividendos a tus inversores. En SAM, el poder financiero es tan letal como un cañón de riel.'
      ],
      features: ['Mercado Libre Player-Driven', 'Contratos Inteligentes', 'Bolsa de Valores Galáctica', 'Divisas  Corporativas'],
      imageAlt: 'Pantallas de trading holográficas mostrando gráficos alcistas',
      statLabel: 'Volumen Diario (SAM)',
      statValue: '$930M'
    }
  },
  {
    id: 'combat',
    slug: 'combat',
    title: 'Combate Espacial',
    description: 'Defiende tus colonias de piratas y facciones rivales.',
    icon: Shield,
    color: '#ff3333', // Pure Red
    layoutType: 'type2',
    content: {
      heading: 'Diplomacia Cinética',
      paragraphs: [
        'A veces, las palabras fallan. Cuando lo hacen, los cañones hablan. El combate en SAM es táctico y despiadado. Diseña tus propias naves, elige el blindaje, el armamento y los sistemas de guerra electrónica para contrarrestar a tus enemigos.',
        'Las batallas pueden variar desde escaramuzas entre cazas ligeros hasta asedios masivos de flotas capitales que duran días. La balística es real, el posicionamiento importa y la pérdida de una nave insignia puede cambiar el equilibrio de poder de un sector entero.',
        'Protege tus rutas comerciales con patrullas automatizadas o contrata mercenarios para hacer el trabajo sucio. En el vacío, la ley la dicta quien tiene la mayor potencia de fuego.'
      ],
      features: ['Diseño Modular de Naves', 'Física Newtoniana de Combate', 'Guerra Electrónica', 'Flotas Mercenarias'],
      imageAlt: 'Batalla espacial épica con láseres y explosiones',
      statLabel: 'Naves Destruidas',
      statValue: '85,402'
    }
  },
];
