import { chronoBurstFreqTypes } from '../constants/blockchainFrequencies';

/**
 * Formatea un valor de hash plano a un formato compacto y legible
 * escalado a la mayor unidad de frecuencia Chrono Burst (CB) disponible.
 * 
 * @param hashVal Valor numérico plano del hash
 * @param freqMap Mapa de frecuencias opcional obtenido del store
 */
export const formatHash = (hashVal: number, freqMap?: any): string => {
  const frequencies = freqMap?.frequencies || chronoBurstFreqTypes.frequencies;
  
  // Convertir el mapa de frecuencias a una lista ordenada descendentemente por su valor
  const sortedFreqs = Object.values(frequencies)
    .map((f: any) => ({ value: Number(f.value), unit: String(f.unit) }))
    .sort((a, b) => b.value - a.value);

  // Buscar el divisor más alto que quepa en el valor del hash
  for (const freq of sortedFreqs) {
    if (hashVal >= freq.value) {
      const scaledValue = hashVal / freq.value;
      const formattedValue = scaledValue % 1 === 0 ? scaledValue.toString() : scaledValue.toFixed(1);
      return `${formattedValue} ${freq.unit}`;
    }
  }

  // Fallback a la unidad más baja si el valor es menor que cualquier frecuencia definida
  const lowestFreq = sortedFreqs[sortedFreqs.length - 1];
  if (lowestFreq) {
    const scaledValue = hashVal / lowestFreq.value;
    const formattedValue = scaledValue % 1 === 0 ? scaledValue.toString() : scaledValue.toFixed(1);
    return `${formattedValue} ${lowestFreq.unit}`;
  }

  return `${hashVal} Mcb`;
};
