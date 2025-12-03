'use client';
import { createTheme, alpha } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff', // White
    },
    secondary: {
      main: '#00efcb', // Cyan/Teal
    },
    error: {
      main: '#ef9a9a', // Pastel Red
    },
    warning: {
      main: '#ffcc80', // Pastel Orange
    },
    info: {
      main: '#90caf9', // Pastel Blue
    },
    success: {
      main: '#a5d6a7', // Pastel Green
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ededed',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontWeight: 700,
      textShadow: '0 0 10px #ffffff, 0 0 20px #ffffff',
    },
    h2: {
      fontWeight: 700,
      textShadow: '0 0 10px #00efcb, 0 0 20px #00efcb',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Sharper corners from sam-mvp
          padding: '8px 16px', // Padding from sam-mvp
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          color: '#000',
          '&:hover': {
            backgroundColor: '#e0e0e0',
            boxShadow: '0 0 10px #ffffff',
          },
        },
        containedSecondary: {
          color: '#000',
          '&:hover': {
            backgroundColor: '#33ffdd',
            boxShadow: '0 0 10px #00efcb',
          },
        },
        outlined: {
          borderColor: '#ffffff',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: '#ffffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '2px',
          border: '1px solid #333333',
          padding: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          '& .MuiInputBase-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 4,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: '#ffffff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff',
              boxShadow: '0 0 5px #ffffff',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#b3b3b3',
            '&.Mui-focused': {
              color: '#ffffff',
            },
          },
        }),
      },
    },
  },
});

export default theme;
