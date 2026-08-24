'use client';

import React from 'react';
import { Compass, Cpu, Wallet, Users, Activity, Rocket, Blocks, BarChart3 } from 'lucide-react';
import { Typography } from '../ui/Typography';

export const LyncoreFeaturesGrid = () => (
  <div className="mt-2 grid grid-cols-12 gap-6">
    {[
      { text: 'Exploración Galáctica', desc: 'Explora planetas hostiles y recolecta recursos para tus naves y bases.', icon: Compass },
      { text: 'Contratos de Energía', desc: 'Crea estructuras y realiza acuerdos de suministro energético entre usuarios.', icon: Cpu },
      { text: 'Gestión de Wallet', desc: 'Administra tus activos y realiza transferencias inmutables seguras.', icon: Wallet },
      { text: 'Cooperación Estratégica', desc: 'Únete a clanes y coopera para erigir una civilización tecnológica avanzada.', icon: Users }
    ].map((item, idx) => {
      const Icon = item.icon;
      return (
        <div className="col-span-12 sm:col-span-6 md:col-span-3" key={idx}>
          <div className="flex flex-col gap-2 rounded-lg border border-[#00f3ff]/10 bg-white/[0.02] p-5 transition-all duration-200 ease-in-out hover:border-[#00f3ff]/30 hover:bg-[#00f3ff]/[0.04]">
            <div className="flex flex-row items-center gap-3">
              <Icon size={18} color="#00f3ff" />
              <Typography variant="subtitle2" className="font-bold text-white">
                {item.text}
              </Typography>
            </div>
            <Typography variant="caption" className="text-foreground-muted">
              {item.desc}
            </Typography>
          </div>
        </div>
      );
    })}
  </div>
);

export const OperationsFeaturesGrid = () => (
  <div className="mt-2 grid grid-cols-12 gap-6">
    {[
      { text: 'Visualizar tus activos', icon: Wallet, desc: 'Control centralizado de wallets, balances y recursos recolectados.' },
      { text: 'Inyectar hash a la red', icon: Activity, desc: 'Asegura la red procesando y firmando bloques con tu hash local.' },
      { text: 'Incrementar la potencia', icon: Cpu, desc: 'Overclockea tus reactores para acelerar los ciclos de procesamiento.' },
      { text: 'Gestionar tus naves', icon: Rocket, desc: 'Despliega flotas de exploración y cargueros mineros en el yermo.' },
      { text: 'Tus estructuras', icon: Blocks, desc: 'Construye módulos de soporte vital, plantas solares y reactores.' },
      { text: 'Economía integrada', icon: BarChart3, desc: 'Establece contratos de suministro energético y comercio directo.' }
    ].map((item, idx) => {
      const Icon = item.icon;
      return (
        <div className="col-span-12 sm:col-span-6 md:col-span-4" key={idx}>
          <div className="flex flex-col gap-2 rounded-lg border border-[#00e676]/10 bg-white/[0.02] p-5 transition-all duration-200 ease-in-out hover:border-[#00e676]/30 hover:bg-[#00e676]/[0.04]">
            <div className="flex flex-row items-center gap-3">
              <Icon size={18} color="#00e676" />
              <Typography variant="subtitle2" className="font-bold text-white">
                {item.text}
              </Typography>
            </div>
            <Typography variant="caption" className="text-foreground-muted">
              {item.desc}
            </Typography>
          </div>
        </div>
      );
    })}
  </div>
);

export const MarketFeaturesGrid = () => (
  <div className="mt-2 grid grid-cols-12 gap-6">
    {[
      { text: 'Intercambio Galáctico', desc: 'Comercio instantáneo de tokens, naves y recursos en tiempo real.' },
      { text: 'Liquidez Extrema', desc: 'Sistemas de orden inmediata respaldados por las pools de red.' },
      { text: 'Transferencias Seguras', desc: 'Envío directo de activos entre billeteras seguras del yermo.' }
    ].map((item, idx) => (
      <div className="col-span-12 md:col-span-4" key={idx}>
        <div className="rounded-lg border border-[#ffab00]/10 bg-white/[0.02] p-5 transition-all duration-[250ms] ease-in-out hover:border-[#ffab00]/30 hover:bg-[#ffab00]/[0.04]">
          <Typography variant="subtitle2" className="mb-2 font-bold text-white">
            ✨ {item.text}
          </Typography>
          <Typography variant="caption" className="text-foreground-muted">
            {item.desc}
          </Typography>
        </div>
      </div>
    ))}
  </div>
);

export const LedgerFeaturesGrid = () => (
  <div className="mt-2 grid grid-cols-12 gap-6">
    {[
      { text: 'Bloques Elásticos', desc: 'Los bloques ajustan su capacidad un 25% para optimizar el rendimiento.' },
      { text: 'Ledger Inmutable', desc: 'Registro inalterable firmado por consenso de red y forja solar.' },
      { text: 'Auditoría en Tiempo Real', desc: 'Visualiza y sigue transacciones conforme se sellan al vacío.' }
    ].map((item, idx) => (
      <div className="col-span-12 md:col-span-4" key={idx}>
        <div className="rounded-lg border border-[#ff0055]/10 bg-white/[0.02] p-5 transition-all duration-[250ms] ease-in-out hover:border-[#ff0055]/30 hover:bg-[#ff0055]/[0.04]">
          <Typography variant="subtitle2" className="mb-2 font-bold text-white">
            ⛓️ {item.text}
          </Typography>
          <Typography variant="caption" className="text-foreground-muted">
            {item.desc}
          </Typography>
        </div>
      </div>
    ))}
  </div>
);
