// 1-Definir elementos de navegación principal

//# 1-Definir elementos de navegación principal
export const navItems = [
  { name: "Inicio", id: "home", path: "/", auth: false },
  { name: "Historia", id: "history", path: "/history", auth: false },
  { name: "Operaciones", id: "dashboard", path: "/operaciones", auth: true },
  { name: "Explorar Universo", id: "explorar", path: "/exploracion-infinita", auth: false },
  { name: "Mercado Galáctico", id: "galactic-market", path: "/galactic-market", auth: true },
  { name: "Mercado", id: "market", path: "/market", auth: true },
  { name: "Transacciones", id: "transactions", path: "/transactions", auth: true },
  { name: "Bloques", id: "blocks", path: "/operaciones/blocks", auth: true },
  { name: "Roadmap", id: "roadmap", path: "/roadmap", auth: false },
];
