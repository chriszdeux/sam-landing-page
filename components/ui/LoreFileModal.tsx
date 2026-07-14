'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Button } from '@mui/material';
import { X as CloseIcon, Copy as CopyIcon, Check as CheckIcon, FileText } from 'lucide-react';
import { EnvVariables } from '../../lib/constants/variables';

interface LoreFileModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoreFileModal({ open, onClose }: LoreFileModalProps) {
  const { project } = EnvVariables;
  const [copied, setCopied] = useState(false);

  const rawLoreContent = `# INFORME DE ARQUITECTURA NARRATIVA: PROTOCOLO ${project.toUpperCase()} (VARIABLE GLOBAL)

**Documento de Consolidación y Despliegue de Canon Estelar (Entorno Agnóstico)**

Para cumplir con la directiva de desarrollo, el sistema se ha desacoplado por completo de cualquier identificador estático. A partir de este momento, el nombre del ecosistema se maneja a través de la variable de entorno NEXT_PUBLIC_PROJECT_NAME. En esta documentación técnica y narrativa, nos referiremos al núcleo simplemente como El Protocolo.

---

## 1. SISTEMA DE REGLAS TECNOLÓGICAS: EL LEDGER DE SEDIMENTO

En un universo donde la humanidad ha sido dispersada y cada facción huye hacia los confines del cosmos por su cuenta, la tecnología del Ledger de Sedimento no es un software de contabilidad; es la infraestructura de supervivencia inmutable que evita la extinción cultural y económica.

### Ley del Enlace de Supervivencia (Quantum Ledger)

* El Mecanismo: Sincronización instantánea de registros financieros, técnicos y de recursos entre los nodos remotos de la galaxia y el bloque génesis profundo.
* El Coste (Entropía de Soporte de Vida): Alojar y validar los bloques del Ledger en el espacio profundo no es gratuito. Consume ciclos de procesamiento críticos que las naves generacionales o colonias nómadas necesitan para sus propios sistemas de soporte de vida simulados y navegación predictiva. Comerciar o validar transacciones requiere apagar temporalmente sistemas secundarios de la nave.
* El Límite (La Distancia Crítica): Si una flota o cápsula se adentra en zonas con alta fluctuación gravitacional o supera la frontera cuántica medible del sol emisor original, la latencia fragmenta el registro. Si el ledger local se desvincula por completo del resto de la red dispersa, los activos se "petrifican" (se congelan), dejando a esa colonia en aislamiento absoluto.

---

## 2. CRONOLOGÍA VECTORIAL: EL HILO DE LA DISPERSIÓN

[2036: EL INVIERNO FÍAT] ───► [2042: ÉXODO ROJO] ───► [ERA POST-GRIETA: LA DISPERSIÓN]
  (La Ceniza y el Código)        (La Última Colonia)        (Hacia el Confín del Universo)

### AÑO 2036 | La Ceniza y el Código (El Invierno Fíat)
* El Evento: Tras el colapso nuclear del sistema financiero tradicional y con la superficie terrestre devastada por guerras cibernéticas y un colapso ecológico total, el Protocolo emerge desde los búnkeres de resistencia en México.
* La Crónica: Un reducto de programadores rebeldes en Guadalajara liberó el Protocolo desde servidores ocultos en profundos túneles geotérmicos. Las monedas físicas y los registros bancarios ardieron en las hogueras del caos social, pero el Ledger de Sedimento resurgió de las cenizas como la única verdad financiera inmutable.

### AÑO 2042 | Éxodo Rojo (La Última Colonia)
* El Evento: La colonia minera de Marte corta lazos con una Tierra moribunda adoptando el Ledger de Sedimento.
* La Crónica: Los colonos mineros de Arsia Mons, asfixiados por las restrictivas cuotas de oxígeno e impuestos de importación impuestos por los gobiernos terrestres agonizantes, adoptaron el Protocolo como su carta de independencia. Fue una declaración de soberanía definitiva grabada en bloques de datos, no en banderas.

### ERA DE LA DISPERSIÓN | La Gran Grieta (El Confín del Universo)
* El Evento: Un cataclismo masivo fractura la colonia de Marte, obligando a la humanidad a huir hacia lo desconocido.
* La Crónica: Un gran terremoto sacudió Arsia Mons de forma imprevista. Tras el desastre, las estructuras habitables colapsaron y los humanos tuvieron que huir hacia los confines del universo; cada flota, facción y superviviente por su cuenta, avanzando hacia el vacío y contando únicamente con la red del Protocolo como su único nexo común. Ahora, en el espacio profundo, cada quien buscaría su propio destino.

---

## 3. FICHA DE IDENTIDAD DEL PERSONAJE: EL NÓMADA VECTORIAL
* Identidad Operativa: El Rastreador de Rutas (The Pathfinder).
* Motivación Fundamental: Encontrar un sector espacial o un exoplaneta estable para establecer un nuevo asentamiento humano, utilizando la red del Protocolo para no desaparecer en el olvido del vacío.
* Miedo Profundo: El silencio absoluto de los canales cuánticos; que su ledger local se corrompa debido a la radiación cósmica y su nave se transforme en un fragmento fantasma sin identidad ni registros.

---

## 4. NARRATIVA INCRUSTADA: ENVIRONMENTAL STORYTELLING DE INTERFAZ
* Componente de Dashboard Principal: Terminal secundaria en la parte inferior del portafolio mostrando logs simulados de sistema en tiempo real.
* Componente de Fallo de Red (HTTP 408 / Timeout): La pantalla sufre un efecto de parpadeo (Glitch) y se tiñe de una textura de interferencia sepia, alertando del "EFECTO GRIETA".`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawLoreContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#03080a',
          border: '1px solid rgba(0, 243, 255, 0.3)',
          boxShadow: '0 0 40px rgba(0, 243, 255, 0.15)',
          borderRadius: 3,
          color: '#e0f7fa',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden'
        }
      }}
    >
      {/* Scanlines effect overlay */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(3, 8, 10, 0) 50%, rgba(0, 0, 0, 0.3) 50%)',
        backgroundSize: '100% 4px',
        pointerEvents: 'none',
        zIndex: 5
      }} />

      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(0, 243, 255, 0.15)',
        px: 3,
        py: 2,
        zIndex: 10
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FileText size={20} color="#00f3ff" />
          <Typography sx={{ fontWeight: 'bold', letterSpacing: 2, fontSize: '0.95rem', color: '#00f3ff' }}>
            DOC_REF: LORE.MD (RAW CANON SOURCE)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleCopy} size="small" sx={{ color: 'rgba(0, 243, 255, 0.7)', '&:hover': { color: '#00f3ff' } }}>
            {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
          </IconButton>
          <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#ff0055' } }}>
            <CloseIcon size={18} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3, zIndex: 10, position: 'relative' }}>
        <Box sx={{
          bgcolor: 'rgba(0, 243, 255, 0.02)',
          border: '1px solid rgba(0, 243, 255, 0.1)',
          borderRadius: 2,
          p: 3,
          maxHeight: '60vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'rgba(0,0,0,0.1)' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0, 243, 255, 0.3)', borderRadius: '2px' },
        }}>
          <pre style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            color: '#a7ffeb',
            textShadow: '0 0 4px rgba(0, 243, 255, 0.2)'
          }}>
            {rawLoreContent}
          </pre>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
