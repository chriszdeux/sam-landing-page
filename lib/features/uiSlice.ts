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

const initialState: UiState = {
  isModalOpen: false,
  activeModalContent: null,
  currentSection: 'home',
  notifications: [],
};

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

export const { openModal, closeModal, setCurrentSection, addNotification, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;
