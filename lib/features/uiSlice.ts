import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isModalOpen: boolean;
  activeModalContent: string | null;
  currentSection: string;
}

const initialState: UiState = {
  isModalOpen: false,
  activeModalContent: null,
  currentSection: 'home',
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
  },
});

export const { openModal, closeModal, setCurrentSection } = uiSlice.actions;
export default uiSlice.reducer;
