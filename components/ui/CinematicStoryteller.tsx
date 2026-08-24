"use client";

import React, { useState, useEffect } from "react";
import {
  AnimatePresence,
  motion
} from "framer-motion";
import {
  X as CloseIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon
} from "lucide-react";
import { HistoryEvent } from "../../lib/data/history";
import Image from "next/image";
import { Typography } from "./Typography";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col overflow-hidden bg-[rgba(5,5,12,0.98)] backdrop-blur-2xl"
    >
      {/* Background Image with Ken Burns effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentIndex}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="absolute inset-0 z-0"
        >
          {currentSlide.image ? (
            <Image
              src={currentSlide.image}
              alt={currentSlide.caption || "Story Image"}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="h-full w-full" style={{ background: 'radial-gradient(circle at center, rgba(0, 243, 255, 0.1), transparent 70%)' }} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Header */}
      <div className="absolute top-0 z-10 flex w-full items-center justify-between p-6">
        <Typography variant="overline" component="p" className="font-bold tracking-[4px] text-[#00f3ff]">
          LYNCORE ARCHIVE // {currentSlide.year}
        </Typography>
        <button onClick={onClose} className="text-white transition-colors hover:text-[#ff0055]">
          <CloseIcon size={32} />
        </button>
      </div>

      {/* Content Area */}
      <div className="z-[5] flex flex-1 items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[800px] text-center"
          >
            {currentSlide.type === "intro" ? (
              <>
                <Typography variant="h1" component="p" className="mb-4 text-[3rem] font-black uppercase text-white [text-shadow:0_0_20px_rgba(255,255,255,0.5)] md:text-[5rem]">
                  {currentSlide.year}
                </Typography>
                <Typography variant="h3" component="p" className="mb-8 font-bold text-[#00f3ff]">
                  {currentSlide.title}
                </Typography>
                <Typography variant="body1" component="p" className="text-[1.2rem] leading-[1.8] text-white/70">
                  {currentSlide.description}
                </Typography>
              </>
            ) : (
              <div className="rounded-2xl border border-[#00f3ff]/30 bg-white/5 p-12 text-left backdrop-blur-md">
                <Typography variant="overline" component="p" className="mb-1 block text-[#ffb700]">
                  ESTRELLA DE DATOS
                </Typography>
                <Typography variant="h4" component="p" className="mb-6 font-bold text-white">
                  {currentSlide.heading}
                </Typography>
                {currentSlide.paragraphs?.map((p, i) => (
                  <Typography key={i} variant="body1" component="p" className="mb-4 leading-[1.8] text-white/80">
                    {p}
                  </Typography>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 z-10 flex w-full items-center justify-center gap-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded-full bg-white/5 p-2 text-white transition-colors hover:bg-[#00f3ff]/20 disabled:text-white/10"
        >
          <PrevIcon size={24} />
        </button>

        {/* Progress Bar */}
        <div className="h-1 w-[200px] overflow-hidden rounded-lg bg-white/10">
          <motion.div
            style={{ height: '100%', background: '#00f3ff' }}
            animate={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
          />
        </div>

        <button
          onClick={handleNext}
          className="rounded-full bg-white/5 p-2 text-white transition-colors hover:bg-[#00f3ff]/20"
        >
          <NextIcon size={24} />
        </button>
      </div>
    </motion.div>
  );
};
