// 1-Estructuración y renderizado visual del componente UI

'use client';
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import theme from '../lib/theme';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  
  
  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
