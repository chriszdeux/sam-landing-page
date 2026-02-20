// 1-Obtención del despachador para emitir acciones al store
// 2-Obtención del despachador para emitir acciones al store
// 3-Selección de datos desde el estado global de Redux

//# 1-Obtención del despachador para emitir acciones al store
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store';

//# 2-Obtención del despachador para emitir acciones al store
export const useAppDispatch: () => AppDispatch = useDispatch;

//# 3-Selección de datos desde el estado global de Redux
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppStore: () => AppStore = useStore;
