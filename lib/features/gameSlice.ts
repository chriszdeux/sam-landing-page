// 1-Definir tipos para recursos y estado del juego
// 2-Establecer inventario inicial y planetas disponibles
// 3-Crear slice para lógica de juego y recolección
// 4-Exportar acciones y reducer principal del juego

//# 1-Definir tipos para recursos y estado del juego
import { createSlice } from '@reduxjs/toolkit';

interface Resource {
  id: string;
  name: string;
  type: 'Mineral' | 'Energy' | 'Biological' | 'Technological' | 'Construction' | 'Special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
}

interface GameState {
  resources: Resource[];
  planets: string[]; 
  collectedResources: number;
}

//# 2-Establecer inventario inicial y planetas disponibles
const initialState: GameState = {
  resources: [
    { id: 'iron', name: 'Iron', type: 'Mineral', rarity: 'Common', description: 'Basic building material.' },
    { id: 'titanium', name: 'Titanium', type: 'Mineral', rarity: 'Rare', description: 'Strong and lightweight metal.' },
    { id: 'helium3', name: 'Helium-3', type: 'Energy', rarity: 'Rare', description: 'Fuel for fusion reactors.' },
    { id: 'unobtainium', name: 'Unobtainium', type: 'Special', rarity: 'Epic', description: 'Extremely rare material with anti-gravity properties.' },
  ],
  planets: ['Earth', 'Mars', 'Moon', 'Kepler-186f'],
  collectedResources: 0,
};

//# 3-Crear slice para lógica de juego y recolección
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    collectResource: (state) => {
      state.collectedResources += 1;
    },
  },
});

//# 4-Exportar acciones y reducer principal del juego
export const { collectResource } = gameSlice.actions;

export default gameSlice.reducer;
