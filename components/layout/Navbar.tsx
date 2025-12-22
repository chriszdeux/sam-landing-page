"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Stack,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Rocket,
  Person as UserIcon,
  MonetizationOn,
  Settings,
  Logout,
  Bolt,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { CountUp } from "../ui/CountUp";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { setCurrentSection, openModal } from "../../lib/features/uiSlice";
import { fetchWalletDetails } from "../../lib/features/auth/actions"; // Import action
import { navItems } from "./navItems";
import { NavbarDrawer } from "./NavbarDrawer";



export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { userInfo, walletsInfo } = useAppSelector((state) => state.auth);
  // const currentSection = useAppSelector((state) => state.ui.currentSection);
  const { networks, selectedNetwork: selectedNetworkState } = useAppSelector((state) => state.blockchain);

  const pathname = usePathname();
  const router = useRouter();

  const selectedNetwork = networks.find(n => n.id === selectedNetworkState?.id) || networks[0];

  // Fetch Wallet Details if logged in
  React.useEffect(() => {
      if (userInfo && userInfo.wallets && userInfo.wallets.length > 0) {
          const primaryWallet = userInfo.wallets[0];
          // If details are missing, fetch them.
          if (!walletsInfo) {
               dispatch(fetchWalletDetails(primaryWallet.walletAddress));
          }
      }
  }, [userInfo, dispatch, walletsInfo]);

  // Hide Navbar on auth transition pages
  if (pathname === '/auth/logging-in' || pathname === '/auth/logging-out' || pathname.includes('/connecting')) {
    return null;
  }

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.path === "/") {
      if (pathname !== "/") {
        router.push("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      dispatch(setCurrentSection("home"));
    } else {
      router.push(item.path);
      dispatch(setCurrentSection(item.id));
    }
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
    
  const handleNetworkClick = () => {
      if (selectedNetwork) {
          router.push(`/network/${selectedNetwork.id}`);
          setMobileOpen(false);
      }
  };



  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "rgba(10, 10, 20, 0.6)", // More transparent and darker
          backdropFilter: "blur(20px)", // Stronger blur
          borderBottom: "1px solid rgba(0, 243, 255, 0.1)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)", 
          height: '70px', 
          justifyContent: 'center'
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              cursor: "pointer",
            }}
            onClick={() => handleNavClick(navItems[0])}
          >
            <Rocket sx={{ color: "primary.main", mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold", letterSpacing: 1 }}
            >
              PROYECTO SAM
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
              ml: 2,
            }}
          >
            {navItems.filter(item => userInfo || item.path !== '/portfolio').map((item) => {
              const isActive = pathname === item.path;
              return (
                <Box key={item.id} sx={{ position: 'relative' }}>
                    {isActive && (
                        <motion.div
                            layoutId="navbar-indicator"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '2px', 
                                background: 'linear-gradient(90deg, transparent, #00f3ff, transparent)',
                                boxShadow: '0 0 15px #00f3ff, 0 0 5px #00f3ff',
                                borderRadius: '4px',
                            }}
                        />
                    )}
                  <Button
                    variant="text"
                    onClick={() => handleNavClick(item)}
                    sx={{
                      color: isActive ? "primary.main" : "text.secondary",
                      "&:hover": { color: "primary.main" },
                      position: 'relative',
                      zIndex: 1,
                      borderBottom: 'none',
                      borderRadius: 0,
                    }}
                  >
                    {item.name}
                  </Button>
                </Box>
              );
            })}

            {userInfo ? (
              <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <UserIcon fontSize="small" />
                    {userInfo.username}
                  </Typography>
                <Typography
                  component="div"
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mr: 1,
                  }}
                >
                  <Box sx={{ 
                      bgcolor: 'rgba(0, 0, 0, 0.4)', 
                      px: 2, 
                      py: 0.5, 
                      borderRadius: 2, 
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                  }}>
                    <MonetizationOn fontSize="small" sx={{ color: "gold" }} />
                    <CountUp to={userInfo.balance} />
                  </Box>
                </Typography>
                
                {selectedNetwork && (
                    <Tooltip title="Cambiar Red">
                    <Button 
                        onClick={handleNetworkClick}
                        startIcon={<Bolt sx={{ color: selectedNetwork.additionalInfo.color }} />}
                        variant="outlined"
                        sx={{
                            borderColor: `${selectedNetwork.additionalInfo.color}80`,
                            color: 'white',
                            bgcolor: `${selectedNetwork.additionalInfo.color}10`,
                            borderRadius: '20px',
                            textTransform: 'none',
                            px: 2,
                            minWidth: 'auto',
                            '&:hover': {
                                bgcolor: `${selectedNetwork.additionalInfo.color}30`,
                                borderColor: selectedNetwork.additionalInfo.color,
                                boxShadow: `0 0 15px ${selectedNetwork.additionalInfo.color}60`
                            }
                        }}
                    >
                         {selectedNetwork.identification.symbol}
                    </Button>
                    </Tooltip>
                )}

                <IconButton onClick={() => router.push('/settings')} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', transform: 'rotate(90deg)', transition: 'all 0.3s' } }}>
                    <Settings />
                </IconButton>

                <IconButton 
                  onClick={() => setLogoutConfirmOpen(true)}
                  sx={{ color: 'error.main', '&:hover': { bgcolor: 'rgba(255,0,0,0.1)' } }}
                >
                  <Logout />
                </IconButton>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => dispatch(openModal("login"))}
                >
                  Entrar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => dispatch(openModal("register"))}
                >
                  Registrarse
                </Button>
              </Stack>
            )}

          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              bgcolor: "background.default",
            },
          }}
        >
          <NavbarDrawer
            handleDrawerToggle={handleDrawerToggle}
            selectedNetwork={selectedNetwork}
            handleNetworkClick={handleNetworkClick}

            handleNavClick={handleNavClick}
            pathname={pathname}
            userInfo={userInfo}
            router={router}
            dispatch={dispatch}
          />
        </Drawer>
      </Box>

      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        PaperProps={{
            sx: {
                bgcolor: '#0a0a1a',
                border: '1px solid rgba(0, 243, 255, 0.3)',
                boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)',
                backdropFilter: 'blur(10px)',
            }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>¿Confirmar cierre de sesión?</DialogTitle>
        <DialogContent>
            <Typography sx={{ color: 'text.secondary' }}>
                Estás a punto de desconectarte del sistema.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setLogoutConfirmOpen(false)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
            <Button onClick={() => { setLogoutConfirmOpen(false); router.push('/auth/logging-out'); }} color="error" variant="contained">Cerrar Sesión</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
