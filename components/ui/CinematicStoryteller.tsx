"use client";

import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  IconButton, 
  Container,
} from "@mui/material";
import { 
  AnimatePresence, 
  motion 
} from "framer-motion";
import { 
  Close as CloseIcon, 
  ArrowBackIos as PrevIcon, 
  ArrowForwardIos as NextIcon 
} from "@mui/icons-material";
import { HistoryEvent } from "../../lib/data/history";
import Image from "next/image";

interface Slide {
  type: "intro" | "detail";
  year: string;
  title?: string;
  description?: string;
  heading?: string;
  paragraphs?: string[];
  image?: string;
  caption?: string;
}

interface CinematicStorytellerProps {
  data: HistoryEvent[];
  isOpen: boolean;
  onClose: () => void;
}

export const CinematicStoryteller: React.FC<CinematicStorytellerProps> = ({ 
  data, 
  isOpen, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Flatten the data into slides
  const slides: Slide[] = [];
  data.forEach((event) => {
    // Year Intro
    slides.push({
      type: "intro",
      year: event.year,
      title: event.title,
      description: event.description,
    });
    // Details
    event.details.forEach((detail) => {
      slides.push({
        type: "detail",
        year: event.year,
        heading: detail.heading,
        paragraphs: detail.paragraphs,
        image: detail.image,
        caption: detail.imageCaption,
      });
    });
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, onClose]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) setCurrentIndex(v => v + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(v => v - 1);
  };

  if (!isOpen) return null;

  const currentSlide = slides[currentIndex];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(5, 5, 12, 0.98)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Background Image with Ken Burns effect */}
      <AnimatePresence mode="wait">
        <Box
          key={`bg-${currentIndex}`}
          component={motion.div}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "linear" }}
          sx={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          {currentSlide.image ? (
            <Image 
              src={currentSlide.image} 
              alt={currentSlide.caption || "Story Image"} 
              fill 
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Box sx={{ width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(0, 243, 255, 0.1), transparent 70%)' }} />
          )}
        </Box>
      </AnimatePresence>

      {/* Header */}
      <Box sx={{ position: 'absolute', top: 0, width: '100%', p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <Typography variant="overline" sx={{ color: '#00f3ff', letterSpacing: 4, fontWeight: 'bold' }}>
          LYNCORE ARCHIVE // {currentSlide.year}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white', '&:hover': { color: '#ff0055' } }}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, p: 4 }}>
        <AnimatePresence mode="wait">
          <Box
            key={currentIndex}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            sx={{ maxWidth: 800, width: '100%', textAlign: 'center' }}
          >
            {currentSlide.type === "intro" ? (
              <>
                <Typography variant="h1" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', mb: 2, fontSize: { xs: '3rem', md: '5rem' }, textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>
                  {currentSlide.year}
                </Typography>
                <Typography variant="h3" sx={{ color: '#00f3ff', mb: 4, fontWeight: 'bold' }}>
                  {currentSlide.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', lineHeight: 1.8 }}>
                  {currentSlide.description}
                </Typography>
              </>
            ) : (
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.05)', 
                p: 6, 
                borderRadius: 4, 
                border: '1px solid rgba(0, 243, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                textAlign: 'left'
              }}>
                <Typography variant="overline" sx={{ color: '#ffb700', mb: 1, display: 'block' }}>
                  ESTRELLA DE DATOS
                </Typography>
                <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
                  {currentSlide.heading}
                </Typography>
                {currentSlide.paragraphs?.map((p, i) => (
                  <Typography key={i} variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, lineHeight: 1.8 }}>
                    {p}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </AnimatePresence>
      </Box>

      {/* Navigation Controls */}
      <Box sx={{ position: 'absolute', bottom: 40, width: '100%', display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center', zIndex: 10 }}>
        <IconButton 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.2)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.1)' } }}
        >
          <PrevIcon />
        </IconButton>
        
        {/* Progress Bar */}
        <Box sx={{ width: 200, height: 4, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div 
            style={{ height: '100%', background: '#00f3ff' }} 
            animate={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
          />
        </Box>

        <IconButton 
          onClick={handleNext} 
          sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.2)' } }}
        >
          <NextIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
