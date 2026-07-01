// 1-Definir componente de menú lateral (Drawer)
// 2-Renderizar lista de redes y navegación
// 3-Renderizar opciones de usuario o acceso

//# 1-Definir componente de menú lateral (Drawer)
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { EnvVariables } from "../../lib/constants/variables";
import { CardGiftcard, Star } from "@mui/icons-material";
import { CustomButton } from "../ui/CustomButton";
import { CountUp } from "../ui/CountUp";
import { openModal } from "../../lib/features/uiSlice";
import { navItems } from "./navItems";
import { TaoIcon } from "../ui/TaoIcon";
import { User } from "../../lib/features/auth/types";
import { BlockchainInterface } from "../../lib/types/blockchain";
import { AppDispatch } from "../../lib/store";
import { useAppSelector } from "../../lib/hooks";
import { formatHash } from "../../lib/utils/formatHash";

interface NavbarDrawerProps {
  handleDrawerToggle: () => void;
  selectedNetwork: BlockchainInterface | undefined;
  handleNetworkClick: () => void;
  handleNavClick: (item: (typeof navItems)[0]) => void;
  pathname: string;
  userInfo: User | null;
  router: AppRouterInstance;
  dispatch: AppDispatch;
}

export const NavbarDrawer: React.FC<NavbarDrawerProps> = ({
  handleDrawerToggle,
  selectedNetwork,
  handleNetworkClick,
  handleNavClick,
  pathname,
  userInfo,
  router,
  dispatch,
}) => {
  const isPoweredOn = useAppSelector((state) => state.reducerLabs.isPoweredOn);
  const currentLab = useAppSelector((state) => state.reducerLabs.currentLab);
  const chronoBurstFreqTypes = useAppSelector((state) => state.blockchain.chronoBurstFreqTypes);
  const localHash = currentLab?.energy ?? 0;
  
  //# 2-Renderizar lista de redes y navegación
  return (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, color: "primary.main" }}>
        {EnvVariables.project.toUpperCase()}
      </Typography>
      <List>
        {selectedNetwork && (
          <ListItem disablePadding onClick={handleNetworkClick}>
            <ListItemText
              primary={selectedNetwork.identification.name}
              sx={{
                textAlign: "center",
                color: selectedNetwork.additionalInfo.color,
                cursor: "pointer",
              }}
            />
          </ListItem>
        )}
        <ListItem disablePadding>
          <Box
            sx={{
              width: "100%",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              mb: 1,
            }}
          />
        </ListItem>
        {navItems.filter(item => !item.auth || userInfo).map((item) => {
          const isActive = pathname === item.path;
          const isOperations = item.id === 'dashboard';
          const formattedHash = formatHash(localHash, chronoBurstFreqTypes);
          const tooltipText = `Hash Acumulado Local: ${formattedHash}`;
          
          const itemTextSx = {
            textAlign: "center",
            color: isActive ? "primary.main" : "inherit",
            p: 1.5,
            borderRadius: 1,
            transition: 'all 0.3s ease',
            ...(isOperations && isPoweredOn ? {
              '@keyframes pulseGold': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(212, 163, 115, 0.4)',
                  borderColor: 'rgba(212, 163, 115, 0.4)',
                },
                '70%': {
                  boxShadow: '0 0 0 6px rgba(212, 163, 115, 0)',
                  borderColor: 'rgba(230, 197, 148, 0.7)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(212, 163, 115, 0)',
                  borderColor: 'rgba(212, 163, 115, 0.4)',
                }
              },
              animation: 'pulseGold 2s infinite ease-in-out',
              border: '1px solid #D4A373',
              background: 'linear-gradient(45deg, rgba(212, 163, 115, 0.05), rgba(230, 197, 148, 0.1))',
              color: '#E6C594',
            } : {})
          };

          const itemContent = (
            <ListItemText
              primary={item.name}
              sx={itemTextSx}
            />
          );

          return (
            <ListItem
              key={item.id}
              disablePadding
              onClick={() => handleNavClick(item)}
              sx={{ mb: 0.5, px: 2 }}
            >
              {isOperations ? (
                <Tooltip 
                  title={tooltipText} 
                  arrow 
                  placement="right"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'rgba(10, 10, 10, 0.95)',
                        border: '1px solid rgba(212, 163, 115, 0.3)',
                        color: '#E6C594',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
                        fontWeight: 'bold',
                        p: 1
                      }
                    },
                    arrow: {
                      sx: {
                        color: 'rgba(10, 10, 10, 0.95)'
                      }
                    }
                  }}
                >
                  <div style={{ width: '100%' }}>{itemContent}</div>
                </Tooltip>
              ) : itemContent}
            </ListItem>
          );
        })}
        <ListItem disablePadding>
          {/* //# 3-Renderizar opciones de usuario o acceso */}
          <Box
            sx={{
              p: 2,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {userInfo ? (
              <>
                  <Typography variant="body2" sx={{ color: "primary.main", mb: 1, fontWeight: 'bold' }}>
                  {'// USUARIO:'} {userInfo.username}
                </Typography>
                <Box
                  sx={{
                    display: 'none', // Ocultar por orden del PM
                    color: "text.secondary",
                    mb: 2,
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                    bgcolor: 'rgba(0, 243, 255, 0.05)',
                    p: 1,
                    borderRadius: 1,
                    border: '1px solid rgba(0, 243, 255, 0.1)'
                  }}
                >
                  <TaoIcon size={20} />
                  <Typography variant="body2" sx={{ color: '#00f3ff', fontWeight: 'bold' }}>
                     TAO: <CountUp to={userInfo.balance} />
                  </Typography>
                </Box>
                <CustomButton
                  variant="info"
                  fullWidth
                  startIcon={<CardGiftcard />}
                  onClick={() => {
                      dispatch(openModal('rewards'));
                      handleDrawerToggle();
                  }}
                  sx={{ 
                      display: 'none', // Ocultar por orden del PM
                      mb: 1, 
                  }}
                >
                  Recompensas
                </CustomButton>
                <CustomButton
                  variant="neutral"
                  fullWidth
                  onClick={() => router.push("/auth/logging-out")}
                >
                  Cerrar Sesión
                </CustomButton>
              </>
            ) : (
              <>
                <CustomButton
                  variant="neutral"
                  fullWidth
                  onClick={() => {
                    dispatch(openModal("login"));
                    handleDrawerToggle();
                  }}
                  sx={{ mb: 1 }}
                >
                  Entrar
                </CustomButton>
                <CustomButton
                  variant="warning"
                  fullWidth
                  onClick={() => {
                    dispatch(openModal("register"));
                    handleDrawerToggle();
                  }}
                  glow
                >
                  Registrarse
                </CustomButton>
              </>
            )}
          </Box>
        </ListItem>
      </List>
    </Box>
  );
};
