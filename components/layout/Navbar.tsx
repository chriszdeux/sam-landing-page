"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Rocket,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { setCurrentSection } from "../../lib/features/uiSlice";
import { fetchWalletDetails } from "../../lib/features/auth/actions"; // Import action
import { navItems } from "./navItems";
import { NavbarDrawer } from "./NavbarDrawer";
import { LogoutDialog } from "./LogoutDialog";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { CONFIG } from "../../lib/config";




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
          router.push(`/network`);
          setMobileOpen(false);
      }
  };



  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "rgba(5, 5, 12, 0.8)", // Darker tech background
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0, 243, 255, 0.1)",
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.8)", 
          height: '80px', 
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      >
        {/* Decorative Top Line */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #00f3ff, transparent)', opacity: 1, boxShadow: '0 0 15px #00f3ff' }} />
        
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              cursor: "pointer",
            }}
            onClick={() => handleNavClick(navItems[0])}
          >
            <Box sx={{ 
                mr: 2, 
                p: 1, 
                border: '1px solid rgba(0, 243, 255, 0.3)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0, 243, 255, 0.15)',
                bgcolor: 'rgba(0, 243, 255, 0.05)'
            }}>
                <Rocket sx={{ color: "primary.main", fontSize: 24, filter: 'drop-shadow(0 0 5px #00f3ff)' }} />
            </Box>
            <Box>
                <Typography
                variant="h6"
                component="div"
                sx={{ 
                    fontWeight: "900", 
                    letterSpacing: 2, 
                    lineHeight: 1,
                    background: 'linear-gradient(90deg, #fff, #00f3ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5
                }}
                >
                {CONFIG.PROJECT_NAME.toUpperCase()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(0, 243, 255, 0.7)', letterSpacing: 3, fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#00f3ff', boxShadow: '0 0 5px #00f3ff' }} />
                    SYSTEM ONLINE
                </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              alignItems: "center",
              ml: 2,
              p: 0.5,
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              bgcolor: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(5px)'
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
                                inset: 0,
                                background: 'rgba(0, 243, 255, 0.1)',
                                borderRadius: '8px',
                                border: '1px solid rgba(0, 243, 255, 0.3)',
                            }}
                        />
                    )}
                  <Button
                    variant="text"
                    onClick={() => handleNavClick(item)}
                    sx={{
                      color: isActive ? "primary.main" : "rgba(255,255,255,0.6)",
                      fontWeight: isActive ? 'bold' : 'normal',
                      "&:hover": { color: "primary.main" },
                      position: 'relative',
                      zIndex: 1,
                      borderBottom: 'none',
                      borderRadius: 2,
                      minWidth: 'auto',
                      px: 3,
                      py: 1,
                      letterSpacing: 1
                    }}
                  >
                    {item.name}
                  </Button>
                </Box>
              );
            })}
          </Box>

            {/* Separator */}
            <Box sx={{ 
                height: 30, 
                width: '1px', 
                bgcolor: 'rgba(255,255,255,0.1)', 
                mx: 2,
                display: { xs: "none", md: "block" }
            }} />

            {/* User Menu */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <NavbarUserMenu 
                    userInfo={userInfo}
                    selectedNetwork={selectedNetwork}
                    handleNetworkClick={handleNetworkClick}
                    onLogoutClick={() => setLogoutConfirmOpen(true)}
                />
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

      <LogoutDialog 
        open={logoutConfirmOpen} 
        onClose={() => setLogoutConfirmOpen(false)} 
        onConfirm={() => router.push('/auth/logging-out')}
      />
    </Box>
  );
};
