import { chronoBurstFreqTypes as defaultFreqTypes, processingFrequencies } from '../constants/blockchainFrequencies';

/**
 * Tipo interno de una entrada de frecuencia normalizada.
 */
interface FreqEntry {
  value: number;
  unit: string;
}

/**
 * Extrae y normaliza el mapa de frecuencias de cualquier fuente:
 *  - Constante local `chronoBurstFreqTypes`   → { frequencies: { megaCB: { value, unit }, ... } }
 *  - Respuesta del store/API                  → misma forma, o directamente { megaCB: { value, unit }, ... }
 *
 * Siempre devuelve un array ordenado de mayor a menor por `.value`.
 */
const extractSortedFreqs = (freqMap?: unknown): FreqEntry[] => {
  let rawFreqs: Record<string, unknown> | null = null;

  if (freqMap && typeof freqMap === 'object') {
    const fmap = freqMap as Record<string, unknown>;
    // Forma canónica: { frequencies: { ... } }
    if (fmap.frequencies && typeof fmap.frequencies === 'object') {
      rawFreqs = fmap.frequencies as Record<string, unknown>;
    } else {
      // Forma plana del servidor: { megaCB: { value, unit }, ... }
      // Solo lo usamos si contiene al menos una entrada con shape { value, unit }
      const firstVal = Object.values(fmap)[0];
      if (
        firstVal &&
        typeof firstVal === 'object' &&
        'value' in (firstVal as object) &&
        'unit' in (firstVal as object)
      ) {
        rawFreqs = fmap;
      }
    }
  }

  // Fallback a la constante local si no se pudo extraer nada usable
  if (!rawFreqs) {
    rawFreqs = defaultFreqTypes.frequencies as unknown as Record<string, unknown>;
  }

  return Object.values(rawFreqs)
    .map((f) => {
      const entry = f as Record<string, unknown>;
      return {
        value: Number(entry.value ?? 0),
        unit: String(entry.unit ?? 'cb'),
      };
    })
    .filter((e) => e.value > 0)
    .sort((a, b) => b.value - a.value);
};

/**
 * Formatea un valor de hash plano (unidades base) a su representación
 * compacta en la mayor unidad Chrono Burst que resulte en un cociente ≥ 1.
 *
 * Comportamiento:
 *  - Valores ≥ umbral de la unidad más alta → escalan correctamente.
 *  - Valores < 1 Mcb (1,000,000) → se muestran en unidades base como entero
 *    formateado con separadores de millares, sin unidad CB fabricada.
 *  - Valores entre umbrales → se muestran con la unidad inmediatamente inferior
 *    con hasta 2 decimales adaptativos (se omiten los .00).
 *  - Enteros exactos tras la división → sin decimales (10 Mcb, no 10.0 Mcb).
 *
 * @param hashVal  Valor numérico bruto del hash (unidades base del backend).
 * @param freqMap  Mapa de frecuencias del store Redux (puede ser null o undefined).
 */
export const formatHash = (hashVal: number, freqMap?: unknown): string => {
  if (!Number.isFinite(hashVal) || hashVal < 0) return '0 cb';

  const sortedFreqs = extractSortedFreqs(freqMap);

  // Caso vacío: devolver unidades base
  if (sortedFreqs.length === 0) {
    return `${hashVal.toLocaleString()} cb`;
  }

  // La unidad mínima disponible (la última del array ordenado desc.)
  const minEntry = sortedFreqs[sortedFreqs.length - 1];

  // Si el valor es menor que la unidad mínima, mostramos en unidades base
  if (hashVal < minEntry.value) {
    return `${hashVal.toLocaleString()} cb`;
  }

  // Buscar la unidad más alta cuyo divisor quepa con cociente ≥ 1
  for (const freq of sortedFreqs) {
    if (hashVal >= freq.value) {
      const scaled = hashVal / freq.value;
      const formatted = scaled.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 5,
      });
      return `${formatted} ${freq.unit}`;
    }
  }

  // Nunca debería llegar aquí, pero por seguridad:
  return `${hashVal.toLocaleString()} cb`;
};

/**
 * Versión simplificada sin dependencia del store — usa solo las constantes locales.
 * Útil en contextos donde el store no está disponible (tests unitarios, SSR, etc.).
 *
 * @param hashVal  Valor numérico bruto del hash.
 */
export const formatHashLocal = (hashVal: number): string =>
  formatHash(hashVal, undefined);

/**
 * Devuelve únicamente la unidad (ej: 'Mcb', 'Gcb') para un valor dado.
 * Consistente con `formatHash`.
 *
 * @param hashVal  Valor numérico bruto del hash.
 * @param freqMap  Mapa de frecuencias del store (opcional).
 */
export const getHashUnit = (hashVal: number, freqMap?: unknown): string => {
  if (!Number.isFinite(hashVal) || hashVal < 0) return 'cb';
  const sortedFreqs = extractSortedFreqs(freqMap);
  if (sortedFreqs.length === 0) return 'cb';
  const minEntry = sortedFreqs[sortedFreqs.length - 1];
  if (hashVal < minEntry.value) return 'cb';
  for (const freq of sortedFreqs) {
    if (hashVal >= freq.value) return freq.unit;
  }
  return 'cb';
};
