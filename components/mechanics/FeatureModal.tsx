// 1-Lógica principal y renderizado del módulo

import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog } from '../ui/Dialog';
import { Typography } from '../ui/Typography';

export const FeatureModal = ({ open, onClose, title, description, content, image, color }: { open: boolean; onClose: () => void; title: string; description: string; content?: string; image?: string; color: string }) => (
  <Dialog
    open={open}
    onClose={onClose}
    className="mx-4 w-[90%] max-w-[800px]"
  >
    <div
      className="relative flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-2xl outline-none md:flex-row"
      style={{
        backgroundColor: '#1a1a1a',
        border: `1px solid ${color}`,
        boxShadow: `0 0 50px ${color}20`,
      }}
    >
      <button
        onClick={onClose}
        className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/80"
      >
        <X size={20} />
      </button>

      {image && (
        <div className="relative h-[200px] w-full overflow-hidden md:h-auto md:w-[40%]">
            <motion.img
              src={image}
              alt={title}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1.2, x: [0, -10, 0], y: [0, -5, 0] }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${color}20, transparent)` }} />
        </div>
      )}

      <div className="flex-1 p-6 md:p-10">
        <Typography variant="overline" className="font-bold tracking-[2px]" style={{ color }}>
            DETALLE DEL SISTEMA
        </Typography>
        <Typography variant="h4" className="mb-6 mt-2 font-bold text-white">
            {title}
        </Typography>

        {content ? (
            content.split('\n\n').map((paragraph, index) => (
                <Typography key={index} variant="body1" component="p" className="mb-4 text-[1.05rem] leading-[1.8] text-foreground-muted">
                    {paragraph}
                </Typography>
            ))
        ) : (
            <Typography variant="body1" className="leading-[1.8] text-foreground-muted">
                {description}
            </Typography>
        )}
      </div>
    </div>
  </Dialog>
);
