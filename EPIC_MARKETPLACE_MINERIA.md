# 🛒 Historia de Usuario: Marketplace de Hardware Minero

## 1. Contexto / Objetivo

El ecosistema de minería ya despliega la información base del `LaboratoryModel` del usuario, y el Frontend tiene la grilla configurada para mostrar "Slots Vacíos". El siguiente y natural paso para el negocio es permitir al usuario **adquirir** hardware de minería (Antminers, Goldshells, etc.) e "instalarlos" en esos slots vacíos dentro del laboratorio.

Para esto necesitamos:

1. Un catálogo global o sistema de "Entidades" de tipo "Hardware Minero" con precios y especificaciones.
2. Un endpoint para que el usuario pueda "comprar" o "asignar" uno de estos equipos al arreglo de `slots` de su `LaboratoryModel`.
3. Una interfaz en el Frontend (dentro o conectada al Laboratorio o al Market general) que liste estas opciones y envíe la petición de compra.

---

## 2. 🛠️ Tareas para Backend (Antigravity)

**Prioridad:** ALTA | Bloqueante parcial para Frontend (lógica de estado).

**Requerimientos de API y Datos:**

1.  **Modelo de Entidad de Hardware:**
    - **Acción:** Revisa el endpoint existente `/entities` (si existe) y determina cómo el sistema de `sam-backend` manejará el "Catálogo" de Hardware. ¿Serán entidades estáticas pre-cargadas en BD o un JSON local por el momento?
    - **Atributos Base Requeridos:** `hw_id`, `name` (Ej. Antminer S19), `performanceValue` (Ej. 100 TH/s), `energyCost`, `price` (Costo en moneda interna para comprarlo), y datos visuales `color`/`image_url`.

2.  **Endpoint de Compra / Asignación (`POST /labs/:id/buy-machine` o similar):**
    - **Acción:** Crear y documentar el flujo transaccional. El endpoint debe recibir un `hardwareId` y el `slotIndex` (índice 0-5 basado en la capacidad) donde se insertará.
    - **Validaciones Críticas:**
      - Revisar que el usuario tenga saldo suficiente (opcional, dependiendo de si la economía interna ya opera; en su defecto, restar puntos/saldo ficticio).
      - Revisar que el `Laboratory` no exceda su `capacity`.
      - Añadir el objeto del hardware dentro de la propiedad `slots` del modelo `LaboratoryModel`.
    - **Documentación:** Registrar en `Endpoints.md`.

---

## 3. 🎨 Tareas para Frontend

**Prioridad:** MEDIA | Puede arrancar con Mockups del Market.

1.  **Catálogo Visual (Mercado de Hardware):**
    - **Acción:** Diseñar un catálogo (puede ser un drawer, un modal dentro de `/laboratorio`, o una vista en `/market`) donde se listen las máquinas mineras disponibles para compra.
    - **Aviso:** Usar datos dummy temporales mientras el Backend define la API del catálogo de entidades, _pero_ dejando los botones listos para integrar una función `handleBuyHardware`.

2.  **Integración de la Compra en la Grilla (Slots Vacíos):**
    - **Acción:** En `LaboratorioView.tsx`, al detectar un 'SLOT VACÍO', habilitar una interacción (ej. clic o hover con un botón "+" ) que lance el flujo de compra/asignación para ese slot en particular.
    - **Mutación:** Una vez hecha la llamada al POST al backend de forma exitosa, actualizar el `labData` global para que la grilla muestre instantáneamente la nueva máquina con su animación respectiva de inicialización, sin necesidad de recargar la página full (UX Premium).

---

## 4. 🎯 Criterios de Éxito

- [ ] Backend (`sam-backend`) tiene el catálogo de máquinas en un endpoint o estructura predefinida.
- [ ] Endpoint `POST /labs/:id/buy-machine` (o equivalente) existe, valida la inserción y empuja el objeto a `slots`.
- [ ] Frontend presenta al usuario el mercado para comprar la máquina.
- [ ] Frontend emite la petición y al tener éxito actualiza en tiempo real el dashboard sin fallos en el redibujado de las animaciones.

> **Mensaje de Orquestación del PM:**
> _@Antigravity_, arranca con la definición del catálogo de entidades y endpoint POST. _@Frontend_, tú puedes ir maquetando el Modal/Drawer del mercado de componentes conectándolo a los visuales de "SLOT VACÍO". ¡Sincronícense en sus respectivos inboxes!
