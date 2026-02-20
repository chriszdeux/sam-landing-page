// 1-Definir tipos e interfaces para el estado de la UI
// 2-Establecer el estado inicial para modales y alertas
// 3-Crear slice de Redux y configuracion de reducers
// 4-Exportar acciones para manipular el estado
// 5-Exportar reducer para integracion en store

//# 1-Definir tipos e interfaces para el estado de la UI
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface UiState {
  isModalOpen: boolean;
  activeModalContent: string | null;
  currentSection: string;
  notifications: Notification[];
}

//# 2-Establecer el estado inicial para modales y alertas
const initialState: UiState = {
  isModalOpen: false,
  activeModalContent: null,
  currentSection: 'home',
  notifications: [],
};

//# 3-Crear slice de Redux y configuracion de reducers
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state.isModalOpen = true;
      state.activeModalContent = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.activeModalContent = null;
    },
    setCurrentSection: (state, action: PayloadAction<string>) => {
      state.currentSection = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'> & { id?: string }>) => {
        const id = action.payload.id || Date.now().toString();
        state.notifications.push({
            ...action.payload,
            id,
            duration: action.payload.duration || 5000
        });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
    }
  },
});

//# 4-Exportar acciones para manipular el estado
export const { openModal, closeModal, setCurrentSection, addNotification, removeNotification } = uiSlice.actions;

//# 5-Exportar reducer para integracion en store
export default uiSlice.reducer;
