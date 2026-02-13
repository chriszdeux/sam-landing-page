/**
 * Menú Lateral (Drawer) para Móviles
 * Navegación responsiva
 * Información de usuario y saldo
 * Selección de red y acciones de autenticación
 */
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
import { MonetizationOn, CardGiftcard } from "@mui/icons-material";
import { Button } from "../ui/Button";
import { CountUp } from "../ui/CountUp";
import { openModal } from "../../lib/features/uiSlice";
import { navItems } from "./navItems";
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
        {navItems.map((item) => (
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
                <Typography variant="body2" sx={{ color: "primary.main", mb: 1 }}>
                  Hola, {userInfo.username}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  <MonetizationOn fontSize="small" sx={{ color: "gold" }} />
                  Créditos: <CountUp to={userInfo.balance} />
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CardGiftcard />}
                  onClick={() => {
                      dispatch(openModal('rewards'));
                      handleDrawerToggle();
                  }}
                  sx={{ mb: 1, borderColor: 'primary.main', color: 'primary.main' }}
                >
                  Recompensas
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/auth/logging-out")}
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
