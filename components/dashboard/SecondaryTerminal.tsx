'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { Terminal as TerminalIcon } from 'lucide-react';
import { EnvVariables } from '../../lib/constants/variables';

export function SecondaryTerminal() {
  const { project } = EnvVariables;
  const [logs, setLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const initialLogs = [
    `[SYSTEM] ESTABLECIENDO CONEXIÓN CON EL SATÉLITE HELIOS-PRIME...`,
    `[SYSTEM] NÚCLEO DE PROTOCOLO "${project.toUpperCase()}" DETECTADO.`,
    `[SYSTEM] VERIFICANDO INTEGRIDAD DEL LEDGER DE SEDIMENTO... OK`,
    `[SECURE SHELL] ENCRIPTACIÓN CUÁNTICA ACTIVA (RSA-4096-ECC).`,
    `[NETWORK] CONEXIÓN CON NODO GUADALAJARA ESTABLECIDA EN 48ms.`,
    `[VAL-09] ESPERANDO INYECCIÓN DE HASH RATE...`,
  ];

  const logTemplates = [
    () => `[TELEMETRY] Temperatura del procesador estable a ${(35 + Math.random() * 15).toFixed(1)}°C.`,
    () => `[CONSENSUS] Sincronizando hashes en la red "${project}"... Bloques en consenso.`,
    () => `[WALLET] Balance de Wallet local consultado. Transmisión segura activa.`,
    () => `[SYSTEM] Generando firma de bloque elástico: ${Math.random().toString(16).substring(2, 10).toUpperCase()}...`,
    () => `[HELIOS] Satélite Helios-Prime reporta captación solar al ${(92 + Math.random() * 8).toFixed(2)}%.`,
    () => `[LEDGER] Confirmando transacción en bloque elástico actual del protocolo "${project}".`,
    () => `[ALERT] Fluctuación electromagnética de red detectada: +${(Math.random() * 0.5).toFixed(3)}% HASH.`,
  ];

  useEffect(() => {
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev, `[${timestamp}] ${template()}`].slice(-25)); // Keep last 25 logs
    }, 4000);

    return () => clearInterval(interval);
  }, [project]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <Box sx={{
      mt: 4,
      bgcolor: 'rgba(0, 10, 15, 0.75)',
      border: '1px solid rgba(0, 243, 255, 0.25)',
      borderRadius: 2,
      boxShadow: '0 0 25px rgba(0, 243, 255, 0.05), inset 0 0 20px rgba(0, 243, 255, 0.02)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header bar */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1,
        bgcolor: 'rgba(0, 243, 255, 0.08)',
        borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TerminalIcon size={16} color="#00f3ff" />
          <Typography variant="caption" sx={{
            color: '#00f3ff',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            letterSpacing: 2,
            fontSize: '0.7rem'
          }}>
            TERMINAL DE PROTOCOLO SECUNDARIA // {project.toUpperCase()}_CORE_V1.0
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.8 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff5555' }} />
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ffaa00' }} />
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00e676' }} />
        </Box>
      </Box>

      {/* Screen area */}
      <Box sx={{
        p: 2,
        height: 180,
        overflowY: 'auto',
        fontFamily: 'monospace',
        position: 'relative',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { bgcolor: 'rgba(0,0,0,0.1)' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0, 243, 255, 0.3)', borderRadius: '2px' },
      }}>
        {/* Scanlines overlay */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          zIndex: 10
        }} />

        {logs.map((log, i) => (
          <Typography key={i} sx={{
            color: 'rgba(0, 243, 255, 0.85)',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            lineHeight: 1.6,
            textShadow: '0 0 5px rgba(0, 243, 255, 0.4)',
            wordBreak: 'break-all'
          }}>
            {log}
          </Typography>
        ))}
        <div ref={terminalEndRef} />
      </Box>
    </Box>
  );
}
