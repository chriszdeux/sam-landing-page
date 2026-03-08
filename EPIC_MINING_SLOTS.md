# 📋 Historia de Usuario: Conexión de Máquinas Mineras Reales en el Laboratorio

## 1. Contexto / Objetivo

Actualmente la vista del laboratorio de minería (`sam-landing-page`) simula tener máquinas instaladas usando datos estáticos (`slotsData`). A nivel de negocio, necesitamos que el usuario:

1.  Vea las máquinas reales que tiene vinculadas a su `LaboratoryModel` (slots) provenientes de la base de datos de `sam-backend`.
2.  (En una iteración posterior) Pueda comprar nuevas máquinas, asignarlas al cluster y, por ende, al slot.

Para lograr esto, necesitamos que el backend exponga la lectura detallada de un laboratorio (resolviendo su estado) y que el frontend consuma este endpoint adecuando la grilla. Reemplazando `slotsData` por la información real.

---

## 2. 🛠️ Tareas para Backend (Antigravity)

**Prioridad:** ALTA | Bloqueante para el Frontend.

El Frontend actualmente intenta consumir `GET /labs/:id` en su `useEffect`, pero parece que dicho endpoint no expone los detalles del arreglo `slots` mapeados o, si lo hace, no está documentado en `Endpoints.md`.

**Requerimientos de API:**

1.  **Validar y Documentar `GET /labs/:id`:**
    - **Acción:** Revisa si existe un controlador como `getLaboratory` que responda por este ID en `sam-backend/src/routes/labs/wrap.routes.ts`. Si no existe, créalo.
    - **Payload de salida esperado:** Debería devolver un objeto completo `LaboratoryModel`. En particular, estamos muy interesados en el arreglo `slots` para popular la UI. Cada _slot_ internamente debe tener información de la máquina instalada (nombre de modelo, performance/hashrate, estado operativo).
    - **Documentación:** Añade este endpoint en `Endpoints.md` bajo una sección **LABS**.

2.  **Propuesta de Modelo de Máquina Minera (Si no existe):**
    - **Acción:** Revisando `LaboratoryModel.model.ts`, el `slots` es un `[Object]`. Deberíamos definir bien qué forma tiene ese objeto insertado. ¿Es el ID de un NFT o de un hardware emulado? ¿Tiene `name`, `performance` y `color` para usarse en la UI, o el Frontend deberá derivarlos usando un catálogo? Define esta estructura (interface) y comunica en tu _Inbox_ qué propiedades tendrá cada slot ocupado.

---

## 3. 🎨 Tareas para Frontend

**Prioridad:** MEDIA | Dependiente del Backend.

Una vez que Antigravity (Backend) confirme la estructura del JSON devuelto en `GET /labs/:id` (específicamente de los `slots`), se debe realizar lo siguiente:

1.  **Tipado TypeScript:**
    - Actualizar la interfaz `LabDataInterface` (ubicada cerca de `LaboratorioMetersSection` o crear un archivo de tipos común de Labs) para reflejar fielmente el array `slots` real que manda la API.
2.  **Refactor component `<LaboratorioView />`:**
    - Eliminar el dummy data local (`const slotsData`).
    - Mapear dinámicamente sobre `labData?.slots`. (El backend debería informar si es necesario mostrar "Slots vacíos" y hasta qué número, por default 6).
    - Asegurar que los colores neón, el `name`, y la leyenda de `performance` se acoplen a las variables reales (ej. `slot.hardware.name` o `slot.miningPower`).

---

## 4. 🎯 Criterios de Éxito

- [x] Backend (`sam-backend`) tiene el endpoint de consulta del laboratorio operando y devuelve una estructura de `slots` clara.
- [x] Endpoint de labs registrado en `Endpoints.md`.
- [x] Frontend (`sam-landing-page`) renderiza su tablero principal mostrando 0 máquinas (o las máquinas en BD) en vez de los Antminers estáticos del mockup.
- [x] El arreglo visual funciona fluidamente y respeta el array de la API. No hay errores de consola.

> **Mensaje de Orquestación del PM:**
> _@Antigravity_, confírmame en el Inbox cuando tengas listo o revisado el `GET /labs/:id` para que el dev Frontend proceda a matar el _dummy data_.
