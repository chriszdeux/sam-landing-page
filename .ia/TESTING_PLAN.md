# TESTING_PLAN.md - Plan de Pruebas Unitarias Integrales

Este documento detalla el inventario de elementos a probar y la estrategia de ejecución para alcanzar una cobertura robusta en LynCore.

## 1. Inventario de Vistas (App Router)
Prioridad: **Alta** (Flujos de negocio y navegación)

- [ ] `app/page.tsx` (Landing Page)
- [ ] `app/auth/*` (Login, Register, Verify, Session Management)
- [ ] `app/galactic-market/*` (Market Stats, Exchange, Buy/Sell) - *Parcialmente probado*
- [ ] `app/laboratorio/page.tsx` (Core Gameplay Mechanics)
- [ ] `app/portfolio/page.tsx` (User Assets & Stats)
- [ ] `app/transactions/page.tsx` (Financial History)
- [ ] `app/exploracion-infinita/page.tsx`
- [ ] `app/market/*`
- [ ] `app/mechanics/*`
- [ ] `app/conquest/page.tsx`
- [ ] `app/network/page.tsx`
- [ ] `app/settings/page.tsx`

## 2. Inventario de Componentes Reutilizables
Prioridad: **Media-Alta** (Interactividad y consistencia visual)

### UI Base (`components/ui`)
- [ ] `Button.tsx`, `Input.tsx`, `Card.tsx`, `Modal.tsx`, `Section.tsx`
- [ ] `GenericTable.tsx`
- [ ] `TechFrame.tsx`
- [ ] `ToastStack.tsx`

### Módulos de Negocio
- [ ] `components/auth/*` (Forms y Loaders)
- [ ] `components/laboratorio/*` (Inventory, Charts, Slots Grid)
- [ ] `components/market/*` (Charts, Transaction Forms, Stats)
- [ ] `components/core_modules/*` (Simulator, Station Toast)
- [ ] `components/layout/*` (Navbar, Footer, Background)

## 3. Arquitectura de Estado (Redux Store)
Prioridad: **Crítica** (Lógica de negocio y persistencia)

### Slices & Reducers (`lib/features`)
- [ ] `auth` (Session, User Info, Token Management)
- [ ] `blockchain` (Node status, Blocks, Transactions)
- [ ] `market` (Prices, Orders, History)
- [ ] `transactions` (User operations)
- [ ] `economySlice.ts`
- [ ] `gameSlice.ts`
- [ ] `uiSlice.ts` (Global UI state)
- [ ] `spaceSlice.ts`

## 4. Funciones Utilitarias y Helpers
Prioridad: **Media** (Lógica pura)

- [ ] `lib/utils/core_modules_logic.ts` - *Probado*
- [ ] `lib/api.ts` (Axios interceptors, Error handling)
- [ ] `lib/data/*` (Architecture, History, Market data helpers)

## 5. Checklist de Acciones Inmediatas (Fase 2)
1. [ ] Configurar `vitest.config.ts` para soportar alias `@/*` y `jsdom`.
2. [ ] Crear `tests/utils/render-with-providers.tsx` para envolver componentes con `Redux`, `MUI Theme`, y `Router`.
3. [ ] Implementar Mocks Globales para:
   - `next/navigation`
   - `next/headers`
   - `framer-motion` (preferiblemente deshabilitar animaciones en tests)
   - `canvas-confetti`
4. [ ] Establecer Fixtures de datos para `RootState` inicial.

## 6. Próximos Pasos (Fase 3: Ejecución)
El orden de ejecución será:
1. **Redux Slices**: Garantizar que el estado muta correctamente.
2. **Utils**: Asegurar que los cálculos y transformaciones son precisos.
3. **Componentes UI**: Validar renderizado y eventos.
4. **Vistas/Páginas**: Pruebas de integración entre UI y Store.

---
**ATTE: FRONT**
