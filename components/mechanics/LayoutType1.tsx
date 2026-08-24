// 1-Selección de datos desde el estado global de Redux
// 2-Estructuración y renderizado visual del componente UI
// 3-Selección de datos desde el estado global de Redux
// 4-Estructuración y renderizado visual del componente UI
// 5-Estructuración y renderizado visual del componente UI

import React from 'react';
import { motion } from 'framer-motion';
import { Mechanic } from '../../lib/data/mechanics';
import { Typography } from '../ui/Typography';

//# 1-Selección de datos desde el estado global de Redux
import { useSelector } from 'react-redux';
import { BlockchainState } from '@/lib/features/blockchain/types';

export const ProbePulse = ({ color }: { color: string }) => {

  //# 2-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative flex h-[300px] w-[300px] items-center justify-center">
      {}
      <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: color, zIndex: 10, boxShadow: `0 0 20px ${color}` }} />

      {}
      {[0, 1, 2].map((i) => (
        <motion.div
            key={i}
            style={{
                position: 'absolute',
                border: `1px solid ${color}`,
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
            }}
            initial={{ opacity: 0, width: 0, height: 0 }}
            animate={{
                width: [0, 500],
                height: [0, 500],
                opacity: [0, 0.5, 0],
                borderWidth: [2, 0]
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear",
                times: [0, 0.2, 1]
            }}
        />
      ))}

      {}
       <motion.div
            style={{
                position: 'absolute',
                width: 250,
                height: 250,
                border: `1px dashed ${color}30`,
                borderRadius: '50%'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
       />
       <motion.div
            style={{
                position: 'absolute',
                width: 180,
                height: 180,
                border: `1px dashed ${color}50`,
                borderRadius: '50%'
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
       />
    </div>
  )
}

export const LayoutType1 = ({ mechanic }: { mechanic: Mechanic }) => {

  //# 3-Selección de datos desde el estado global de Redux
  const { networks } = useSelector((state: { blockchain: BlockchainState }) => state.blockchain);

   //# 4-Estructuración y renderizado visual del componente UI
   return (
     <div className="mx-auto w-full max-w-[1536px] px-4 pt-40 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-12">
      <div className="md:col-span-6">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Typography variant="overline" className="font-bold tracking-[3px]" style={{ color: mechanic.color }}>
             MECÁNICA PRINCIPAL
          </Typography>
          <Typography variant="h1" className="mb-8 mt-4 text-[3rem] font-extrabold md:text-[5rem]">
            {mechanic.title}
          </Typography>
          <Typography variant="h5" className="mb-8 leading-[1.6] text-foreground-muted">
            {mechanic.content.paragraphs[0]}
          </Typography>
          <div className="mb-12 flex flex-row gap-4">
            <div className="rounded-lg border border-white/10 p-4">
                <Typography variant="caption" component="p" className="text-foreground-muted">{mechanic.content.statLabel}</Typography>
                <Typography variant="h4" component="p" className="font-bold text-white">{mechanic.content.statValue}</Typography>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="md:col-span-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div
                className="relative h-[500px] overflow-hidden rounded-[32px] bg-white/[0.03]"
                style={{
                    border: `1px solid ${mechanic.color}40`,
                    boxShadow: `0 0 50px ${mechanic.color}20`,
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                     {}
                     {[...Array(20)].map((_, i) => {

                        const top = ((i * 17) % 100);
                        const left = ((i * 23) % 100);
                        const delay = (i % 5);

                        //# 5-Estructuración y renderizado visual del componente UI
                        return (
                        <motion.div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: `${top}%`,
                                left: `${left}%`,
                                width: 2,
                                height: 2,
                                backgroundColor: 'white',
                            }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2 + delay, repeat: Infinity, ease: "easeInOut" }}
                        />
                     )})}
                     <ProbePulse color={mechanic.color} />
                </div>
                {}
                <div className="absolute bottom-[30px] left-[30px] right-[30px] rounded-2xl bg-black/80 p-6 backdrop-blur-md">
                    <Typography variant="subtitle2" component="p" style={{ color: mechanic.color }}>Estado del Sistema - {networks[0]?.isActive ? "Operativo" : "No operativo"}</Typography>
                    <div className="mt-2 h-1 rounded-lg bg-white/10">
                        <div className="h-full rounded-lg" style={{ width: '70%', backgroundColor: mechanic.color }} />
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </div>

    <div className="mt-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {mechanic.content.paragraphs.slice(1).map((p: string, i: number) => (
                <div className="md:col-span-6" key={i}>
                    <Typography component="p" className="text-[1.1rem] leading-[1.8] text-foreground-muted">{p}</Typography>
                </div>
            ))}
        </div>
    </div>

    <div className="mb-20 mt-20">
        <Typography variant="h4" component="p" className="mb-2">Características Clave</Typography>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {mechanic.content.features.map((f, i) => (
                <div className="md:col-span-1" key={i}>
                    <div
                        className="h-full rounded-lg bg-white/[0.02] p-6"
                        style={{ borderLeft: `4px solid ${mechanic.color}` }}
                    >
                        <Typography component="p" className="mb-2 font-bold">{f.title}</Typography>
                        <Typography variant="body2" component="p" className="text-foreground-muted">{f.description}</Typography>
                    </div>
                </div>
            ))}
        </div>
    </div>
  </div>
   )
}
