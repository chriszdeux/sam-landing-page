"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Cpu,
  Share2,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { Typography } from "./Typography";
import { Reveal } from "./TextReveal";

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
    <div className={`relative pl-4 md:pl-8 ${isLast ? 'pb-0' : 'pb-16'}`}>
      {/* Riel Connection Dot */}
      <div
        className="absolute left-0 top-0 z-[5] h-4 w-4 -translate-x-1/2 rounded-full border-4 border-[#05050c]"
        style={{
          backgroundColor: isActive ? '#00f3ff' : 'rgba(255,255,255,0.2)',
          boxShadow: isActive ? '0 0 10px #00f3ff' : 'none',
        }}
      />

      {/* Card Wrapper */}
      <motion.div
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
        className="max-w-[600px] cursor-pointer rounded-2xl border bg-white/[0.03] p-8 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.07]"
      >
        <div className="flex items-start gap-6">
          {/* Icon Area */}
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              filter: isHovered ? 'brightness(1.5) drop-shadow(0 0 10px #00f3ff)' : 'brightness(1)'
            }}
            className="rounded-lg bg-[#00f3ff]/5 p-4"
            style={{ color: isActive ? '#00f3ff' : 'rgba(255,255,255,0.5)' }}
          >
            <IconComponent size={32} />
          </motion.div>

          {/* Main Info */}
          <Reveal className="flex-1">
            <Typography variant="overline" component="p" className="font-bold" style={{ color: isActive ? '#00f3ff' : undefined }}>
              {phase} • {status}
            </Typography>
            <Typography variant="h5" component="p" className="mb-1 font-black text-white">
              {title}
            </Typography>
            <Typography variant="body2" component="p" className="mb-2 text-white/60">
              {desc}
            </Typography>

            {/* Details Expansion */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 border-t border-white/10 pt-4">
                    {details.map((detail, idx) => (
                      <li key={idx} className="mb-2 flex items-start gap-2">
                        <span className="mt-0.5 min-w-[28px] text-[#00f3ff]">
                          <CheckCircle2 size={16} />
                        </span>
                        <span className="text-[0.85rem] text-white/80">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </motion.div>
    </div>
  );
};
