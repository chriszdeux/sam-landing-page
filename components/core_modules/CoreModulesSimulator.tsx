"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Leaf, Users, Info } from 'lucide-react';
import { StationModule } from '../../lib/types/core_modules';
import { ModuleModuleModuleAnchorModal } from './ModuleAnchorModal';
import api, { hadesApi } from '../../lib/api';
import { calculateResources } from '../../lib/utils/core_modules_logic';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils/cn';

// Initial data for the simulator
const INITIAL_MODULES: StationModule[] = [
  {
    userId: "user_1",
    moduleId: "hub-root",
    moduleType: "science",
    baseVitality: 100,
    radiationResistance: 0.162,
    thaoCost: 1000,
    currentEnergyOutput: -5,
    isOperational: true,
    anchors: { northConnected: false, southConnected: false, eastConnected: false, westConnected: false },
    positionCoordinates: { xPos: 0, yPos: 0 },
    usePrimitiveShape: true,
    shapeType: "octagon",
    status: "active"
  }
];

const SHAPE_CONFIG: Record<string, { color: string, render: (x: number, y: number, id: string, isPending: boolean) => React.ReactNode }> = {
  octagon: {
    color: '#FFFFFF',
    render: (x, y, id, isPending) => (
      <polygon key={id} points={`${x-20},${y-40} ${x+20},${y-40} ${x+40},${y-20} ${x+40},${y+20} ${x+20},${y+40} ${x-20},${y+40} ${x-40},${y+20} ${x-40},${y-20}`} fill={`rgba(255,255,255,${isPending ? 0.2 : 0.8})`} stroke="#FFFFFF" strokeWidth="2" strokeDasharray={isPending ? "4,4" : "none"} style={isPending ? { animation: 'pulseHologram 2s infinite' } : {}}/>
    )
  },
  square: {
    color: '#FF2200',
    render: (x, y, id, isPending) => (
      <rect key={id} x={x-30} y={y-30} width="60" height="60" fill={`rgba(255,34,0,${isPending ? 0.2 : 0.8})`} stroke="#FF2200" strokeWidth="2" strokeDasharray={isPending ? "4,4" : "none"} style={isPending ? { animation: 'pulseHologram 2s infinite' } : {}}/>
    )
  },
  triangle: {
    color: '#0055FF',
    render: (x, y, id, isPending) => (
      <polygon key={id} points={`${x},${y-35} ${x+35},${y+35} ${x-35},${y+35}`} fill={`rgba(0,85,255,${isPending ? 0.2 : 0.8})`} stroke="#0055FF" strokeWidth="2" strokeDasharray={isPending ? "4,4" : "none"} style={isPending ? { animation: 'pulseHologram 2s infinite' } : {}}/>
    )
  },
  circle: {
    color: '#22FF44',
    render: (x, y, id, isPending) => (
      <circle key={id} cx={x} cy={y} r="30" fill={`rgba(34,255,68,${isPending ? 0.2 : 0.8})`} stroke="#22FF44" strokeWidth="2" strokeDasharray={isPending ? "4,4" : "none"} style={isPending ? { animation: 'pulseHologram 2s infinite' } : {}}/>
    )
  },
  rectangle: {
    color: '#C0C0C0',
    render: (x, y, id, isPending) => (
      <rect key={id} x={x-40} y={y-25} width="80" height="50" fill={`rgba(192,192,192,${isPending ? 0.2 : 0.8})`} stroke="#C0C0C0" strokeWidth="2" strokeDasharray={isPending ? "4,4" : "none"} style={isPending ? { animation: 'pulseHologram 2s infinite' } : {}}/>
    )
  }
};

const GRID_SIZE = 120;

export const CoreModulesSimulator: React.FC = () => {
  const [stationModules, setStationModules] = useState<StationModule[]>([]);
  const [serverResources, setServerResources] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] CORE_MODULES-8 Inicializado...']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<{ x: number, y: number } | undefined>();

  const fetchState = async () => {
    try {
      const res = await hadesApi.get('/getStationState');
      setStationModules(res.data.modules || []);
      setServerResources(res.data.resources);
    } catch (error) {
      console.error("Error fetching station state:", error);
      setLogs(prev => [...prev, '[ERROR] No se pudo cargar el estado de la estación.']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Resource Calculations
  const resources = useMemo(() =>
    calculateResources(stationModules, serverResources),
  [stationModules, serverResources]);

  useEffect(() => {
    // Collision detection logic
    const occupied = new Set<string>();
    let collisionDetected = false;
    for (const mod of stationModules) {
      if (!mod.positionCoordinates) continue;
      const coordStr = `${mod.positionCoordinates.xPos},${mod.positionCoordinates.yPos}`;
      if (occupied.has(coordStr)) {
        collisionDetected = true;
        setCollisionWarning(`ALT: Colisión en [${mod.positionCoordinates.xPos}, ${mod.positionCoordinates.yPos}]!`);
        break;
      }
      occupied.add(coordStr);
    }
    if (!collisionDetected) setCollisionWarning(null);
  }, [stationModules]);

  const saveState = async (updatedModules: StationModule[]) => {
    try {
      const res = await hadesApi.post('/saveStationState', { modules: updatedModules });
      setServerResources(res.data.resources);
      setLogs(prev => [...prev, '[SYSTEM] Estado de la estación sincronizado.']);
      window.dispatchEvent(new Event('core_modules-inventory-refresh'));
    } catch (error) {
      console.error("Error saving station state:", error);
      setLogs(prev => [...prev, '[ERROR] Fallo al sincronizar con el servidor.']);
    }
  };

  const handleGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const xPos = Math.round(cursor.x / GRID_SIZE);
    const yPos = Math.round(cursor.y / -GRID_SIZE);

    // Check if occupied
    const existing = stationModules.find(m => m.positionCoordinates?.xPos === xPos && m.positionCoordinates?.yPos === yPos);
    if (!existing) {
      // Check if neighboring any module
      const hasNeighbor = stationModules.some(m =>
        m.positionCoordinates && (Math.abs(m.positionCoordinates.xPos - xPos) + Math.abs(m.positionCoordinates.yPos - yPos) === 1)
      );

      if (hasNeighbor || stationModules.length === 0) {
        setSelectedCoord({ x: xPos, y: yPos });
        setIsModalOpen(true);
      } else {
        setLogs(prev => [...prev, `[ERROR] El punto [${xPos}, ${yPos}] no tiene anclajes adyacentes.`]);
      }
    } else {
       setLogs(prev => [...prev, `[INFO] Nodo en [${xPos}, ${yPos}]: ${existing.moduleType.toUpperCase()}`]);
    }
  };

  const handleModuleSelect = async (invModule: any) => {
    if (!selectedCoord) return;

    const newMod: StationModule = {
      ...invModule,
      isAnchored: true,
      status: "active",
      positionCoordinates: { xPos: selectedCoord.x, yPos: selectedCoord.y },
      anchors: { northConnected: false, southConnected: false, eastConnected: false, westConnected: false }
    };

    const newModules = [...stationModules, newMod];
    setStationModules(newModules);
    setLogs(prev => [...prev, `[SISTEMA] Módulo ${invModule.moduleType.toUpperCase()} anclado con éxito.`]);

    await saveState(newModules);
  };

  const applyDamage = () => {
    setLogs(prev => [...prev, `[SISTEMA] Radiación Profunda detectada. Mitigación act: 16.2%`]);
    const damagedModules = stationModules.map(mod => ({
      ...mod,
      baseVitality: Math.max(0, parseFloat((mod.baseVitality - 15 * (1 - 0.162)).toFixed(2)))
    }));
    setStationModules(damagedModules);
    saveState(damagedModules);
  };

  const getModuleAt = (x: number, y: number) => {
    return stationModules.find(m => m.positionCoordinates?.xPos === x && m.positionCoordinates?.yPos === y);
  };


  return (
    <div className="flex h-[650px] gap-4">
      <style>{`
        @keyframes pulseHologram {
          0% { opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
      `}</style>

      {/* Main Container */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#00f3ff]/20 bg-[rgba(10,15,25,0.4)] p-6 backdrop-blur-md">
        {/* Header HUD */}
        <div className="z-[2] mb-4 flex items-start justify-between">
          {/* Resource Gauges */}
          <div className="flex gap-6">
            <ResourceGauge
              icon={<Zap size={18} />}
              label="ENERGY"
              value={`${resources.energy} GW`}
              color={resources.energy < 0 ? "#ff4444" : "#ffd700"}
            />
            <ResourceGauge
              icon={<Leaf size={18} />}
              label="OXYGEN"
              value={`${resources.oxygen}%`}
              color={resources.oxygen < 20 ? "#ff4444" : "#22FF44"}
            />
            <ResourceGauge
              icon={<Users size={18} />}
              label="CREW"
              value={resources.crew}
              color="#C0C0C0"
            />
              <ResourceGauge
               icon={<Info size={18} />}
               label="INTEGRITY"
               value={`${(resources.integrity || 0).toFixed(1)}%`}
               color={(resources.integrity || 0) < 50 ? "#ff4444" : "#00f3ff"}
             />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <button
                role="switch"
                aria-checked={debugMode}
                onClick={() => setDebugMode((d) => !d)}
                className={cn(
                  'relative h-5 w-9 rounded-full transition-colors',
                  debugMode ? 'bg-[#ffab00]' : 'bg-white/20'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
                    debugMode ? 'translate-x-[18px]' : 'translate-x-0.5'
                  )}
                />
              </button>
              <Typography variant="caption" className="font-bold text-white/60">DEBUG</Typography>
            </label>
            <Button size="small" variant="outlined" color="error" onClick={applyDamage} sx={{ fontSize: '0.7rem' }}>
              RAD TEST
            </Button>
            <span className="inline-flex items-center rounded-full border border-[#00f3ff]/30 bg-[#00f3ff]/10 px-2.5 py-0.5 text-[0.7rem] font-bold text-[#00f3ff]">
              SHIELD: 16.2%
            </span>
          </div>
        </div>

        {collisionWarning && (
          <div className="z-[2] mb-4 rounded border border-[#d32f2f] bg-[rgba(211,47,47,0.2)] px-3 py-2 text-sm text-[#ff4444]">
            {collisionWarning}
          </div>
        )}

        {/* Workspace */}
        <div className="relative flex-1 cursor-crosshair overflow-hidden rounded-xl border border-white/5 bg-black/20">
          {/* Grid Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px)`,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              backgroundPosition: 'center center',
            }}
          />

          {/* SVG Engine */}
          <svg
            onClick={handleGridClick}
            className="absolute inset-0 h-full w-full"
            viewBox="-480 -300 960 600"
          >
            {/* Draw connections */}
            {stationModules.map(mod => {
              if (mod.status !== 'active' || !mod.positionCoordinates) return null;
              const x1 = mod.positionCoordinates.xPos * GRID_SIZE;
              const y1 = mod.positionCoordinates.yPos * -GRID_SIZE;

              return [
                { nx: 0, ny: 1, prop: 'northConnected' },
                { nx: 1, ny: 0, prop: 'eastConnected' }
              ].map(dir => {
                const neighbor = getModuleAt(mod.positionCoordinates!.xPos + dir.nx, mod.positionCoordinates!.yPos + dir.ny);
                if (neighbor) {
                  const flowColor = mod.moduleType === 'energy' || neighbor.moduleType === 'energy' ? 'rgba(255,34,0,0.4)' : 'rgba(34,255,68,0.4)';
                  return <line key={`${mod.moduleId}-${dir.prop}`} x1={x1} y1={y1} x2={(mod.positionCoordinates!.xPos + dir.nx) * GRID_SIZE} y2={(mod.positionCoordinates!.yPos + dir.ny) * -GRID_SIZE} stroke={flowColor} strokeWidth="6" strokeDasharray="8,4" />;
                }
                return null;
              });
            })}

            {/* Draw Modules */}
            {stationModules.map(mod => {
              if (!mod.positionCoordinates) return null;
              const x = mod.positionCoordinates.xPos * GRID_SIZE;
              const y = mod.positionCoordinates.yPos * -GRID_SIZE;
              const config = SHAPE_CONFIG[mod.shapeType!];
              const isPending = mod.status === 'pendingConfirmation';

              return (
                <g key={mod.moduleId} style={{ cursor: 'pointer' }}>
                  {config.render(x, y, mod.moduleId, isPending)}
                  <text x={x} y={y + 5} fontSize="12" fill="white" textAnchor="middle" fontWeight="900" pointerEvents="none">
                    {mod.baseVitality.toFixed(0)}%
                  </text>
                  {isPending && (
                     <text x={x} y={y - 50} fontSize="10" fill="#ffd700" textAnchor="middle" fontWeight="bold" style={{ animation: 'pulseHologram 1s infinite' }}>
                       PROCESANDO...
                     </text>
                  )}
                  {debugMode && (
                    <text x={x} y={y + 55} fontSize="9" fill="rgba(255,255,255,0.4)" textAnchor="middle">
                      [{mod.positionCoordinates.xPos},{mod.positionCoordinates.yPos}]
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Logs HUD */}
      <div className="flex w-[280px] flex-col rounded-2xl border border-[#00f3ff]/20 bg-[rgba(5,5,10,0.8)] p-4 backdrop-blur-md">
        <Typography variant="overline" component="p" className="mb-2 block border-b border-[#00f3ff]/10 pb-2 font-bold text-[#00f3ff]">
          TECHNICAL LOGS // CORE_MODULES
        </Typography>
        <div className="flex flex-1 flex-col-reverse gap-2 overflow-y-auto">
          {logs.map((log, i) => (
            <Typography
              key={i}
              variant="caption"
              component="p"
              className="font-mono text-[0.65rem]"
              style={{ color: log.includes('ERROR') ? '#ff4444' : log.includes('SOLICITUD') ? '#ffd700' : 'rgba(255,255,255,0.5)' }}
            >
              {log}
            </Typography>
          ))}
        </div>
      </div>

      <ModuleModuleModuleAnchorModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleModuleSelect}
        coordinate={selectedCoord}
      />
    </div>
  );
};

function ResourceGauge({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className="flex min-w-[100px] items-center gap-3">
      <div
        className="flex items-center justify-center rounded-full p-2"
        style={{
          backgroundColor: `${color}15`,
          border: `1px solid ${color}33`,
          color: color,
          boxShadow: `0 0 10px ${color}11`,
        }}
      >
        {icon}
      </div>
      <div>
        <Typography variant="caption" component="p" className="block text-[0.6rem] font-bold leading-none text-white/40">
          {label}
        </Typography>
        <Typography variant="body2" component="p" className="text-[0.9rem] font-black tracking-wide text-white">
          {value}
        </Typography>
      </div>
    </div>
  );
}
