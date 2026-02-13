/**
 * Componente Marco Tecnológico
 * Contenedor con bordes y efectos de sci-fi
 * Incluye efectos de scanline y hover
 */
import { Box, BoxProps } from '@mui/material';

interface TechFrameProps extends BoxProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export const TechFrame = ({ children, color = '#ff0055', className, sx, ...props }: TechFrameProps) => (
  <Box
    className={className}
    {...props}
    sx={{
      position: 'relative',
      p: '4px',
      background: `linear-gradient(45deg, transparent 5%, ${color} 5%, ${color} 10%, transparent 10%, transparent 90%, ${color} 90%, ${color} 95%, transparent 95%)`,
      filter: `drop-shadow(0 0 5px ${color}80)`,
      transition: 'all 0.3s ease',
      cursor: props.onClick ? 'pointer' : 'default',
      '&:hover': {
        filter: `drop-shadow(0 0 10px ${color})`,
        transform: 'translateY(-5px)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: `1px solid ${color}40`,

        pointerEvents: 'none',
        transition: 'all 0.3s ease',
      },
      '&:hover::before': {
        borderColor: `${color}80`,
        borderWidth: '2px',
      },
      ...sx
    }}
  >
    <Box sx={{ 
      position: 'relative', 

      bgcolor: 'rgba(10,10,10,0.8)',
      backdropFilter: 'blur(10px)',
      height: '100%',
    }}>
      {children}

      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: `linear-gradient(to bottom, transparent 50%, ${color}10 50%)`,
        backgroundSize: '100% 4px',
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.5,
      }} />
    </Box>
  </Box>
);
