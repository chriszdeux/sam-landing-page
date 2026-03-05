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
} from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { EnvVariables } from "../../lib/constants/variables";
import { CardGiftcard } from "@mui/icons-material";
import { Button } from "../ui/Button";
import { CountUp } from "../ui/CountUp";
import { openModal } from "../../lib/features/uiSlice";
import { navItems } from "./navItems";
import { TaoIcon } from "../ui/TaoIcon";
import { User } from "../../lib/features/auth/types";
import { BlockchainInterface } from "../../lib/types/blockchain";
import { AppDispatch } from "../../lib/store";

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
        {navItems.filter(item => userInfo || (item.path !== '/portfolio' && item.path !== '/laboratorio')).map((item) => (
          <ListItem
            key={item.id}
            disablePadding
            onClick={() => handleNavClick(item)}
          >
            <ListItemText
              primary={item.name}
              sx={{
                textAlign: "center",
                color: pathname === item.path ? "primary.main" : "inherit",
              }}
            />
          </ListItem>
        ))}
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
                    color: "text.secondary",
                    mb: 2,
                    display: "flex",
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
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CardGiftcard />}
                  onClick={() => {
                      dispatch(openModal('rewards'));
                      handleDrawerToggle();
                  }}
                  sx={{ mb: 1, borderColor: 'primary.main', color: 'primary.main', bgcolor: 'rgba(0, 243, 255, 0.05)' }}
                >
                  Recompensas
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/auth/logging-out")}
                  sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'white', color: 'white' } }}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    dispatch(openModal("login"));
                    handleDrawerToggle();
                  }}
                >
                  Entrar
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    dispatch(openModal("register"));
                    handleDrawerToggle();
                  }}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Box>
        </ListItem>
      </List>
    </Box>
  );
};
