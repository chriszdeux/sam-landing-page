'use client';
// 1-Importar dependencias y configuración de Redux
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/store';

// 2-Crear proveedor del store para la aplicación
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  
  // 3-Inicializar store solo una vez por cliente
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // 4-Proveer el store a los componentes hijos
  return <Provider store={storeRef.current as AppStore}>{children}</Provider>;
}
