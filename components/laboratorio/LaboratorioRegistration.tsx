import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Typography, Button, Paper, Container, Select, MenuItem, FormControl, CircularProgress } from "@mui/material";
import { DeveloperBoard } from "@mui/icons-material";
import { MiningBackground } from "./MiningBackground";
import { useAppDispatch } from "../../lib/hooks";
import { refreshUserInfo } from "../../lib/features/auth/actions";
import api from "../../lib/api";
import { User } from "../../lib/features/auth/types";

export function LaboratorioRegistration({ userInfo }: { userInfo: User }) {
  const dispatch = useAppDispatch();
  const [labType, setLabType] = useState('MINNING');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animLines, setAnimLines] = useState<string[]>([]);
  
  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const payloadObj = {
        ownerID: userInfo.id,
        name: `Lab - ${userInfo.username || 'Main'}`,
        laboratoryType: labType 
      };
      const res = await api.post('/labs/create', payloadObj);
      // Start animation
      setIsRegistering(false);
      setShowAnimation(true);
      
      const payload = res.data;
      const lines = [
        `> INITIALIZING REGISTRATION SEQUENCE...`,
        `> POST /labs/create { ownerID: "${userInfo.id}", laboratoryType: "${labType}" }`,
        `> AWAITING RESPONSE...`,
        `> STATUS 200 OK`,
        `> MESSAGE: ${payload.message}`,
        `> LAB_ID: ${payload.laboratory?.id || 'UNKNOWN'}`,
        `> TYPE: ${payload.laboratory?.type || labType}`,
        `> CAPACITY: ${payload.laboratory?.capacity || 10}`,
        `> STATUS: ONLINE`,
        `> REDIRECTING TO DASHBOARD...`
      ];

      let currentLines: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        currentLines = [...currentLines, lines[i]];
        setAnimLines(currentLines);
      }
      
      await new Promise(r => setTimeout(r, 1000));
      // Refresh user info to get the updated idLabs and transition to dashboard
      await dispatch(refreshUserInfo()).unwrap();
    } catch (error) {
       console.error(error);
       setIsRegistering(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: 12, pb: 6, px: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1400, mx: 'auto', position: 'relative' }}>
      <MiningBackground />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, pt: 8 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {showAnimation ? (
            <Box sx={{ 
              bgcolor: 'rgba(0,0,0,0.8)', 
              p: 4, 
              borderRadius: 2, 
              border: '1px solid #00f3ff',
              boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)',
              color: '#00f3ff',
              minHeight: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              {animLines.map((line, idx) => (
                <Typography key={idx} sx={{ fontFamily: 'monospace', mb: 1.5, fontSize: '1.1rem' }}>{line}</Typography>
              ))}
              <motion.div 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ width: 12, height: 24, backgroundColor: '#00f3ff', display: 'inline-block', marginTop: 8 }}
              />
            </Box>
          ) : (
            <Paper sx={{ 
              p: 6, 
              bgcolor: 'rgba(10,12,16,0.8)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 243, 255, 0.2)',
              borderRadius: 4,
              textAlign: 'center'
            }}>
              <DeveloperBoard sx={{ fontSize: 80, color: '#00f3ff', mb: 3 }} />
              <Typography variant="h3" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                REGISTRO DE LABORATORIO
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6 }}>
                No se detectó ningún laboratorio asociado a tu cuenta. Regístralo ahora para comenzar a operar.
              </Typography>

              <FormControl fullWidth sx={{ mb: 6, textAlign: 'left' }}>
                <Typography variant="overline" sx={{ color: '#00f3ff', mb: 1, fontWeight: 'bold', fontSize: '1rem' }}>TIPO DE LABORATORIO</Typography>
                <Select
                  value={labType}
                  onChange={(e) => setLabType(e.target.value)}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    fontSize: '1.2rem',
                    py: 1,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 243, 255, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00f3ff' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00f3ff' },
                    '& .MuiSvgIcon-root': { color: '#00f3ff' }
                  }}
                  MenuProps={{ PaperProps: { sx: { bgcolor: '#12141c', border: '1px solid rgba(0, 243, 255, 0.2)' } } }}
                >
                  <MenuItem value="Mining" sx={{ color: 'white', py: 2, fontSize: '1.1rem', '&:hover': { bgcolor: 'rgba(0,243,255,0.1)' } }}>
                    Minado / Validador de transacciones
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleRegister}
                disabled={isRegistering}
                sx={{
                  py: 2.5,
                  bgcolor: 'rgba(0, 243, 255, 0.05)',
                  color: '#00f3ff',
                  border: '2px solid #00f3ff',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  letterSpacing: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(0, 243, 255, 0.15)',
                    boxShadow: '0 0 30px rgba(0, 243, 255, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {isRegistering ? <CircularProgress size={28} sx={{ color: '#00f3ff' }} /> : 'INICIAR REGISTRO'}
              </Button>
            </Paper>
          )}
        </motion.div>
      </Container>
    </Box>
  );
}
