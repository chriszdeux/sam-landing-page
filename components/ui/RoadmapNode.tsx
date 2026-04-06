"use client";

import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Cpu, 
  Share2, 
  TrendingUp, 
  CheckCircle2 
} from "lucide-react";

// Mapping string icons to Lucide components
const iconMap: Record<string, any> = {
  Rocket,
  Cpu,
  Share2,
  TrendingUp
};

interface RoadmapNodeProps {
  phase: string;
  title: string;
  status: string;
  desc: string;
  details: string[];
  icon: string;
  isActive: boolean;
  isLast: boolean;
}

export const RoadmapNode: React.FC<RoadmapNodeProps> = ({
  phase,
  title,
  status,
  desc,
  details,
  icon,
  isActive,
  isLast
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[icon] || Rocket;

  return (
    <Box
      sx={{
        position: 'relative',
        pl: { xs: 4, md: 8 },
        pb: isLast ? 0 : 8,
      }}
    >
      {/* Riel Connection Dot */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 16,
          height: 16,
          borderRadius: '50%',
          bgcolor: isActive ? '#00f3ff' : 'rgba(255,255,255,0.2)',
          border: '4px solid #05050c',
          zIndex: 5,
          boxShadow: isActive ? '0 0 10px #00f3ff' : 'none',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Card Wrapper */}
      <Box
        component={motion.div}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        layout
        animate={{
          borderColor: isActive ? 'rgba(0, 243, 255, 0.8)' : 'rgba(255,255,255,0.1)',
          boxShadow: isActive 
             ? ["0 0 10px rgba(0,243,255,0.2)", "0 0 30px rgba(0,243,255,0.4)", "0 0 10px rgba(0,243,255,0.2)"]
             : "none",
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        sx={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          border: '1px solid',
          p: 4,
          cursor: 'pointer',
          maxWidth: 600,
          transition: 'background 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.07)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
          {/* Icon Area */}
          <Box
            component={motion.div}
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              filter: isHovered ? 'brightness(1.5) drop-shadow(0 0 10px #00f3ff)' : 'brightness(1)'
            }}
            sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'rgba(0, 243, 255, 0.05)',
                color: isActive ? '#00f3ff' : 'rgba(255,255,255,0.5)' 
            }}
          >
            <IconComponent size={32} />
          </Box>

          {/* Main Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" sx={{ color: isActive ? '#00f3ff' : 'text.secondary', fontWeight: 'bold' }}>
              {phase} • {status}
            </Typography>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
              {desc}
            </Typography>

            {/* Details Expansion */}
            <AnimatePresence>
              {isHovered && (
                <Box
                  component={motion.div}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  sx={{ overflow: 'hidden' }}
                >
                  <List sx={{ mt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
                    {details.map((detail, idx) => (
                      <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 28, color: '#00f3ff' }}>
                          <CheckCircle2 size={16} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={detail} 
                          sx={{ '& span': { fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' } }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
