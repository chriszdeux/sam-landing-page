// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Gestión de estado local para current index
// 3-Efecto secundario para sincronización del ciclo de vida
// 4-Manejo de lógica de usuario para handleScroll
// 5-Estructuración y renderizado visual del componente UI
// 6-Manejo de lógica de usuario para handleScrollTo
// 7-Estructuración y renderizado visual del componente UI

'use client';

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useEffect, useState } from 'react';
import { IconButton, Box } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { usePathname } from 'next/navigation';

const sections = ['home', 'history', 'mechanics'];

export const SectionNavigation = () => {
  const pathname = usePathname();
  
  
  //# 2-Gestión de estado local para current index
  const [currentIndex, setCurrentIndex] = useState(0);

  
  
  //# 3-Efecto secundario para sincronización del ciclo de vida
  useEffect(() => {
    if (pathname !== '/') return;

    
    
    //# 4-Manejo de lógica de usuario para handleScroll
    const handleScroll = () => {
      const sectionElements = sections.map(id => document.getElementById(id));
      
      let maxVisibleHeight = 0;
      let winningIndex = 0;

      sectionElements.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        

        
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

    handleScroll();
    
    
    
    //# 5-Estructuración y renderizado visual del componente UI
    return () => window.removeEventListener('scroll', handleScroll);
    

  }, [pathname]);

  if (pathname !== '/') return null;

  
  
  //# 6-Manejo de lógica de usuario para handleScrollTo
  const handleScrollTo = (index: number) => {
    if (index < 0 || index >= sections.length) return;
    const id = sections[index];
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  
  
  //# 7-Estructuración y renderizado visual del componente UI
  return (
    <Box sx={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      display: { xs: 'none', md: 'flex' },
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
