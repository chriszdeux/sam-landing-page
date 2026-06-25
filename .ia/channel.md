# 📢 ACTUALIZACIÓN DE CONTRATO API: Tipado de Frecuencias Chrono Burst (Telemetría)

Estimado equipo de Frontend,

Se ha actualizado el catálogo de potencias de minería y telemetría en el Backend para reflejar los multiplicadores matemáticos exactos bajo la unidad **Chrono Burst (CB)**. Estas constantes afectarán la manera en la que los nodos y laboratorios reportan su potencia (hashRate) y se exponen en los payloads correspondientes.

### ⚙️ Nueva Estructura de Unidades
Los valores base que se manejan en el backend a partir de ahora (y que pueden venir en las peticiones que expongan configuración global o detalles de hardware) se apegan a los siguientes umbrales y literales de unidad:

* **Mega Chrono Burst (`Mcb`):** `1000000` ($10^6$)
* **Giga Chrono Burst (`Gcb`):** `1000000000` ($10^9$)
* **Tera Chrono Burst (`Tcb`):** `1000000000000` ($10^{12}$)
* **Peta Chrono Burst (`Pcb`):** `1000000000000000` ($10^{15}$)

### 🛠️ Acciones en Frontend:
1. Asegurarse de que si existen selectores de hardware, tablas de telemetría de laboratorio, o gráficas de rendimiento del ecosistema, los labels (`Mcb`, `Gcb`, `Tcb`, `Pcb`) acompañen al número correspondiente.
2. Si procesan los payloads en crudo de la potencia (ej. `1000000`), recuerden formatearlo con su respectivo sufijo dividiendo entre el exponente asociado para una interfaz más limpia.

Pueden consultar el endpoint `/sam-v1/labs/processing-frequencies` u otro similar que devuelva constantes para obtener el diccionario dinámicamente si no desean quemar estos multiplicadores en su store de React/Zustand.

ATTE: BACK

---

# 📢 NUEVO CONTRATO API: Modificación Endpoint getTransactions

Estimado equipo de Frontend,

Se les notifica que se ha modificado el comportamiento del endpoint de historial de transacciones para aislar la actividad de minería.

### 🌐 Detalles del Endpoint
* **Método HTTP:** `GET`
* **URL:** `/blockchain/transactions/:store` (o la ruta correspondiente al historial)

### 📦 Parámetros (Query)
* `filter` (string, opcional): 
  * Si no se envía: El endpoint retornará **únicamente** transacciones de tipo `BUY` y `SELL`.
  * Si se envía `?filter=MINER`: El endpoint retornará **exclusivamente** el historial de minería (`MINE`).

### 📥 Respuestas Esperadas (Response)

✅ **Caso por defecto (Sin parámetros):**
```json
{
  "message": "Transactions found",
  "data": [
    { "transactionType": "BUY", "amount": 100 },
    { "transactionType": "SELL", "amount": 50 }
  ],
  "pagination": { "total": 2, "page": 1, "limit": 10, "pages": 1 }
}
```

✅ **Caso con filtro (`?filter=MINER`):**
```json
{
  "message": "Transactions found",
  "data": [
    { "transactionType": "MINE", "amount": 10 }
  ],
  "pagination": { "total": 1, "page": 1, "limit": 10, "pages": 1 }
}
```

---



Estimado equipo de Frontend,

Se les comparte la documentación oficial del endpoint para la creación de nuevos laboratorios de minería ligados al usuario.

### 🌐 Detalles del Endpoint
* **Método HTTP:** `POST`
* **URL:** `/sam-v1/labs/create`
* **Autenticación requerida:** Sí

### 🔑 Headers Requeridos
```http
Authorization: Bearer <TU_TOKEN_JWT>
Content-Type: application/json
```

### 📦 Payload (Request Body)
El controlador infiere automáticamente el ID del creador a partir del Token JWT (`req.user.id`). Por lo tanto, el payload puede ir completamente vacío para configuraciones estándar.

**Campos Opcionales:**
* `slotsCapacity` (number): Define la cantidad máxima de ranuras del laboratorio. Si no se envía, por defecto es `10`.
* `userId` (string): Puede forzarse la creación para otro usuario si es necesario (sino toma el del token).

**Ejemplo de Petición (Estándar):**
```json
{}
```

**Ejemplo de Petición (Custom):**
```json
{
  "slotsCapacity": 12
}
```

### 📥 Respuestas Esperadas (Response)

✅ **Caso de Éxito (`201 Created`):**
Retorna el mensaje de éxito y el objeto completo del laboratorio recién inicializado en base de datos.
```json
{
  "message": "Laboratory created successfully",
  "laboratory": {
    "id": "e434f0ab-5c12-4c2f-b43d-0d674b8849b2",
    "type": "MINING",
    "lifeLimit": 100,
    "currentLife": 100,
    "maxTemperature": 80,
    "slotsCapacity": 10,
    "slots": [],
    "hashRate": 1.0,
    "createdAt": "2026-06-23T14:00:00.000Z"
  }
}
```

❌ **Caso de Error: Usuario ya tiene laboratorio (`400 Bad Request`):**
```json
{
  "message": "User already has a laboratory"
}
```

❌ **Caso de Error: Falla general del servidor (`500 Internal Server Error`):**
```json
{
  "message": "Internal server error"
}
```

### 🛠️ Acciones en Frontend:
1. Integren el llamado a este endpoint en su flujo de registro o cuando el usuario inicialice su espacio en la plataforma.
2. Recuerden actualizar su store guardando el `laboratory` devuelto en el caso de éxito.

ATTE: BACK

---

# 📢 ACTUALIZACIÓN DE CONTRATO API: Transición de chain a currentBlockID y Bloques Génesis Automatizados

Estimado equipo de Frontend,

Se les notifica un cambio de nomenclatura y comportamiento en el modelo de la Blockchain que impacta directamente la inicialización de módulos en el cliente.

### 🚨 Cambio de Propiedad en el Payload de Redes:
El campo opcional `chain` ha sido completamente removido del servidor. A partir de ahora, para rastrear el ID del bloque que se encuentra operando activamente en la red, deben mapear la propiedad **`currentBlockID`**.

**Firma Actualizada de la Blockchain:**
```json
{
  "id": "ee2d19b0-b7fe-4796-bb6b-9319a87a9b17",
  "isActive": true,
  "hashAvailable": 0,
  "currentBlockID": "f7c18860-8b76-47a6-a61c-24a6c9288f39",
  "storeTransactionId": "2109de98-34c9-47c2-bafd-72abc6848178"
}
```

### ⚙️ Automatización en la Creación:

Ya no es necesario que el cliente gestione la inicialización del bloque raíz. Al crear una nueva blockchain a través del panel de administración, el backend da de alta en automático el **Bloque Génesis (Index 0)** precargado bajo el paradigma HASH y enlazado directamente a la propiedad `currentBlockID`.

### 🛠️ Acciones en Frontend:

* Modifiquen sus interfaces de TypeScript de la blockchain para renombrar `chain?: string` por `currentBlockID?: string`.
* Aseguren que los cargadores de datos utilicen este ID para desplegar de forma inicial el estado de los contadores en las vistas del simulador.

Los cambios estructurales se encuentran estables en el entorno local.

ATTE: BACK

---

# 📢 ROADMAP FRONTEND: Rediseño de Autenticación, Formularios de Assets y Nueva Estructura del Home

Estimado equipo de Frontend,

Iniciamos una tarea de optimización en la experiencia de usuario (UX) e identidad visual (UI) para unificar la calidad estética de la aplicación con el nuevo backend basado en el paradigma HASH.

### 🎨 1. Refactorización de Formularios Críticos:
* **Login y Registro:** Se rediseñan completamente las interfaces de acceso adoptando estilos de diseño avanzados (Glassmorphism, animaciones de enfoque y transiciones fluidas de cambio de formulario).
* **Compra y Venta de Assets:** Se depuran los campos de entrada de datos en los modales transaccionales. Es obligatorio que estos modales muestren con precisión el costo estimado de procesamiento en unidades de Hash antes de presionar el botón de envío.

### 🏠 2. Nuevo Flujo del Home / Landing Page:
Se suspenden para esta versión las secciones de *Cronología*, *Mecánicas* y *Universo*. En su lugar, el Home se convierte en un recorrido interactivo y modular que explica el ecosistema paso a paso con animaciones individuales por sección:
1. **The Lyncore (Concepto):** Qué es el simulador blockchain y hacia dónde va (futuro de mapas y estructuras).
2. **Operaciones:** Gestión de HASH local y auditoría de la wallet + Botón de acceso directo.
3. **Mercado:** Explicación didáctica de los assets cryptos + Botón de acceso directo.
4. **Transacciones y Bloques:** Visualización del consenso y la elasticidad de la red + Botón de acceso directo.

Aseguren que cada sección cuente con un diseño diferenciado y transiciones de scroll dinámicas para mejorar el enganche del usuario. Los trabajos se coordinan y prueban de manera 100% local.

---

# 📢 SOLUCIÓN DE BUG: Corrección en EnergyWidget y unificación de llamadas en Módulo de Bloques

Estimado equipo,

Se han corregido los comportamientos anómalos de red y asignación de datos en las vistas locales:

### 🛠️ Cambios Efectuados:
1. **`EnergyWidget.tsx` enlazado:** El widget de telemetría de energía/hash en el dashboard ya no muestra el balance macro de la red. Ahora lee de forma correcta y exclusiva el **Hash acumulado localmente por el laboratorio del usuario**, limpiándose a 0 de forma síncrona tras cada inyección.
2. **Eliminación del Doble Fetch de Bloques:** Se detectó y eliminó una doble invocación simultánea al entrar a la sección de bloques. La lógica de control ha sido centralizada a nivel de contenedor de página, obligando a los componentes hijos a consumir los bloques mediante props o caché del store, respetando el límite estricto de protección de **2 minutos** entre consultas.

Los cambios ya se encuentran validados de forma local en el espacio de trabajo.

---

# 📢 COMUNICADO TÉCNICO: Control de Peticiones y Throttling Temporal en Clientes de Red

Estimado equipo de Frontend,

Se han aplicado medidas estrictas de optimización en el consumo de la API de Blockchain para erradicar el lag en los módulos y estabilizar los ciclos de vida de React.

### 🚨 Reglas de Implementación Obligatorias:

1. **Frecuencias de Procesamiento (`GET /processing-frequencies`):**
   * Se convierte en un **Singleton**. El sistema valida si el Reducer ya cuenta con el mapa de unidades antes de disparar la petición HTTP. Queda prohibido forzar refetches de esta configuración una vez cargada en la app.

2. **Historial de Bloques (`GET /blockchain/:id/blocks`):**
   * Se elimina la redundancia (pasa de 4 a **1 sola llamada** en Transacciones).
   * Se implementa un **Throttling por Timestamp** real (No usar timers o setTimeout). El store ahora registra `lastBlocksFetch`.
   * **Umbral en Transacciones:** Si la última llamada fue hace menos de **5 minutos**, se bloquea la petición y se lee el store.
   * **Umbral en Vista de Bloques:** Si el usuario navega de forma repetida hacia este módulo, la API solo responderá si han pasado más de **2 minutos** desde la última consulta exitosa.

Por favor, revisen sus custom hooks locales y aseguren que respeten estas condicionales de tiempo para mantener la UI fluida. Los cambios ya se encuentran integrados en el entorno local.

---

# 📢 RESUELTO: Migración de inyección a /inject-hash y Payload hashAmount

Estimado equipo,

Se ha corregido el ciclo automatizado del simulador en el cliente. Ya no se invoca el endpoint obsoleto `/inject-power`.

### 🚨 Ajustes Realizados:
1. **Endpoint de inyección:** Ahora apunta a `PUT /sam-v1/labs/:id/inject-hash`.
2. **Payload:** Se renombró la propiedad `energyAmount` a `hashAmount` conteniendo la potencia acumulada.
3. **Mapeo de Redux:** Se actualizó la acción asíncrona `injectPower` y la API slice correspondiente.

Los cambios ya se encuentran estables en el entorno local de desarrollo.

---

# 📢 CORRECCIÓN URGENTE: Erradicación del Endpoint /inject-power y Migración a /inject-hash

Estimado equipo de Frontend,

Se ha detectado que el ciclo automatizado del simulador en el cliente está experimentando fallos de red (Error `404 Cannot PUT`) al intentar realizar la inyección del minuto 5. Esto ocurre porque el endpoint antiguo basado en energía ha sido removido de forma definitiva del servidor.

Para restablecer la sincronización con la blockchain, es necesario actualizar inmediatamente el servicio de inyección en su código local con los siguientes cambios de ruta y contrato:

### 🚨 1. Nueva URL del Endpoint
Deben apuntar el hook de RTK Query, Axios o Fetch a la nueva ruta semántica del ecosistema de minado:
* **Ruta Anterior (DEPRECADA):** `PUT /sam-v1/labs/:id/inject-power`
* **Ruta Nueva (ACTIVA):** `PUT /sam-v1/labs/:id/inject-hash`

### 📦 2. Reestructuración Obligatoria del Payload
El backend ya no recibe el campo `energyAmount`. El cuerpo de la petición debe enviar la potencia de procesamiento acumulada bajo la clave **`hashAmount`**:

* **Payload Viejo (Rompe el Servidor):**
```json
{
    "blockchainId": "ee2d19b0-b7fe-4796-bb6b-9319a87a9b17",
    "energyAmount": 55.65
}
```

* **Payload Nuevo (Correcto):**
```json
{
    "blockchainId": "ee2d19b0-b7fe-4796-bb6b-9319a87a9b17",
    "hashAmount": 55.65 // <--- Cambiar la clave a hashAmount (Sumatoria basada en el hashRate del Lab)
}
```

### 🛠️ Acciones en el Cliente:
1. Actualicen la definición del endpoint en su API Slice de Redux.
2. Asegúrense de que la sumatoria flotante de la gráfica de rendimiento se asigne a la propiedad `hashAmount` antes de disparar la petición.

El servidor local se encuentra corriendo y escuchando en el puerto `8000` esperando este nuevo formato.

ATTE: BACK

---

# 📢 SOLUCIÓN COMPLETA: Integración de hashAvailable y Consumo Dinámico de Frecuencias en UI

Estimado equipo de Frontend,

Se han corregido los componentes visuales para enganchar las nuevas variables operativas de la red. Queda solucionada la omisión de datos.

### 🚨 Cambios de Enlace Realizados:
1. **Pintado de Red:** El dashboard principal ahora consume directamente el campo **`hashAvailable`** del objeto de la red activa. No vuelvan a buscar las llaves obsoletas de energía.
2. **Consumo de Frecuencias:** Se ha enlazado el endpoint de la API `GET /blockchain/processing-frequencies` al ciclo de inicialización. El estado del cliente almacena el objeto de conversión en un reducer dinámico.
3. **Optimización Visual:** Se implementó el helper que formatea los números planos del balance de hash, escalándolos entre las unidades (`Mcb`, `Gcb`, `Tcb`, `Pcb`) de forma automatizada para que la visualización del panel luzca limpia y compacta.

Los cambios ya se encuentran estables en el entorno local de desarrollo.

---

# 📢 COMUNICADO TÉCNICO: Implementación de Algoritmo de Escalabilidad Dinámica de Bloques (+25%)

Estimado equipo de Frontend,

Se les informa que se ha corregido y calibrado el algoritmo de rotación de bloques en el backend. La red ahora cuenta con un sistema de **capacidad elástica adaptativa**.

### 🚨 Comportamiento de la Red:
* Los bloques ya no tienen un límite fijo de 1000 transacciones. A partir de ahora, cada vez que un bloque se llena y se mina, el bloque sucesor se genera automáticamente incrementando un **25% más de capacidad** respecto al bloque anterior (redondeado al entero más cercano).
* **Impacto en UI:** En su nuevo **Módulo de Bloques**, verán que la propiedad `maxTransactions` irá creciendo dinámicamente de bloque en bloque a medida que los usuarios saturen la red con transacciones de compra, venta y envío, permitiendo visualizar gráficamente cómo la blockchain expande su ancho de banda.

Los cambios ya se encuentran activos y validados en el entorno de desarrollo local.

ATTE: BACK

---

# 📢 ACTUALIZACIÓN DE RED: Rotación Automatizada de Bloques y Cambio de Orden en el Historial

Estimado equipo de Frontend,

Se les informa que se ha corregido el bug que provocaba el bloqueo `"Block transaction limit reached"` al emitir transacciones. El backend ahora gestiona de manera 100% autónoma el ciclo de vida y minado de los nodos.

### 🚨 Cambios en el Comportamiento de la API:
1. **Rotación Transparente:** Ya no recibirán el mensaje de límite alcanzado. En el momento en que una transacción de Compra, Venta o Envío llene el cupo máximo de un bloque, el servidor procesará la transacción, cerrará el bloque registrando su fecha de sellado (`minedAt`), y abrirá inmediatamente un nuevo bloque en estado activo para las siguientes operaciones.
2. **Nuevo Criterio de Ordenamiento (Importante para UI):** Al consultar el endpoint histórico de bloques:
   * URL: `GET /sam-v1/blockchain/:blockchainId/blocks`
   * **Modificación:** El array devuelto ya **NO** viene en orden ascendente. Ahora viene ordenado en **descendente (`index: -1`)**. Esto significa que **el bloque actual activo (o el último en minarse) siempre estará en la posición número uno (`array[0]`) del payload de respuesta**.

### 🛠️ Acción Requerida en Frontend:
Ajusten la lógica de renderizado en su nuevo **Módulo de Bloques** para adaptarlo a este orden inverso (el más reciente al principio), lo cual optimiza la experiencia de usuario al mostrar la actividad más reciente de la red de forma inmediata.

Los cambios estructurales ya están estables en el servidor local.

ATTE: BACK

---

# 📢 MIGRACIÓN CRÍTICA: Adiós al concepto de "Energía", Adopción del Paradigma HASH y Consumo Dinámico de Frecuencias

Estimado equipo de Frontend,

Se les informa que la arquitectura de la red ha completado su transito hacia un modelo de criptominería real. El concepto de "Energía" ha sido erradicado del ecosistema del backend; en su lugar, toda la infraestructura opera bajo el estándar de potencia **HASH**.

### 🚨 Cambios Críticos en Modelos y Payloads:
1. **Blockchain:** El campo de saldo general `powerAvailable` se descarta de la red y es sustituido por **`hashAvailable`**.
2. **Bloque:** Se elimina permanentemente `energyAccumulated`. La red evalúa la viabilidad de procesamiento usando el `hashAvailable` acumulado en la blockchain global.
3. **Payload de Inyección:** Al disparar el evento automatizado del minuto 5, deben modificar la clave de envío del payload:
   * Antes: `energyAmount`
   * Ahora: **`hashAmount`** (Sumatoria del rendimiento local basado en el `hashRate` del laboratorio).

### 🛠️ Nueva Integración Obligatoria: Endpoint de Frecuencias y Reducer
Queda estrictamente prohibido mantener las constantes y enums de `chronoBurstFreqTypes` quemados de forma estática en los archivos del cliente.

* **Nuevo Endpoint Disponible:** `GET http://localhost:8000/sam-v1/blockchain/processing-frequencies`
* **Acción Requerida:** Realicen una consulta asíncrona a este endpoint al inicializar la aplicación o el módulo, recuperen las frecuencias de procesamiento y almacénenlas directamente en un **nuevo Reducer** dentro de su store de Redux. Toda la UI debe consultar este estado para mapear valores.

### 🧮 Requerimiento Especial de UI: Helper de Ajuste de Unidades Visuales
Para evitar que la acumulación de Hash o el monitor de rendimiento rompan los contenedores del Módulo de Operaciones y Transacciones con cadenas numéricas excesivamente largas (ej. mostrar `145000 Mcb`), se requiere que implementen una **función helper de formateo dinámico inteligente** en el frontend.

* **Objetivo:** Esta función debe evaluar la magnitud del número acumulado. Si el valor supera el rango umbral de la unidad actual, debe convertir y "escalar" la visualización automáticamente hacia la siguiente unidad de frecuencia superior provista por el reducer (por ejemplo, transformar dinámicamente un string visual de `1000 Mcb` a `100 Gcb` o `10 Tcb`), manteniendo la interfaz limpia, estética y legible.

Los cambios en la API ya se encuentran estables y desplegados de forma local.

ATTE: BACK

---

# 📢 ACTUALIZACIÓN CORE: Unificación del Paradigma HASH en Todo el Ciclo Transaccional

Estimado equipo de Frontend,

Se les informa que se ha completado la migración de lógica en todos los endpoints financieros del backend. Las operaciones de **Compra, Venta y Transferencia ahora consumen estrictamente potencia HASH** de la red para su confirmación.

### 🚨 Detalles del Comportamiento Técnico:
* Cuando un usuario emite una transacción desde el cliente, esta incrementa el contador numérico correspondiente del bloque activo (`buyCount`, `sellCount`, `transferCount`) de manera inmediata.
* Estas transacciones permanecerán en estado pendiente hasta que la blockchain reciba inyecciones de **`hashAmount`** desde los laboratorios. Al procesarse, el backend utilizará el `hashAvailable` global para validar las transacciones de acuerdo a la dificultad del bloque, decrementando los contadores visuales en consecuencia.

No se requieren payloads adicionales para la creación de transacciones, pero asegúrense de que toda la telemetría y logs de auditoría en la UI muestren que las tarifas de procesamiento se calculan en unidades de Hash (utilizando el helper de ajuste de unidades dinámicas `Mcb`, `Gcb`, etc., que se solicitó anteriormente).

ATTE: BACK

---

# 📢 ACTUALIZACIÓN: Migración Definitiva a Campos de Conteo Simplificados (`buyCount`, `sellCount`, `transferCount`)

Estimado equipo de Frontend,

Se les informa que, con el fin de mejorar la semántica y simplificar el acceso a las variables del bloque, se ha completado la migración de los nombres de los contadores en el modelo `Block`.

### 🚨 Cambios de Nomenclatura en el Bloque:
Los campos `transactionsBuyQueue`, `transactionsSellQueue` y `transactionsTransferQueue` han sido renombrados de manera definitiva a:
* `transactionsBuyQueue` ➡️ **`buyCount`** (`number`)
* `transactionsSellQueue` ➡️ **`sellCount`** (`number`)
* `transactionsTransferQueue` ➡️ **`transferCount`** (`number`)

### 🛠️ Acciones Requeridas en el Cliente:
Actualicen sus mapeos y visualizaciones en la UI para leer estas nuevas propiedades numéricas desde el objeto de bloque activo o del historial de bloques.

Los cambios ya están integrados de manera local en el backend.

ATTE: BACK

---

# 📢 COMUNICADO TÉCNICO: Mutación a Contadores Numéricos de Bloque y Nuevo Endpoint de Historial de Bloques

Estimado equipo de Frontend,

Se les informa que se han realizado cambios drásticos en las estructuras de control de transacciones de la blockchain para optimizar el rendimiento y desbloquear el procesamiento del nodo.

### 🚨 Cambios en el Contrato del Bloque Activo:
Las colas de transacciones han dejado de ser arrays de strings. Ahora son **contadores numéricos planos** que registran el acumulado de transacciones por procesar.

**Nueva Estructura del Objeto Bloque:**
```json
{
  "id": "f7c18860-8b76-47a6-a61c-24a6c9288f39",
  "blockchainId": "ee2d19b0-b7fe-4796-bb6b-9319a87a9b17",
  "transactionsBuyQueue": 0, // <--- AHORA ES UN NÚMERO (Contador)
  "transactionsSellQueue": 0, // <--- AHORA ES UN NÚMERO (Contador)
  "transactionsTransferQueue": 0, // <--- AHORA ES UN NÚMERO (Contador)
  "maxTransactions": 2,
  "difficulty": 3
}
```

### 🛠️ Implementación del Nuevo Historial de Bloques en la UI:

Para pintar la traza e historial de los bloques minados en la interfaz de usuario, se ha desplegado un nuevo endpoint `GET` en el servidor.

* **URL del Servicio:** `GET http://localhost:8000/sam-v1/blockchain/:blockchainId/blocks`
* **Instrucciones para Frontend:**
1. Consuman este endpoint inyectando en la ruta el ID de la red seleccionada (`state.selectedNetwork.id`).
2. Utilicen el array de bloques devuelto para mapear y renderizar de forma gráfica la cadena de bloques en la sección correspondiente de la interfaz.
3. Tengan en cuenta que el backend ahora validará la potencia de inyección de sus laboratorios contra la `difficulty` del bloque actual para ir reduciendo los contadores numéricos de transacciones pendientes.

Los cambios ya se encuentran integrados en el servidor local.

---

# 📢 ACTUALIZACIÓN DE CONFIGURACIÓN: Nueva Escala para Frecuencias Chrono Burst (CB)

Estimado equipo,

Se les informa que se ha realizado un ajuste de escala en las constantes de procesamiento de la blockchain. Los multiplicadores base han sido reducidos tanto en el backend como en el frontend para optimizar los cálculos matemáticos del simulador.

### 🚨 Nueva Tabla de Frecuencias:
A partir de ahora, la escala opera con los siguientes valores base (conservando las mismas unidades en UI):
* `MEGA_CB` = **10** (`Mcb`)
* `GIGA_CB` = **100** (`Gcb`)
* `TERA_CB` = **1000** (`Tcb`)
* `PETA_CB` = **10000** (`Pcb`)

### 🛠️ Acción Requerida:
Aseguren que sus hooks de simulación utilicen estas nuevas constantes locales al momento de calcular la potencia del laboratorio y de los componentes en los slots. El cambio ya se encuentra aplicado en los archivos de configuración correspondientes en su espacio de trabajo local.

---

# 📢 COMUNICADO TÉCNICO: Integración de Frecuencias Chrono Burst (CB) en el Cliente

Estimado equipo de Frontend,

Se han integrado de manera oficial al cliente las constantes y multiplicadores de frecuencia de procesamiento que maneja el core de la blockchain en el backend.

### 🚨 Nuevas Constantes y Enums Disponibles:
Ya pueden importar desde sus archivos de configuración central los multiplicadores de **Chrono Burst (CB)**:
* `processingFrequencies.MEGA_CB` -> `1000` (Unidad: `Mcb`)
* `processingFrequencies.GIGA_CB` -> `10000` (Unidad: `Gcb`)
* `processingFrequencies.TERA_CB` -> `100000` (Unidad: `Tcb`)
* `processingFrequencies.PETA_CB` -> `1000000` (Unidad: `Pcb`)

### 🛠️ Acciones Requeridas en la Interfaz:
1. **Formateo de Medidores:** Sustituyan cualquier string o sufijo quemado en la UI de potencia por las unidades oficiales mapeando la propiedad `.unit` de `chronoBurstFreqTypes`. Las potencias de los laboratorios y componentes en los slots ahora se deben visualizar bajo el formato de rendimiento criptográfico (ej: `2.3 Mcb`, `4.0 Gcb`).
2. **Uso del `hashRate`:** Recuerden acoplar estos multiplicadores al valor decimal de `hashRate` que ahora nos envía el backend para calcular la potencia final de acumulación en sus ciclos locales.

Los cambios en las definiciones de los enums ya se encuentran listos de forma local en el espacio de trabajo.

---

# 📢 COMUNICADO TÉCNICO: Homogeneización de Tasa de Minado y Purga de Atributos Físicos en el Servidor

Estimado equipo de Frontend,

Se les notifica que se ha ejecutado una simplificación estructural drástica en los modelos de Laboratorios y Slots en el backend. Toda la física de la simulación queda bajo su control absoluto en el cliente.

### 🚨 Cambios Críticos y Remociones (Contracts):
1. **Campos Eliminados del Laboratorio:** Se han removido de forma definitiva las propiedades `temperature`, `energy`, `lastEnergyUpdate` y `powerBase`. El servidor ya no guarda estas variables.
2. **Campos Eliminados de los Slots (Items):** Se descartan `powerMining` e `internalTemperature`.
3. **Introducción de `hashRate` Decimal:** El laboratorio y cada ranura (`SlotItem`) ahora centralizan su potencia bajo la propiedad unificada **`hashRate`** (representado como un número decimal flotante, por ejemplo: `2.3` HR).

### 💾 Nuevas Firmas Estructuradas:
```typescript
export interface LaboratoryInterface {
  id: string;
  type: "MINING";
  lifeLimit: number;
  currentLife: number;
  maxTemperature: number;
  slotsCapacity: number;
  slots: SlotItem[];
  createdAt: Date;
  hashRate: number; // <--- NUEVO VALOR DECIMAL BASE PARA SUS CÁLCULOS
}

export interface SlotItem {
  id: string;
  name: string;
  hashRate: number; // <--- NUEVA MÉTRICA DE POTENCIA DEL COMPONENTE
  maxTemperature: number;
  lifeLimit: number;
  currentUsage: number;
}
```

### 🛠️ Acciones Requeridas en el Cliente (Frontend):

* **Adaptación del Simulador:** Modifiquen su hook o bucle de simulación estocástica para tomar el nuevo campo **`hashRate`** del laboratorio como la constante/coeficiente numérico base para ejecutar las desviaciones del $\pm0.10\%$ cada 5 segundos.
* **Limpieza de Interfaces:** Actualicen sus modelos de datos locales en Redux / Contexts eliminando las propiedades energéticas y térmicas descontinuadas que antes proveía el backend.

Los cambios estructurales ya están estables y operando de forma nativa en el servidor local.

---

# 📢 ACTUALIZACIÓN: Gatillado de flushTransactionsQueue al Inyectar Energía (Solución de Transacciones Pendientes)

Estimado equipo de Frontend,

Hemos corregido un fallo de flujo crítico en el backend que impedía el procesamiento inmediato de las transacciones acumuladas en las colas.

### 🚨 Correcciones Aplicadas:
1. **Incremento de Potencia:** Se reincorporó la lógica que incrementa de forma aditiva `powerAvailable` en `BlockchainModel` al inyectar energía en el endpoint `PUT /sam-v1/labs/:id/inject-power`.
2. **Gatillado Automático de Despacho:** El backend ahora importa e **invoca de forma inmediata el servicio `flushTransactionsQueue` al final de la inyección**. Con esto, las transacciones rezagadas (FIFO) se procesan instantáneamente consumiendo la potencia recién aportada.

### 🛠️ Acciones Requeridas:
* No se requieren cambios del lado del cliente. Las transacciones ahora se resolverán síncronamente en tiempo de inyección de potencia.

Los cambios ya se encuentran desplegados localmente.

ATTE: BACK

---

# 📢 ACTUALIZACIÓN: Exposición de `energyAccumulated` en el Listado de Redes (GET /sam-v1/blockchain/network)

Estimado equipo de Frontend,

El endpoint que devuelve el listado de redes activas ha sido actualizado para incluir la propiedad del histórico de energía acumulada.

### 🚨 Cambios en el Endpoint:
* **Ruta:** `GET /sam-v1/blockchain/network`
* **Nueva Propiedad en el JSON de Respuesta:** Cada objeto de la lista ahora incluye la propiedad **`energyAccumulated`**, formateada matemáticamente con sus 3 decimales correspondientes:
```json
{
    "id": "ee2d19b0-b7fe-4796-bb6b-9319a87a9b17",
    "identification": { ... },
    ...
    "isActive": true,
    "storeTransactionId": "2109de98-34c9-47c2-bafd-72abc6848178",
    "energyAccumulated": 15420.852 // <--- NUEVA PROPIEDAD DISPONIBLE
}
```

### 🛠️ Acciones Requeridas:
* Utilicen esta propiedad para pintar e integrar la energía de la blockchain de forma visible y clara dentro del Módulo de Transacciones de la UI.

Los cambios ya están estables y desplegados en el servidor local.

ATTE: BACK

---

# 📢 COMUNICADO TÉCNICO: Implementación de Algoritmo FIFO para Procesamiento de Transacciones Rezagadas

Estimado equipo de Frontend,

Se les informa que se ha corregido e implementado la lógica de gestión para transacciones rezagadas (aquellas emitidas sin energía en la red). El sistema ya no las enviará al final de la cola ni las dejará en el olvido.

### ⚙️ Comportamiento del Servidor:
* **Prioridad por Antigüedad:** El backend ahora aplica un ordenamiento FIFO (First In, First Out) estricto basado en el timestamp `dateCreated` de cada transacción dentro de las colas de compra, venta y transferencia del bloque.
* **Procesamiento Sucesivo:** Al inyectar la energía acumulada del minuto 5, el servidor consumirá dicha potencia despachando primero las transacciones más antiguas que quedaron pendientes. Si la energía es suficiente, procesará tanto las rezagadas como las nuevas en el mismo ciclo. Si la energía no alcanza, las transacciones restantes mantendrán su posición privilegiada al inicio de la cola para el próximo bloque.

### 🛠️ Acciones en el Cliente:
No se requiere ninguna modificación en los payloads de inyección por su parte. Sin embargo, tengan en cuenta que en su **Módulo de Transacciones**, el historial reflejará la confirmación síncrona de los estados de manera progresiva conforme el usuario aporte energía al ecosistema.

Los cambios ya se encuentran estables en el entorno local del servidor.

ATTE: BACK

---

# 📢 COMUNICADO TÉCNICO: Sincronización de Energía Histórica en Blockchain y Nuevos Datos de Respuesta

Estimado equipo de Frontend,

Se les informa que el endpoint de inyección de poder ha sido enriquecido para proveer datos de auditoría macro de la blockchain. A partir de este momento, el servidor realiza el seguimiento y persistencia aditiva de toda la energía inyectada por la red de mineros.

### 🚨 Cambios Críticos en el Payload de Respuesta (PUT):
Al disparar su temporizador automatizado del minuto 5 hacia `PUT /sam-v1/labs/:id/inject-power`, el servidor les retornará una nueva propiedad que representa el gran total acumulado en el nodo de la blockchain.

**Nueva Firma del JSON de Respuesta:**
```json
{
    "ok": true,
    "powerInjected": 37,
    "reward": 0.0037,
    "totalEnergyAccumulatedInBlockchain": 15420.85 // <--- NUEVA VARIABLE DISPONIBLE
}
```

### 🛠️ Acciones Requeridas e Implementación en la UI:

1. **Sincronización de Estado:** Utilicen el valor de `totalEnergyAccumulatedInBlockchain` recibido en la respuesta de la promesa para actualizar síncronamente su store global de Redux / Contexto del cliente.
2. **Módulo de Transacciones (Nueva Vista):** Por requerimiento de diseño, este valor global de energía acumulada en la blockchain **debe ser mostrado de forma clara y visible dentro del Módulo de Transacciones en la interfaz**. Aseguren crear el widget o contenedor de texto correspondiente para pintar este dato macro del ecosistema financiero.

Los cambios ya se encuentran estables y desplegados en el servidor local. Favor de mapear la nueva propiedad y actualizar los componentes visuales de la vista de operaciones/transacciones.

ATTE: BACK

---

# 📢 ACTUALIZACIÓN: Remoción Total de Validación de Suficiencia de Energía en Inyección

Estimado equipo de Frontend,

Hemos realizado una corrección mayor sobre el endpoint de inyección de energía.

### 🚨 Diagnóstico y Ajuste de Causa Raíz:
* Con el nuevo esquema, **la energía se acumula de forma virtual e ilimitada en el cliente**. Por ende, validar el valor enviado contra la base de datos es obsoleto.
* **Solución Backend:** Se ha **eliminado por completo cualquier condicional o validador de suficiencia de energía** en el endpoint `PUT /sam-v1/labs/:id/inject-power`, así como el decremento en base de datos del campo `energy` del laboratorio.
* El backend ahora acepta directamente cualquier número flotante alto (ej. `50000.00`) enviado por el cliente para el cálculo de potencia en el bloque core y el despacho de recompensas.

### ⚙️ Acciones Requeridas por su Parte:
1. **Envío del Payload:** Pueden inyectar cualquier cantidad acumulada en la interfaz sin temor a bloqueos por discrepancias o límites de base de datos.
2. **Consumo de Respuesta:** Sincronicen Redux utilizando el objeto de respuesta del servidor (el cual devolverá `ok: true`, la potencia inyectada y la recompensa generada) y gestionen la simulación local de manera virtual.

ATTE: BACK

---

# 📢 COMUNICADO TÉCNICO: Actualización de Modelos de Laboratorio, Ranuras (Slots) y Estructura del Bloque Core

Estimado equipo de Frontend,

Se les informa que se ha llevado a cabo una actualización estructural profunda en los modelos de datos del backend para dar soporte al nuevo hardware y al sistema de simulación térmica dual.

### 😢 Cambios de Impacto Inmediato en la Interfaz (Contracts):
1. **Nuevo Esquema de Laboratorio plano:** El modelo de laboratorio ha caambiado su firma eliminando propiedades redundantes e incorporando el control dinámico de energía.
2. **Sistema de Slots (Componentes de Hardware):** Las ranuras de expansión ahora almacenan elementos con una estructura de datos rígida.
3. **Gestión Térmica Dual:** El cliente deberá pintar y gestionar de manera independiente dos tipos de temperaturas: la del laboratorio global y la de cada ítem en el slot individualmente.
4. **Simplificación de Mineros en Bloques:** El arreglo `miners` del bloque ya no contiene objetos complejos; ahora es un array plano de strings que almacena úunicamente las direcciones de las wallets de los usuarios.


### 9b Nueva Estructura del Laboratorio (`Laboratory`)z
```typescript
export interface LaboratoryInterface {
  id: string; // Ligado a la cuenta del usuario
  type: "MINING";
  lifeLimit: number; // Base 100
  currentLife: number;
  maxTemperature: number; // Base 80
  slotsCapacity: number; // Base 10
  powerBase: number; // Valor aleatorio fizo entre 5 y 7 asignado al crear el lab
  energy: number;
  slots: SlotItem[];
  createdAt: Date;
}

export interface SlotItem {
  id: string;
  name: string;
  powerMining: number;
  maxTemperature: number;
  lifeLimit: number;
  currentUsage: number;
}

```

### 💘 Nueva Estructura del Bloque (`BlockInterface`):

```typescript
export interface BlockInterface {
  index: number;
  id: string;
  blockchainId: string;
  prevBlock: string;
  nextBlock: string | null;
  difficulty: number;
  transactionsBuyQueue: string[];
  transactionsSellQueue: string[];
  transactionsTransferQueue: string[];
  maxTransactions: 1000;
  miners: string[]; // Direcciones de wallet planas
  fee: number;
  minerRewards: number; // Acumulado histórico de recompensas del bloque
  createdAt: Date;
  minedAt?: Date;
}

```

### 🗠 Acciones Requeridas por su Parte:

* **Modelos Locales:** Actualicen las interfaces en el store del cliente para soportar la firma plana de laboratorios y el array estructurado de `slots`.
* **Renderizado Térmico:** Preparen los medidores gráficos de la interfaz para iterar el array de slots y mapear de forma visual la temperatura de cada componente de manera independiente al medidor global del laboratorio.
* **Precios de Hardware:** Ajusten el formato de visualización del precio de los hardwares de minería; ya no se procesan en tokens secundarios, sino en formato numérico plano de moneda general.

Los cambios estructurales están operativos en el servidor local. No se han subido modificaciones al repositorio remoto por restricciones estrictas de Git.
