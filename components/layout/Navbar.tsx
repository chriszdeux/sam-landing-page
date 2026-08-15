// 1-Importar dependencias y componentes de UI
// 2-Definir componente y estados locales
// 3-Obtener datos de Redux y hooks
// 4-Efecto para sincronizar detalles de billetera y polling de poder
// 5-Funciones para manejar eventos de usuario
// 6-Renderizar estructura principal de la barra


"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu as MenuIcon, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { Drawer } from "../ui/Drawer";
import { Tooltip } from "../ui/Tooltip";

//# 1-Importar dependencias y componentes de UI
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { setCurrentSection } from "../../lib/features/uiSlice";
import { fetchWalletDetails } from "../../lib/features/auth/actions";
import { navItems } from "./navItems";
import { NavbarDrawer } from "./NavbarDrawer";
import { LogoutDialog } from "./LogoutDialog";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { LabNavbarIndicator } from "./LabNavbarIndicator";
import { formatHash } from "../../lib/utils/formatHash";
import { EnvVariables } from "@/lib/constants/variables";

export const Navbar = () => {

  //# 2-Definir componente y estados locales
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  //# 3-Obtener datos de Redux y hooks
  const dispatch = useAppDispatch();
  const { userInfo, walletsInfo } = useAppSelector((state) => state.auth);
  const { networks, selectedNetwork: selectedNetworkState } = useAppSelector((state) => state.blockchain);
  const isPoweredOn = useAppSelector((state) => state.reducerLabs.isPoweredOn);
  const currentLab = useAppSelector((state) => state.reducerLabs.currentLab);
  const chronoBurstFreqTypes = useAppSelector((state) => state.blockchain.chronoBurstFreqTypes);
  const localHash = currentLab?.energy ?? 0;

  const pathname = usePathname();
  const router = useRouter();

  const selectedNetwork = networks.find(n => n.id === selectedNetworkState?.id) || networks[0];



  //# 4-Efecto para sincronizar detalles de la billetera y polling de poder



  if (
    pathname === '/auth/logging-in' ||
    pathname === '/auth/logging-out' ||
    pathname.includes('/connecting') ||
    pathname === '/exploracion-infinita'
  ) {
    return null;
  }



  //# 5-Funciones para manejar eventos de usuario
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



  //# 6-Renderizar estructura principal de la barra
  return (
    <div className="grow">
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-center border-b border-[#00f3ff]/10 bg-[rgba(5,5,12,0.8)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl [background-image:linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] [background-size:30px_30px]"
      >
        { }
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent shadow-[0_0_15px_#00f3ff]" />

        <div className="flex w-full items-center px-4 md:px-8">

          <div
            className="flex grow cursor-pointer items-center"
            onClick={() => handleNavClick(navItems[0])}
          >
            <div className="mr-4 flex items-center justify-center rounded-lg border border-[#00f3ff]/30 bg-[#00f3ff]/5 p-2 shadow-[0_0_15px_rgba(0,243,255,0.15)]">
              <Rocket size={24} className="text-primary [filter:drop-shadow(0_0_5px_#00f3ff)]" />
            </div>
            <div>
              <Typography
                variant="h6"
                component="div"
                className="mb-1 bg-gradient-to-r from-white to-[#00f3ff] bg-clip-text font-black tracking-[2px] leading-none text-transparent [-webkit-text-fill-color:transparent]"
              >
                {EnvVariables.project.toUpperCase()}
              </Typography>
              <Typography variant="caption" className="flex items-center gap-2 text-[0.6rem] tracking-[3px] text-[#00f3ff]/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00f3ff] shadow-[0_0_5px_#00f3ff]" />
                SYSTEM ONLINE
              </Typography>
            </div>
          </div>



          <div
            className="ml-4 hidden items-center gap-1 rounded-xl border border-white/[0.08] bg-black/30 p-1 backdrop-blur-sm md:flex"
          >
            {navItems.filter(item => !item.auth || userInfo).map((item) => {
              const isActive = pathname === item.path;
              const isOperations = item.id === 'dashboard';
              const formattedHash = formatHash(localHash, chronoBurstFreqTypes);
              const tooltipText = `Hash Acumulado Local: ${formattedHash}`;

              const buttonSx = {
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
                letterSpacing: 1,
                ...(isOperations && isPoweredOn ? {
                  '@keyframes pulseGold': {
                    '0%': {
                      boxShadow: '0 0 0 0 rgba(212, 163, 115, 0.5)',
                      borderColor: 'rgba(212, 163, 115, 0.5)',
                    },
                    '70%': {
                      boxShadow: '0 0 0 8px rgba(212, 163, 115, 0)',
                      borderColor: 'rgba(230, 197, 148, 0.8)',
                    },
                    '100%': {
                      boxShadow: '0 0 0 0 rgba(212, 163, 115, 0)',
                      borderColor: 'rgba(212, 163, 115, 0.5)',
                    }
                  },
                  animation: 'pulseGold 2s infinite ease-in-out',
                  border: '1px solid #D4A373',
                  background: 'linear-gradient(45deg, rgba(212, 163, 115, 0.1), rgba(230, 197, 148, 0.15))',
                  color: '#E6C594',
                  '&:hover': {
                    color: '#fff',
                    borderColor: '#E6C594',
                    background: 'linear-gradient(45deg, rgba(212, 163, 115, 0.2), rgba(230, 197, 148, 0.25))',
                  }
                } : {})
              };

              const buttonContent = (
                <Button
                  variant="text"
                  onClick={() => handleNavClick(item)}
                  sx={buttonSx}
                >
                  {item.name}
                </Button>
              );

              return (
                <div key={item.id} className="relative">
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
                  {isOperations ? (
                    <Tooltip
                      content={tooltipText}
                      side="bottom"
                      className="border-[rgba(212,163,115,0.3)] bg-[rgba(10,10,10,0.95)] p-3 font-bold text-[#E6C594] shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                    >
                      <span>{buttonContent}</span>
                    </Tooltip>
                  ) : buttonContent}
                </div>
              );
            })}
          </div>

          <div className="mx-4 hidden h-[30px] w-px bg-white/10 md:block" />

          <div className="hidden items-center gap-4 md:flex">
            {userInfo && <LabNavbarIndicator />}
            <NavbarUserMenu
              userInfo={userInfo}
              onLogoutClick={() => setLogoutConfirmOpen(true)}
            />
          </div>

          <button
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className="rounded p-2 text-white md:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </header>
      <nav>
        <Drawer open={mobileOpen} onClose={handleDrawerToggle} side="left" className="md:hidden">
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
      </nav>

      <LogoutDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={() => router.push('/auth/logging-out')}
      />
    </div>
  );
};
