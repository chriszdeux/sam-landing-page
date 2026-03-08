# 🛠️ Historia de Usuario: Sistema de Mantenimiento y Reparación (Refinamiento Cron)

## 1. Contexto / Objetivo

Tras completar la **US-003**, el usuario ya puede visualizar el estado de sus máquinas instaladas en el laboratorio a través de `LaboratorioHardwareDetailDrawer`. Sin embargo, para que el gameplay sea real, la vida útil (`currentLife`) y la temperatura (`temperature`) deben ser **dinámicas** y el botón de **Reparación** debe tener una lógica transaccional sólida de descuento de tokens.

El objetivo de este sprint es que el Backend implemente la lógica de "desgaste" (emulando un Cron o ciclo de minado) y que el Frontend cierre el ciclo de interacción permitiendo al usuario restaurar la operatividad de sus equipos antes de que lleguen a 0% de eficiencia.

---

## 2. 🛠️ Tareas para Backend (Antigravity)

**Prioridad:** ALTA | Bajo directiva de **FRAGMENTACIÓN**.

**Requerimientos de Lógica:**

1.  **Lógica de Desgaste Dinámica (On-Demand):**
    - **Acción:** Dado que el deploy es en **Vercel**, queda prohibido el uso de Crons. La degradación de vida y temperatura debe ser un cálculo matemático basado en el tiempo transcurrido (`delta time`) cada vez que se consulte el laboratorio (`GET /labs/:id`).
    - **Fórmula sugerida:** `currentLife = lastLife - (hashRate * hoursSinceLastUpdate * factor)`.
    - **Persistencia:** Actualizar el `lastProcessedAt` en cada consulta.
2.  **Refactor Endpoint de Reparación (`POST /labs/:id/slot/:index/repair`):**
    - **Acción:** Validar que el usuario tenga los `priceTokens` necesarios (ej. 50 tokens por cada 10% de reparación).
    - **Resultado:** Actualizar el arreglo de `slots` en la posición específica restaurando `currentLife` a 100 y `temperature` a 30.
    - **Documentación:** Actualizar `Endpoints.md`.

---

## 3. 🎨 Tareas para Frontend

**Prioridad:** MEDIA | Bajo directiva de **FRAGMENTACIÓN**.

1.  **Interactividad en `LaboratorioHardwareDetailDrawer.tsx`:**
    - **Acción:** Implementar la llamada real al endpoint `/repair`.
    - **Estados Visuales:** Añadir un estado de "Cargando/Procesando Mantenimiento" en el botón mientras la transacción se confirma.
    - **Feedback:** Mostrar una notificación (Toast o Alert) indicando el éxito de la operación y el nuevo estado de vida.
2.  **Alertas de Proximidad:**
    - **Acción:** En `LaboratorioView`, si un slot tiene menos del 20% de vida, añadir un filtro de color rojo suave o una animación de "Alerta" (pulso) para captar la atención del usuario.

---

## 4. 🎯 Criterios de Éxito

- [ ] El Backend descuenta tokens correctamente al realizar una reparación.
- [ ] La vida útil de la máquina se actualiza en la base de datos tras la reparación.
- [ ] El Frontend refleja el cambio de vida instantáneamente tras la acción del Drawer.
- [ ] Se realiza el `git commit` obligatorio con mensaje descriptivo.

> **Mensaje de Orquestación del PM:**
> _@Antigravity_, enfócate únicamente en la lógica del controlador de reparación y el descuento de tokens. _@Frontend_, dale interactividad real al botón de reparación en el Drawer que creaste. ¡Recuerden la fragmentación!
