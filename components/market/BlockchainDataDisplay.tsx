
import React from 'react';
import { Box, Typography, Paper, Grid, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { BlockchainInterface } from '../../lib/types/blockchain';
import { AccessTime, Storage, MonetizationOn, People, Memory, Speed, CheckCircle, ErrorOutline } from '@mui/icons-material';

interface BlockchainDataDisplayProps {
  network: any; // Using any to avoid strict typing issues if partial data is passed, but casting inside
}

export const BlockchainDataDisplay: React.FC<BlockchainDataDisplayProps> = ({ network: rawNetwork }) => {
  const network = rawNetwork as BlockchainInterface;

  if (!network) {
    return (
        <Paper sx={{ p: 4, bgcolor: 'rgba(10,12,16,0.8)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography color="text.secondary">Seleccione una red para ver sus datos.</Typography>
        </Paper>
    );
  }

  const { identification, blockchainProps, additionalInfo, isActive } = network;
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

  return (
    <Box sx={{ width: '100%', mb: 6 }}>
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header / Identity Section */}
            <Paper 
                elevation={0}
                sx={{ 
                    p: 3, 
                    mb: 3, 
                    background: `linear-gradient(90deg, rgba(10,12,16,0.9) 0%, ${color}15 100%)`,
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderLeft: `4px solid ${color}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Scanning Animation */}
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
                    <Avatar 
                        src={identification.image} 
                        sx={{ width: 80, height: 80, border: `2px solid ${color}` }}
                    >
                        {identification.symbol[0]}
                    </Avatar>
                 </motion.div>
                
                 <Box sx={{ zIndex: 1 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', letterSpacing: 1, lineHeight: 1 }}>
                            {identification.name}
                        </Typography>
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 10px ${color}` }} />
                        </motion.div>
                     </Box>
                     
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" variant="h6" sx={{ color, opacity: 0.8, fontWeight: 'bold' }}>{identification.symbol}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace', opacity: 0.6 }}>
                            | MODULE ID: {network.id}
                        </Typography>
                     </Box>
                 </Box>

                 {/* Status Indicator */}
                 <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                    <Chip 
                        icon={isActive ? <CheckCircle /> : <ErrorOutline />}
                        label={isActive ? "RED OPERATIVA" : "RED INACTIVA"}
                        sx={{ 
                            bgcolor: isActive ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 51, 51, 0.1)', 
                            color: isActive ? '#00ff9d' : '#ff3333',
                            border: `1px solid ${isActive ? '#00ff9d' : '#ff3333'}`,
                            fontWeight: 'bold'
                        }}
                    />
                 </Box>

                 {/* Background decoration */}
                 <Box component="img" src={identification.image} sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, width: 300, height: 300 }} alt="" />
            </Paper>

            {/* Metrics Grid */}
            <Grid container spacing={3}>
                
                {/* Economics Block */}
                <Grid item xs={12}>
                    <DataBlock title="ECONOMÍA DE RED" icon={<MonetizationOn sx={{ color }} />} color={color}>
                        <MetricRow label="Capitalización de Mercado" value={formatCurrency(blockchainProps?.marketCap)} delay={0.1} />
                        <MetricRow label="Suministro Circulante" value={formatNumber(blockchainProps?.circulatingSupply)} delay={0.2} />
                        <MetricRow label="Suministro Máximo" value={formatNumber(blockchainProps?.maxSupply)} delay={0.3} />
                        <MetricRow label="Tarifa Base" value={`${blockchainProps?.feeBase || 0} Gwei`} delay={0.4} />
                    </DataBlock>
                </Grid>

                {/* Technical Block */}
                <Grid item xs={12}>
                    <DataBlock title="MÉTRICAS TÉCNICAS" icon={<Memory sx={{ color }} />} color={color}>
                        <MetricRow label="Tiempo de Bloque" value={`${blockchainProps?.blockInterval || 0} ms`} icon={<AccessTime fontSize="small" />} delay={0.1} />
                        <MetricRow label="Dificultad" value={formatCompact(blockchainProps?.difficulty)} icon={<Speed fontSize="small" />} delay={0.2} />
                        <MetricRow label="Nodos Activos" value={`${blockchainProps?.nodeCount || 0} / ${blockchainProps?.initialNodeCount || 0}`} icon={<Storage fontSize="small" />} delay={0.3} />
                        <MetricRow label="Protocolo" value={network.chain || 'Unknown'} delay={0.4} />
                    </DataBlock>
                </Grid>

                {/* Development & Info */}
                 <Grid item xs={12}>
                    <DataBlock title="INFORMACIÓN ADICIONAL" icon={<People sx={{ color }} />} color={color}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="caption" color="text.secondary">EQUIPO DE DESARROLLO</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                    {additionalInfo?.developers?.map((dev, i) => (
                                        <Chip key={i} label={dev} size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} />
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                 <Typography variant="caption" color="text.secondary">ÚLTIMA ACTUALIZACIÓN</Typography>
                                 <Typography variant="body1" color="white">{additionalInfo?.lastUpdated ? new Date(additionalInfo.lastUpdated).toLocaleDateString() : 'Desconocida'}</Typography>
                                 
                                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>DESCRIPCIÓN</Typography>
                                 <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                     {additionalInfo?.description && additionalInfo.description[0]}
                                 </Typography>
                            </Grid>
                        </Grid>
                    </DataBlock>
                </Grid>

            </Grid>
        </motion.div>
    </Box>
  );
};

// --- Sub-Components & Helpers ---

const DataBlock = ({ title, icon, color, children }: { title: string, icon: React.ReactNode, color: string, children: React.ReactNode }) => (
    <motion.div 
        variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
        style={{ height: '100%' }}
    >
        <Paper sx={{ 
            p: 3, 
            height: '100%', 
            bgcolor: 'rgba(15, 17, 22, 0.6)', 
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
                borderColor: `${color}60`,
                boxShadow: `0 0 30px ${color}10`
            }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 2 }}>
                {icon}
                <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5 }}>
                    {title}
                </Typography>
            </Box>
            <Box>
                {children}
            </Box>
        </Paper>
    </motion.div>
);

const MetricRow = ({ label, value, icon, delay }: { label: string, value: string | number, icon?: React.ReactNode, delay: number }) => (
    <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon && <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>}
            <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
        <Typography variant="body1" color="white" fontWeight="500" sx={{ fontFamily: 'monospace' }}>
            {value}
        </Typography>
    </motion.div>
);

// Formatting Utilities
const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

const formatNumber = (value?: number) => {
    if (value === undefined || value === null) return '0';
    return new Intl.NumberFormat('en-US').format(value);
};

const formatCompact = (value?: number) => {
    if (value === undefined || value === null) return '0';
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value);
};
