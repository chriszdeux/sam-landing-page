'use client';

import React, { useEffect, useState } from 'react';
import { IconButton, Box } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { usePathname } from 'next/navigation';

const sections = ['home', 'history', 'mechanics', 'resources', 'architecture'];

export const SectionNavigation = () => {
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      // Find the section that is currently most visible
      const sectionElements = sections.map(id => document.getElementById(id));
      
      let maxVisibleHeight = 0;
      let winningIndex = 0;

      sectionElements.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        
        // Calculate visible height
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(window.innerHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          winningIndex = index;
        }
      });
      
      if (maxVisibleHeight > 0) {
        setCurrentIndex(winningIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Call once to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  if (pathname !== '/') return null;

  const handleScrollTo = (index: number) => {
    if (index < 0 || index >= sections.length) return;
    const id = sections[index];
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      zIndex: 50,
      bgcolor: 'rgba(0,0,0,0.5)',
      borderRadius: '24px',
      padding: '4px',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <IconButton 
        onClick={() => handleScrollTo(currentIndex - 1)}
        disabled={currentIndex === 0}
        sx={{ 
          color: 'primary.main',
          '&:disabled': { color: 'rgba(255,255,255,0.1)' },
          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
        }}
      >
        <KeyboardArrowUp />
      </IconButton>
      <IconButton 
        onClick={() => handleScrollTo(currentIndex + 1)}
        disabled={currentIndex === sections.length - 1}
        sx={{ 
          color: 'primary.main',
          '&:disabled': { color: 'rgba(255,255,255,0.1)' },
          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
        }}
      >
        <KeyboardArrowDown />
      </IconButton>
    </Box>
  );
};
