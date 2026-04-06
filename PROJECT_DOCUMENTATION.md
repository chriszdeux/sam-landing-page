# Lyncore — Documentación Técnica del Proyecto

## 1. Descripción General

**Lyncore** es una plataforma web de simulación de inversiones en criptomonedas con elementos de gamificación (exploración espacial, minería, recompensas). Permite a los usuarios registrarse, gestionar wallets, comprar/vender criptoactivos simulados, visualizar analíticas de mercado y participar en un sistema de recompensas basado en blockchain simulada.

---

## 2. Stack Tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.2 |
| Runtime | React | 19.2.0 |
| Lenguaje | TypeScript (strict mode) | 5.x |
| State Management | Redux Toolkit + React-Redux | 2.11.0 / 9.2.0 |
| UI Framework | Material UI (MUI) | 7.3.5 |
| CSS | Tailwind CSS + Emotion | 4.x / 11.14.x |
| Animaciones | Framer Motion, GSAP | 12.23.x / 3.14.x |
| Gráficos | Chart.js + react-chartjs-2, Recharts | 4.5.1 / 3.6.0 |
| HTTP Client | Axios | 1.13.2 |
| Formularios | React Hook Form + Zod | 7.67.0 / 4.1.13 |
| Iconos | Lucide React, MUI Icons | 0.555.0 / 7.3.5 |
| Efectos | canvas-confetti | 1.9.4 |
| Fuentes | Geist, Geist Mono, Roboto | Google Fonts |

---

## 3. Variables de Entorno

```env
NEXT_PUBLIC_PROJECT_NAME=Lyncore
NEXT_PUBLIC_COIN1=THAO
NEXT_PUBLIC_COIN2=SOLIS
NEXT_PUBLIC_COIN3=ASTA
NEXT_PUBLIC_API_URL=http://localhost:8000
```

La URL base de la API se construye como: `${NEXT_PUBLIC_API_URL}/sam-v1`

---

## 4. Arquitectura del Proyecto

### 4.1 Estructura de Carpetas

```
├── app/                          # App Router (páginas y rutas)
│   ├── layout.tsx                # Layout raíz (StoreProvider + ThemeRegistry + AuthLoader)
│   ├── page.tsx                  # Home (Hero, History, Mechanics)
│   ├── StoreProvider.tsx         # Provider de Redux
│   ├── auth/
│   │   ├── logging-in/           # Animación post-login
│   │   ├── logging-out/          # Animación post-logout
│   │   └── verify/               # Verificación de cuenta + registro
│   ├── market/
│   │   ├── page.tsx              # Listado de criptomonedas
│   │   ├── [id]/                 # Detalle de cripto
│   │   └── trade/                # Formulario de transacción
│   ├── portfolio/                # Gestión de wallets y activos
│   ├── network/
│   │   ├── page.tsx              # Listado de redes blockchain
│   │   └── [id]/                 # Detalle de red + conexión
│   ├── laboratorio/              # Feature de minería/laboratorio
│   ├── transactions/             # Historial de transacciones
│   ├── rewards/                  # Sistema de recompensas
│   ├── news/                     # Noticias (listado + detalle)
│   ├── mechanics/                # Documentación de mecánicas del juego
│   ├── conquest/                 # Conquista (gamificación)
│   ├── exploracion-infinita/     # Exploración infinita (gamificación)
│   ├── resources/                # Recursos del juego
│   ├── security/                 # Configuración de seguridad
│   ├── settings/                 # Configuración del usuario
│   ├── architecture/             # Página de arquitectura
│   └── soon/                     # Página "próximamente"
│
├── components/                   # Componentes reutilizables
│   ├── auth/                     # LoginForm, RegisterForm, ValidateAccountForm, AuthLoader
│   ├── blockchain/               # NextBlockCountdown
│   ├── economy/                  # BuySellForms, MarketTable
│   ├── laboratorio/              # 10 componentes de minería/laboratorio
│   ├── layout/                   # Navbar, Background, Footer, etc.
│   ├── market/                   # CryptoChart, CryptoDetailView, TransactionForm, etc.
│   ├── mechanics/                # Animaciones y layouts de mecánicas
│   ├── portfolio/                # WalletManager, AssetList, PortfolioChart, etc.
│   ├── rewards/                  # RewardsModal
│   ├── sections/                 # HeroSection, HistorySection, MechanicsSection, etc.
│   └── ui/                       # Button, Card, Modal, ToastStack, TechFrame, etc.
│
├── lib/                          # Lógica de negocio y configuración
│   ├── api.ts                    # Cliente Axios centralizado
│   ├── store.ts                  # Configuración del Redux Store
│   ├── hooks.ts                  # Hooks tipados (useAppDispatch, useAppSelector)
│   ├── theme.ts                  # Tema MUI personalizado
│   ├── constants/
│   │   ├── variables.ts          # Variables de entorno tipadas
│   │   └── images.ts             # Constantes de imágenes
│   ├── data/                     # Datos estáticos (mechanics, news, history, etc.)
│   ├── features/
│   │   ├── auth/                 # Autenticación (actions, api, reducer, types)
│   │   ├── blockchain/           # Redes y recompensas (actions, api, reducer, types)
│   │   ├── market/               # Mercado de criptos (actions, api, reducer, types)
│   │   ├── transactions/         # Transacciones (actions, api, reducer, types)
│   │   ├── economySlice.ts       # Economía (compra/venta de activos)
│   │   ├── gameSlice.ts          # Estado del juego (recursos, planetas)
│   │   └── uiSlice.ts            # UI (modales, notificaciones, sección activa)
│   └── types/
│       ├── blockchain.ts         # Interfaces de blockchain
│       ├── crypto.ts             # Interfaces de criptomonedas
│       └── portfolio.ts          # Interfaces de portafolio
```


### 4.2 Patrón Arquitectónico

```
┌─────────────────────────────────────────────────────┐
│                    App Router (Next.js)              │
│  ┌───────────┐  ┌───────────┐  ┌───────────────┐   │
│  │  Pages     │  │ Components│  │  Layout       │   │
│  │  (app/)    │  │           │  │  (Navbar,     │   │
│  │            │──│           │──│   AuthLoader,  │   │
│  │            │  │           │  │   Modal, Toast)│   │
│  └─────┬─────┘  └─────┬─────┘  └───────────────┘   │
│        │               │                             │
│  ┌─────▼───────────────▼─────┐                      │
│  │     Redux Store            │                      │
│  │  ┌──────┐ ┌────────┐      │                      │
│  │  │ auth │ │ market  │      │                      │
│  │  ├──────┤ ├────────┤      │                      │
│  │  │block │ │ trans.  │      │                      │
│  │  │chain │ │         │      │                      │
│  │  ├──────┤ ├────────┤      │                      │
│  │  │ ui   │ │economy │      │                      │
│  │  ├──────┤ ├────────┤      │                      │
│  │  │ game │ │        │      │                      │
│  │  └──────┘ └────────┘      │                      │
│  └─────────────┬─────────────┘                      │
│                │                                     │
│  ┌─────────────▼─────────────┐                      │
│  │   Axios Client (lib/api)  │                      │
│  │   Bearer Token Interceptor│                      │
│  └─────────────┬─────────────┘                      │
└────────────────┼────────────────────────────────────┘
                 │
                 ▼
        Backend API (sam-v1)
        http://localhost:8000
```

---

## 5. State Management (Redux Store)

### 5.1 Slices del Store

| Slice | Archivo | Responsabilidad |
|---|---|---|
| `auth` | `lib/features/auth/reducer.ts` | Autenticación, usuario, wallets |
| `blockchain` | `lib/features/blockchain/reducer.ts` | Redes, recompensas, próximo bloque |
| `market` | `lib/features/market/reducer.ts` | Criptomonedas, datos históricos |
| `transactions` | `lib/features/transactions/reducer.ts` | Historial de transacciones por store |
| `economy` | `lib/features/economySlice.ts` | Activos, compra/venta |
| `game` | `lib/features/gameSlice.ts` | Recursos, planetas, recolección |
| `ui` | `lib/features/uiSlice.ts` | Modales, notificaciones, sección activa |

### 5.2 Patrones de Estado

- **Cache con TTL**: Las acciones async (`fetchCryptos`, `fetchTransactions`, `refreshUserInfo`) implementan `condition` para evitar peticiones duplicadas con un TTL de 4 minutos.
- **Sanitización DevTools**: Los datos sensibles (token, transacciones largas) se ocultan en Redux DevTools.
- **Actualizaciones optimistas**: El balance y los assets del wallet se actualizan localmente antes de confirmar con el servidor.

---

## 6. API Endpoints

Base URL: `${NEXT_PUBLIC_API_URL}/sam-v1`

### 6.1 Autenticación (`/auth`)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/auth/login` | Login con email/password | No |
| POST | `/auth` | Registro de usuario | No |
| PUT | `/auth/confirm-account` | Verificar cuenta con código | No |
| GET | `/auth/profile` | Obtener perfil del usuario | Sí |

### 6.2 Usuarios (`/users`)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/users/user-info` | Información del usuario actual | Sí |
| PUT | `/users/{userId}/add-wallet` | Agregar wallet guardada | Sí |
| PUT | `/users/{userId}/remove-wallet` | Eliminar wallet guardada | Sí |

### 6.3 Blockchain (`/blockchain`)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/blockchain/network` | Listar redes blockchain | Sí |
| GET | `/blockchain/network/{networkId}/next-time` | Tiempo del próximo bloque | Sí |
| GET | `/blockchain/wallets/{walletId}` | Detalle de wallet | Sí |
| GET | `/blockchain/crypto` | Listar todas las criptos | Sí |
| GET | `/blockchain/crypto/{networkId}?page=&limit=&lastCheck=` | Criptos por red (paginado) | Sí |
| GET | `/blockchain/analytics/{cryptoId}?range=` | Historial de precios | Sí |
| GET | `/blockchain/transactions/{storeId}?page=&limit=&walletId=&lastCheck=` | Transacciones (paginado) | Sí |
| GET | `/blockchain/rewards` | Listar recompensas | Sí |
| PUT | `/blockchain/rewards/claim-reward/{id}` | Reclamar recompensa | Sí |

### 6.4 Trading (`/blockchain/trades`)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/blockchain/trades/start-buy-transaction` | Iniciar compra | Sí |
| POST | `/blockchain/trades/start-sell-transaction` | Iniciar venta | Sí |

### 6.5 Autenticación HTTP

Todas las peticiones autenticadas incluyen el header:
```
Authorization: Bearer <token>
```
El token se inyecta automáticamente via interceptor de Axios (`lib/api.ts`).

---

## 7. Modelos de Datos

### 7.1 User
```typescript
interface User {
  id: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
  birthday: string;
  confirmedAccount: boolean;
  isBanned: boolean;
  transactions: unknown[];
  idLabs?: string[];
  wallets: Wallet[];          // Wallets del sistema
  walletsSaved: Wallet[];     // Wallets guardadas por el usuario
  rewards: Reward[];
  balance: number;            // Saldo en créditos
  referralCode: string;
  token: string;              // JWT
}
```

### 7.2 Wallet
```typescript
interface WalletInterface {
  id: string;
  ownerID?: string;
  isContract?: boolean;
  store: CryptoHoldings[];    // Activos en la wallet
  createdAt?: string;
}

interface CryptoHoldings {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
}
```

### 7.3 Cryptocurrency
```typescript
interface Cryptocurrency {
  id: string;
  identification: { name, symbol, image128?, image256? };
  financial: {
    totalSupply, circulatingSupply, maxSupply, marketCap,
    limitMarketCap, price, volume24h?, change24h?,
    allTimeHigh, allTimeLow, analyticsID, decimals?,
    contractAddress?, tokenType?
  };
  network: { id, name };
  additionalInfo?: { pColor, sColor, description[], dateCreated, developers[] };
  isActive: boolean;
}
```

### 7.4 BlockchainInterface (Red)
```typescript
interface BlockchainInterface {
  id: string;
  identification: { name, symbol, image? };
  additionalInfo: { description[], color, dateCreated, developers[] };
  blockchainProps: {
    miningProps?, initialNodeCount, blockInterval,
    difficulty, fees?, feeBase, circulatingSupply,
    totalSupply, maxSupply, marketCap, status?,
    operationStatus?, energy?, maxEnergy?
  };
  cryptoGenesis: { id, name };
  tokensSupported?: { total, tokens[] };
  storeTransactions: { transactionStoreID };
  poolNetwork?: BlockchainPoolNetwork[];
  isActive: boolean;
}
```

### 7.5 Transaction
```typescript
interface TransactionsInterface {
  id: string;
  transactionDocumentID?: string;
  financialInfo: {
    cryptoID, crypto, symbol, amount, quantity, fee, price
  };
  addresses: { recipientWalletAddress, senderWalletAddress };
  additionalInfo: { description? };
  transactionType: 'BUY' | 'SELL' | 'TRANSFER' | 'CONVERT' | 'MINE' | 'REWARD' | 'STAKING';
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  dateCreated: string;
  duration: string;
}
```

### 7.6 Reward
```typescript
interface Reward {
  id: string;
  name: string;
  description: string;
  amount: number;
  interval: number;           // Minutos entre claims
  rewardType: 'CREDIT';
  isClaimed?: boolean;
  nextClaimTime?: number;     // Timestamp del próximo claim
}
```

### 7.7 Game Resources
```typescript
interface Resource {
  id: string;
  name: string;
  type: 'Mineral' | 'Energy' | 'Biological' | 'Technological' | 'Construction' | 'Special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
}
```


---

## 8. Lógica de Negocio

### 8.1 Flujo de Autenticación

```
1. Registro → POST /auth (name, lastName, username, email, password, birthday, referralCode?)
2. Verificación → PUT /auth/confirm-account (code)
3. Login → POST /auth/login (email, password)
   → Almacena token en localStorage
   → Almacena credenciales codificadas en base64 en localStorage ('_c')
4. Auto-login → Al cargar la app, checkAuth() decodifica '_c' y re-autentica
5. Logout → Limpia token, '_c', userInfo y walletsInfo del state
```

### 8.2 Flujo de Trading (Compra/Venta)

```
1. Usuario navega a /market → fetchCryptos(networkId)
2. Selecciona cripto → navega a /market/[id]
3. Visualiza historial → fetchCryptoHistory(cryptoId, range)
4. Inicia compra → POST /blockchain/trades/start-buy-transaction { networkId, amount }
5. Inicia venta → POST /blockchain/trades/start-sell-transaction { networkId, amount }
6. Actualización optimista del balance y assets en el store
7. Refresh de perfil para sincronizar con backend
```

### 8.3 Sistema de Recompensas

```
1. fetchRewards() → GET /blockchain/rewards
2. Cada recompensa tiene un intervalo (minutos) entre claims
3. claimReward(id, userId) → PUT /blockchain/rewards/claim-reward/{id}
4. Si rewardType === 'CREDIT' → actualización optimista del balance
5. Si otro tipo → refresh completo del perfil
6. Se calcula nextClaimTime = Date.now() + (interval * 60 * 1000)
```

### 8.4 Gestión de Wallets

```
1. fetchWalletDetails(walletId) → GET /blockchain/wallets/{walletId}
   → Retorna store (holdings de criptos)
2. addWallet(userId, label, walletAddress) → PUT /users/{userId}/add-wallet
3. removeWallet(userId, walletAddress) → PUT /users/{userId}/remove-wallet
4. El usuario tiene wallets del sistema y walletsSaved (guardadas manualmente)
```

### 8.5 Sistema de Caché

Todas las acciones async principales implementan deduplicación:
- Si ya hay una petición en curso (`isLoading`), se cancela la nueva
- Si la última petición fue hace menos de 4 minutos con los mismos argumentos, se cancela
- `lastCheck` se envía como query param para obtener solo datos actualizados desde la última consulta

### 8.6 Blockchain Simulada

- Múltiples redes blockchain con propiedades configurables (dificultad, fees, supply, etc.)
- Cada red tiene un `blockInterval` y se puede consultar el tiempo del próximo bloque
- Las redes tienen estados: Active, Inactive, Maintenance
- Niveles de carga: Low, Medium, High, Congested
- Soporte para pool networks y colas de pool

---

## 9. Sistema de UI

### 9.1 Tema (Dark Mode)

- Fondo: `#0a0a0a`
- Primario: `#ffffff` (blanco con glow)
- Secundario: `#00efcb` (cyan/turquesa neon)
- Tipografía: Roboto (300, 400, 500, 700)
- Efectos: text-shadow neon en headings, backdrop-filter blur en cards
- Bordes: `rgba(255, 255, 255, 0.1)` sutiles

### 9.2 Sistema de Notificaciones

```typescript
type NotificationType = 'success' | 'error' | 'info' | 'warning';
// Se gestionan via addNotification/removeNotification en uiSlice
// Renderizadas por ToastStack component
// Duración por defecto: 5000ms
```

### 9.3 Sistema de Modales

```typescript
// openModal(contentKey) → activa modal con contenido dinámico
// closeModal() → cierra modal
// Renderizado por Modal component en layout raíz
```

---

## 10. Rutas de la Aplicación

| Ruta | Descripción | Autenticación |
|---|---|---|
| `/` | Landing page (Hero, Historia, Mecánicas) | No |
| `/auth/logging-in` | Animación post-login (redirige a / en 5s) | No |
| `/auth/logging-out` | Animación post-logout | No |
| `/auth/verify` | Registro + verificación de cuenta | No |
| `/market` | Listado de criptomonedas del mercado | Sí |
| `/market/[id]` | Detalle de criptomoneda | Sí |
| `/market/trade` | Formulario de compra/venta | Sí |
| `/portfolio` | Portfolio del usuario (wallets, activos) | Sí |
| `/network` | Listado de redes blockchain | Sí |
| `/network/[id]` | Detalle de red blockchain | Sí |
| `/network/[id]/connecting` | Conexión a red | Sí |
| `/transactions` | Historial de transacciones | Sí |
| `/rewards` | Sistema de recompensas | Sí |
| `/laboratorio` | Laboratorio de minería | Sí |
| `/news` | Listado de noticias | No |
| `/news/[slug]` | Detalle de noticia | No |
| `/mechanics/[slug]` | Documentación de mecánicas | No |
| `/conquest` | Modo conquista | Sí |
| `/exploracion-infinita` | Exploración infinita | Sí |
| `/resources` | Recursos del juego | No |
| `/security` | Configuración de seguridad | Sí |
| `/settings` | Configuración del usuario | Sí |
| `/architecture` | Página de arquitectura | No |
| `/soon` | Página "próximamente" | No |

---

## 11. Configuración TypeScript

```json
{
  "target": "ES2017",
  "strict": true,
  "module": "esnext",
  "moduleResolution": "bundler",
  "jsx": "react-jsx",
  "paths": { "@/*": ["./*"] }
}
```

Path alias `@/` apunta a la raíz del proyecto.

---

## 12. Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # ESLint
```

---

## 13. Componentes Clave

| Componente | Ubicación | Función |
|---|---|---|
| `AuthLoader` | `components/auth/` | Verifica sesión al cargar la app (checkAuth) |
| `Navbar` | `components/layout/` | Navegación principal |
| `Modal` | `components/ui/` | Modal global controlado por Redux |
| `ToastStack` | `components/ui/` | Stack de notificaciones toast |
| `TechFrame` | `components/ui/` | Frame decorativo estilo tech/sci-fi |
| `CryptoChart` | `components/market/` | Gráfico de precios con Chart.js |
| `MarketLineChart` | `components/market/` | Gráfico de línea del mercado |
| `WalletManager` | `components/portfolio/` | Gestión de wallets del usuario |
| `PortfolioChart` | `components/portfolio/` | Gráfico de distribución de activos |
| `BuySellForms` | `components/economy/` | Formularios de compra/venta |
| `LaboratorioView` | `components/laboratorio/` | Vista principal del laboratorio de minería |
| `NextBlockCountdown` | `components/blockchain/` | Countdown al próximo bloque |
| `RewardsModal` | `components/rewards/` | Modal de recompensas disponibles |

---

## 14. Notas de Seguridad

- **Almacenamiento de credenciales**: Las credenciales se almacenan en localStorage codificadas en base64 (`_c`). Esto NO es encriptación y es vulnerable a XSS.
- **Token JWT**: Se almacena en localStorage y se inyecta via interceptor de Axios.
- **Redux DevTools**: Los datos sensibles (token, transacciones largas) se sanitizan para no exponerlos en las herramientas de desarrollo.
- **MetaMask**: Soporte para conexión de wallet externa via `window.ethereum.request`.
