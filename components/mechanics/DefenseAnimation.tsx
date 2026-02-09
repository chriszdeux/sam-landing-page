import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Distinct animation components for each phase
const AttackDetection = () => {
    // Generate random threats
    const [threats, setThreats] = useState<{id: number, angle: number, distance: number, delay: number}[]>([]);

    useEffect(() => {
        setThreats(Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            angle: Math.random() * 360,
            distance: 100 + Math.random() * 100,
            delay: Math.random() * 2
        })));
    }, []);

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Radar Sweep */}
            <motion.div
                style={{
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 51, 51, 0.3)',
                    position: 'absolute'
                }}
            />
             <motion.div
                style={{
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 51, 51, 0.2)',
                    position: 'absolute'
                }}
            />
            
            {/* Radar Line */}
            <motion.div
                style={{
                    width: 200,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 51, 51, 1) 100%)',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transformOrigin: '0% 0%'
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Central Node */}
            <Box sx={{ width: 20, height: 20, bgcolor: '#ff3333', borderRadius: '50%', zIndex: 10, boxShadow: '0 0 20px #ff3333' }} />

            {/* Threats */}
            {threats.map((threat) => (
                <motion.div
                    key={threat.id}
                    style={{
                        position: 'absolute',
                        width: 10,
                        height: 10,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transform: `rotate(${threat.angle}deg) translateX(${threat.distance}px)`
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: threat.delay, repeatDelay: 1 }}
                >
                     <Box sx={{ position: 'absolute', inset: -5, border: '1px solid red', borderRadius: '50%' }} />
                </motion.div>
            ))}

             <Typography sx={{ position: 'absolute', bottom: 40, color: '#ff3333', fontWeight: 'bold', letterSpacing: 3 }}>
                DETECTANDO AMENAZAS
            </Typography>
        </Box>
    );
};

const InformationInterception = () => {
    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* Data Stream */}
            {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: -50,
                        top: 150 + (i * 30),
                        width: 40,
                        height: 4,
                        background: '#00f3ff',
                        borderRadius: 2
                    }}
                    animate={{ 
                        x: [0, 800],
                        opacity: [0, 1, 0],
                        background: ['#00f3ff', '#00f3ff', '#ff3333'] // Corrupts midway
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.3,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Interceptor Shield */}
            <motion.div
                style={{
                    position: 'absolute',
                    right: '30%',
                    width: 4,
                    height: 300,
                    background: '#ff3333',
                    boxShadow: '0 0 30px #ff3333'
                }}
                animate={{ height: [200, 300, 200], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Lock Icon effect */}
            <motion.div
                 style={{
                    position: 'absolute',
                    right: '28%',
                    color: '#ff3333',
                    border: '2px solid #ff3333',
                    padding: 10,
                    borderRadius: 8
                 }}
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ repeat: Infinity, duration: 1 }}
            >
                <Typography variant="caption" fontWeight="bold">LOCKED</Typography>
            </motion.div>

            <Typography sx={{ position: 'absolute', bottom: 40, color: '#ff3333', fontWeight: 'bold', letterSpacing: 3 }}>
                INTERCEPTANDO PAQUETES
            </Typography>
        </Box>
    );
};

const NetworkInterruption = () => {
    // Grid of nodes
    const nodes = [
        { x: -100, y: -50 }, { x: 100, y: -50 },
        { x: -100, y: 50 }, { x: 100, y: 50 },
        { x: 0, y: 0 } // Center
    ];

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Connections */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'visible' }}>
                {nodes.map((node, i) => (
                    nodes.map((target, j) => {
                        if (i >= j) return null; // Avoid duplicates
                        return (
                            <motion.line
                                key={`${i}-${j}`}
                                x1={`calc(50% + ${node.x}px)`}
                                y1={`calc(50% + ${node.y}px)`}
                                x2={`calc(50% + ${target.x}px)`}
                                y2={`calc(50% + ${target.y}px)`}
                                stroke="#ff3333"
                                strokeWidth="2"
                                initial={{ opacity: 1 }}
                                animate={{ 
                                    opacity: [1, 0, 1, 0, 0, 1],
                                    strokeDasharray: ["0 0", "10 10", "0 0"]
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    delay: i * 0.1,
                                    times: [0, 0.1, 0.2, 0.3, 0.8, 1]
                                }}
                            />
                        );
                    })
                ))}
            </svg>

            {/* Nodes */}
            {nodes.map((node, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        x: node.x,
                        y: node.y,
                        width: 14,
                        height: 14,

                        borderRadius: '50%',
                        backgroundColor: '#ff3333'
                    }}
                    animate={{ 
                        scale: [1, 1.2, 0.8, 1],
                        filter: ["brightness(1)", "brightness(2)", "brightness(0.5)"]
                    }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
            ))}

             {/* Glitch Overlay Text */}
             <motion.div
                animate={{ x: [-2, 2, -2], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.1, repeat: Infinity }}
             >
                <Typography sx={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', color: '#ff3333', fontWeight: 'bold', letterSpacing: 3 }}>
                    RED INTERRUMPIDA
                </Typography>
             </motion.div>
        </Box>
    );
};

export const DefenseAnimation = () => {
    const [activePhase, setActivePhase] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActivePhase((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const phases = [
        <AttackDetection key="detection" />,
        <InformationInterception key="interception" />,
        <NetworkInterruption key="interruption" />
    ];

    return (
        <Box sx={{ 
            width: '100%', 
            height: 600, 
            bgcolor: 'rgba(20, 0, 0, 0.6)', 
            borderRadius: 8, 
            border: '1px solid #ff333330',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Grid Background */}
            <Box sx={{ 
                position: 'absolute', 
                inset: 0, 
                opacity: 0.1,
                backgroundImage: 'linear-gradient(#f33 1px, transparent 1px), linear-gradient(90deg, #f33 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activePhase}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', height: '100%' }}
                >
                    {phases[activePhase]}
                </motion.div>
            </AnimatePresence>

            {/* Pagination/Status Indicators */}
            <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 2 }}>
                {[0, 1, 2].map((i) => (
                    <Box 
                        key={i} 
                        sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: i === activePhase ? '#ff3333' : 'rgba(255, 51, 51, 0.2)',
                            transition: 'background-color 0.3s'
                        }} 
                    />
                ))}
            </Box>
        </Box>
    );
};
