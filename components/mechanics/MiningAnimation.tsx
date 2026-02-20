// 1-Estructuración y renderizado visual del componente UI
// 2-Estructuración y renderizado visual del componente UI
// 3-Estructuración y renderizado visual del componente UI

import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface MiningAnimationProps {
  color?: string;
}

interface CubeProps {
  size?: number;
  color?: string;
  duration?: number;
  delay?: number;
  x?: number;
  y?: number;
  id?: number;
}

const Cube = ({ size = 100, color = '#fff', duration = 10, delay = 0, x = 0, y = 0 }: CubeProps) => {
    const faceStyle = {
        position: 'absolute' as const,
        width: size,
        height: size,
        border: `1px solid ${color}`,
        backgroundColor: `${color}05`, 
        backfaceVisibility: 'visible' as const,
    };

    
    
    //# 1-Estructuración y renderizado visual del componente UI
    return (
        <motion.div
            style={{
                width: size,
                height: size,
                position: 'absolute',
                left: `calc(50% + ${x - size/2}px)`, 
                top: `calc(50% + ${y - size/2}px)`,
                transformStyle: 'preserve-3d',
            }}
            animate={{
                rotateX: [0, 360],
                rotateY: [0, 360],
                rotateZ: [0, 180],
                scale: [1, 1.05, 1], 
            }}
            transition={{
                rotateX: { duration: duration, ease: "linear", repeat: Infinity, delay: delay },
                rotateY: { duration: duration, ease: "linear", repeat: Infinity, delay: delay },
                rotateZ: { duration: duration * 1.5, ease: "linear", repeat: Infinity, delay: delay },
                scale: { duration: 4, ease: "easeInOut", repeat: Infinity, delay: delay } 
            }}
        >
             {}
             <motion.div 
                style={{ 
                    position: 'absolute', inset: 0, 
                    boxShadow: `0 0 50px ${color}20`,
                    background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
                    transform: 'translateZ(0px)'
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay }}
             />

            <div style={{ ...faceStyle, transform: `rotateY(0deg) translateZ(${size/2}px)` }} />
            <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${size/2}px)` }} />
            <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${size/2}px)` }} />
            <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${size/2}px)` }} />
            <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${size/2}px)` }} />
            <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${size/2}px)` }} />
        </motion.div>
    );
}

const EnergyBeam = ({ start, end, color, delay = 0 }: { start: {x: number, y: number}, end: {x: number, y: number}, color: string, delay?: number }) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const TRAVEL_DURATION = 2; 
    const PAUSE_DURATION = 1;  
    const PULSE_DURATION = 0.6; 

    
    
    
    
    

    
    
    //# 2-Estructuración y renderizado visual del componente UI
    return (
        <Box sx={{
            position: 'absolute',
            top: `calc(50% + ${start.y}px)`,
            left: `calc(50% + ${start.x}px)`,
            width: distance,
            height: 2,
            transformOrigin: '0 0',
            transform: `rotate(${angle}deg)`,
            pointerEvents: 'none',
            zIndex: 10
        }}>
            {}
            <motion.div
                style={{
                    width: '100%',
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
                }}
            />

             {}
             <motion.div
                style={{
                    position: 'absolute',
                    top: -4,
                    left: 0,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: color,
                    boxShadow: `0 0 15px ${color}`,
                    zIndex: 2
                }}
                animate={{
                    left: ['0%', '100%'],
                    opacity: [0, 1, 1, 0] 
                }}
                transition={{
                    duration: TRAVEL_DURATION,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                    repeatDelay: PAUSE_DURATION 
                }}
             />

             {}
             <motion.div
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: -20, 
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: `2px solid ${color}`,
                    backgroundColor: `${color}20`,
                    transform: 'translate(50%, -50%)',
                    zIndex: 1,
                    opacity: 0
                }}
                animate={{
                     scale: [0.5, 2],
                     opacity: [0, 1, 0],
                     borderWidth: ["3px", "0px"]
                }}
                transition={{
                    duration: PULSE_DURATION,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: delay + TRAVEL_DURATION, 
                    repeatDelay: (TRAVEL_DURATION + PAUSE_DURATION) - PULSE_DURATION
                }}
            />
        </Box>
    );
};

export const MiningAnimation = ({ color = '#00E5FF' }: MiningAnimationProps) => {
    
    const cubes = [
        { id: 1, size: 120, x: -200, y: -50, duration: 25 },     
        { id: 2, size: 80, x: 250, y: 80, duration: 20 },      
        { id: 3, size: 60, x: 50, y: -180, duration: 15 },     
        { id: 4, size: 50, x: -100, y: 150, duration: 18 },    
        { id: 5, size: 40, x: 300, y: -150, duration: 12 },    
    ];

    
    const connections = [
        { from: cubes[0], to: cubes[2], delay: 0 }, 
        { from: cubes[2], to: cubes[1], delay: 1.5 }, 
        { from: cubes[0], to: cubes[3], delay: 0.5 }, 
        { from: cubes[3], to: cubes[1], delay: 2 }, 
        { from: cubes[1], to: cubes[4], delay: 1 }, 
    ];

    
    
    //# 3-Estructuración y renderizado visual del componente UI
    return (
        <Box sx={{ 
            position: 'absolute', 
            inset: 0, 
            overflow: 'hidden',
            perspective: '1000px',
            opacity: 0.8,
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            zIndex: 0
        }}>
           
            {}
            {connections.map((conn, i) => (
                <EnergyBeam 
                    key={i} 
                    start={{x: conn.from.x, y: conn.from.y}} 
                    end={{x: conn.to.x, y: conn.to.y}} 
                    color={color} 
                    delay={conn.delay}
                />
            ))}

            {}
            {cubes.map((cube, i) => (
                <Cube 
                    key={cube.id}
                    {...cube}
                    color={color}
                    delay={i * 0.5} 
                />
            ))}

             {}
             <motion.div 
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    inset: -400,
                    backgroundImage: `linear-gradient(${color}15 1px, transparent 1px), linear-gradient(90deg, ${color}15 1px, transparent 1px)`,
                    backgroundSize: '100px 100px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(100px) translateZ(-200px)',
                    zIndex: -1
                }} 
             />
        </Box>
    );
};
