import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import { MiningBackground } from "./MiningBackground";
import { useAppDispatch } from "../../lib/hooks";
import { refreshUserInfo } from "../../lib/features/auth/actions";
import api from "../../lib/api";
import { User } from "../../lib/features/auth/types";
import { Typography } from "../ui/Typography";
import { Button } from "../ui/Button";

export function LaboratorioRegistration({ userInfo }: { userInfo: User }) {
  const dispatch = useAppDispatch();
  const [labType, setLabType] = useState('MINING');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animLines, setAnimLines] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const labPrice = 500;

  const handleRegister = async () => {
    setIsRegistering(true);
    setErrorMessage('');
    try {
      const payloadObj = {
        userId: userInfo.id,
        laboratoryType: labType,
        price: labPrice
      };
      const res = await api.post('/labs/buy', payloadObj);
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
    } catch (error: any) {
       console.error(error);
       setIsRegistering(false);
       if (error.response?.data?.message) {
         setErrorMessage(error.response.data.message);
       } else {
         setErrorMessage('Ocurrió un error inesperado al intentar comprar el laboratorio.');
       }
    }
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-[1400px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <MiningBackground />
      <div className="relative z-[1] mx-auto w-full max-w-[900px] pt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {showAnimation ? (
            <div className="flex min-h-[400px] flex-col justify-start rounded-lg border border-[#00f3ff] bg-black/80 p-8 text-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.2)]">
              {animLines.map((line, idx) => (
                <p key={idx} className="mb-3 font-mono text-[1.1rem]">{line}</p>
              ))}
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="mt-2 inline-block h-6 w-3 bg-[#00f3ff]"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-[#00f3ff]/20 bg-[rgba(10,12,16,0.8)] p-12 text-center backdrop-blur-md">
              <Cpu size={80} className="mx-auto mb-6 text-[#00f3ff]" />
              <Typography variant="h3" className="mb-4 font-bold text-white">
                REGISTRO DE LABORATORIO
              </Typography>
              <Typography variant="h6" className="mb-4 text-white/60">
                No se detectó ningún laboratorio asociado a tu cuenta. Adquiere uno ahora para comenzar a operar.
              </Typography>

              <Typography variant="body1" className="mb-12 font-bold text-[#00f3ff]">
                Tu Balance: {userInfo.balance || 0} Créditos
              </Typography>

              {errorMessage && (
                <Typography variant="body1" className="mb-8 rounded-lg border border-[#ff3366] bg-[#ff3366]/10 p-4 font-bold text-[#ff3366]">
                  {errorMessage}
                </Typography>
              )}

              <div className="mb-12 text-left">
                <Typography variant="overline" className="mb-2 block text-base font-bold text-[#00f3ff]">TIPO DE LABORATORIO</Typography>
                <select
                  value={labType}
                  onChange={(e) => setLabType(e.target.value)}
                  className="w-full rounded border border-[#00f3ff]/30 bg-black/50 px-3 py-2 text-lg text-white hover:border-[#00f3ff] focus:border-[#00f3ff] focus:outline-none"
                >
                  <option value="Mining">Minado / Validador de transacciones</option>
                </select>
              </div>

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
                {isRegistering ? <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#00f3ff]/30 border-t-[#00f3ff]" /> : `COMPRAR LABORATORIO (${labPrice} CRÉDITOS)`}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
