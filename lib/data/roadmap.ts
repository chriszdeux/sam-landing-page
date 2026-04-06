export interface RoadmapPhase {
  phase: string;
  title: string;
  status: "Activo" | "Próximamente" | "Completado";
  desc: string;
  details: string[];
  icon: string;
}

export const roadmapData: RoadmapPhase[] = [
  {
    phase: "Fase 1",
    title: "Lanzamiento MVP & Acceso Early",
    status: "Activo",
    desc: "Apertura del ecosistema web para registros e integración inicial. Prepárate para el inicio.",
    icon: "Rocket",
    details: [
      "Lanzamiento de Landing Page optimizada",
      "Activación de registros y perfiles de usuario",
      "Infraestructura de servidor base en GCP",
      "Canal de comunicación oficial activo"
    ]
  },
  {
    phase: "Fase 2",
    title: "Minería & Laboratorio",
    status: "Próximamente",
    desc: "Activación del marketplace minero, gestión de hardware, y simulación de desgaste operativo.",
    icon: "Cpu",
    details: [
      "Portal del Laboratorio de Minería",
      "Simulador de rendimiento de THAO",
      "Venta inicial de Hardware Siniestro",
      "Algoritmos de optimización de energía"
    ]
  },
  {
    phase: "Fase 3",
    title: "Consenso de Red Lyncore",
    status: "Próximamente",
    desc: "Participación en el Power Pool global, procesamiento de transacciones, inyección y recompensas de bloque.",
    icon: "Share2",
    details: [
      "Activación de Nodos de Consenso",
      "Protocolo de Seguridad Cuántica",
      "Distribución de recompensas de red",
      "Puente entre Tierra y Arsia Mons"
    ]
  },
  {
    phase: "Fase 4",
    title: "Economía y Trading",
    status: "Próximamente",
    desc: "Habilitación del comercio de tokens en el mercado abierto, liquidez, y portafolio avanzado.",
    icon: "TrendingUp",
    details: [
      "Despegue del $LYN Index",
      "Integración con DEX Interestelares",
      "Gestor de Portafolio de Carga Útil",
      "Fondo de Estabilidad Galáctica"
    ]
  }
];
