// 1-Definir componente de visualización de datos blockchain
// 2-Renderizar estado vacío
// 3-Renderizar datos de la red con animaciones

//# 1-Definir componente de visualización de datos blockchain
import React from 'react';
import { Typography } from '../ui/Typography';
import { motion } from 'framer-motion';
import { BlockchainInterface } from '../../lib/types/blockchain';

interface BlockchainDataDisplayProps {
  network: BlockchainInterface | null | undefined;
}

export const BlockchainDataDisplay: React.FC<BlockchainDataDisplayProps> = ({ network }) => {

  if (!network) {

    //# 2-Renderizar estado vacío
    return (
        <div className="rounded-paper border border-white/10 bg-[rgba(10,12,16,0.8)] p-8 text-center">
            <Typography className="text-foreground-muted">Seleccione una red para ver sus datos.</Typography>
        </div>
    );
  }

  const { identification, additionalInfo } = network;
  const color = additionalInfo?.color || '#00f3ff';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  //# 3-Renderizar datos de la red con animaciones
  return (
    <div className="mb-12 w-full">
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >

            <div
                className="relative mb-6 flex items-center gap-6 overflow-hidden border border-white/5 p-6"
                style={{
                    background: `linear-gradient(90deg, rgba(10,12,16,0.9) 0%, ${color}15 100%)`,
                    borderLeft: `4px solid ${color}`,
                }}
            >

                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                        boxShadow: `0 0 15px ${color}`,
                        opacity: 0.5,
                        zIndex: 2
                    }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                 <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        boxShadow: [`0 0 20px ${color}40`, `0 0 40px ${color}60`, `0 0 20px ${color}40`]
                    }}
                    transition={{
                        type: "spring", stiffness: 200,
                        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                 >
                    <div
                        className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24%] text-2xl font-bold text-white"
                        style={{ border: `2px solid ${color}` }}
                    >
                        <span className="absolute inset-0 flex items-center justify-center">{identification.symbol[0]}</span>
                        {identification.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={identification.image}
                                alt={identification.symbol}
                                className="relative h-full w-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}
                    </div>
                 </motion.div>

                 <div className="z-[1]">
                     <div className="mb-1 flex items-center gap-2">
                        <Typography variant="h3" className="font-bold leading-none tracking-wide text-white">
                            {identification.name}
                        </Typography>
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
                        </motion.div>
                     </div>

                     <div className="flex items-center gap-2">
                        <Typography component="span" variant="h6" className="font-bold opacity-80" style={{ color }}>{identification.symbol}</Typography>
                        <Typography variant="body2" className="font-mono text-foreground-muted opacity-60">
                            | MODULE ID: {network.id}
                        </Typography>
                     </div>
                 </div>

                 {identification.image && (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={identification.image} alt="" className="pointer-events-none absolute -top-5 -right-5 h-[300px] w-[300px] opacity-5" />
                 )}
            </div>
        </motion.div>
    </div>
  );
};
