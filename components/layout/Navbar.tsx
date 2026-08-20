// 1-Importar dependencias y componentes de UI
// 2-Definir componente y estados locales
// 3-Obtener datos de Redux y hooks
// 4-Efecto para sincronizar detalles de billetera y polling de poder
// 5-Funciones para manejar eventos de usuario
// 6-Renderizar estructura principal de la barra


"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu as MenuIcon, Rocket, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Typography } from "../ui/Typography";
import { Drawer } from "../ui/Drawer";
import { Tooltip } from "../ui/Tooltip";
import { Dropdown } from "../ui/Dropdown";
import { NavLabel } from "./NavLabel";

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
import { cn } from "@/lib/utils/cn";

// Los items ya separan con su propio padding horizontal, la fila no usa gap.
const NAV_GAP = 0;

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

  const visibleNavItems = navItems.filter(item => !item.auth || userInfo);

  //# 4-Medir el ancho disponible y decidir cuántos items caben antes de desbordar a "Más"
  const navRowRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const moreMeasureRef = useRef<HTMLButtonElement>(null);
  const [visibleCount, setVisibleCount] = useState(visibleNavItems.length);

  useEffect(() => {
    const recalc = () => {
      const row = navRowRef.current;
      if (!row) return;
      const available = row.clientWidth;
      const widths = measureRefs.current.map((el) => el?.offsetWidth ?? 0);
      const moreWidth = (moreMeasureRef.current?.offsetWidth ?? 0) + NAV_GAP;

      let total = 0;
      let count = widths.length;
      for (let i = 0; i < widths.length; i++) {
        total += widths[i] + (i > 0 ? NAV_GAP : 0);
        const hasRemaining = i < widths.length - 1;
        const budget = available - (hasRemaining ? moreWidth : 0);
        if (total > budget) {
          count = i;
          break;
        }
      }
      setVisibleCount(count);
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    if (navRowRef.current) ro.observe(navRowRef.current);
    window.addEventListener("resize", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [visibleNavItems.length]);

  const shownItems = visibleNavItems.slice(0, visibleCount);
  const overflowItems = visibleNavItems.slice(visibleCount);
  const activeInOverflow = overflowItems.some((item) => pathname === item.path);



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

  const renderNavButton = (item: (typeof navItems)[0]) => {
    const isActive = pathname === item.path;
    const isOperations = item.id === 'dashboard';
    const formattedHash = formatHash(localHash, chronoBurstFreqTypes);
    const tooltipText = `Hash Acumulado Local: ${formattedHash}`;
    const state = isOperations && isPoweredOn ? 'alert' : isActive ? 'active' : 'rest';

    const buttonContent = (
      <NavLabel state={state} onClick={() => handleNavClick(item)}>
        {item.name}
      </NavLabel>
    );

    return (
      <div key={item.id} className="relative">
        {isOperations ? (
          <Tooltip
            content={tooltipText}
            side="bottom"
            className="border-[rgba(212,163,115,0.25)] bg-[rgba(8,8,14,0.96)] px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#E6C594] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.9)]"
          >
            <span>{buttonContent}</span>
          </Tooltip>
        ) : buttonContent}
        {/* Indicador activo: hairline de 1px que se desliza entre ítems */}
        {isActive && (
          <motion.div
            layoutId="navbar-indicator"
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            className="pointer-events-none absolute inset-x-2 bottom-0 h-px bg-[#00f3ff]"
            style={{ boxShadow: '0 0 8px rgba(0,243,255,0.8)' }}
          />
        )}
      </div>
    );
  };

  //# 6-Renderizar estructura principal de la barra
  return (
    <div className="grow">
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-center border-b border-white/[0.06] bg-[rgba(5,5,12,0.85)] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
      >
        {/* Hairline superior de identidad, atenuada para no competir con los items */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00f3ff]/50 to-transparent" />

        <div className="flex w-full items-center gap-3 px-4 md:px-6">

          <div
            className="flex shrink-0 cursor-pointer items-center"
            onClick={() => handleNavClick(navItems[0])}
          >
            <div className="mr-3 flex items-center justify-center rounded-[3px] border border-[#00f3ff]/20 bg-[#00f3ff]/[0.04] p-1.5">
              <Rocket size={18} className="text-[#00f3ff]" />
            </div>
            <div className="hidden sm:block">
              <Typography
                variant="h6"
                component="div"
                className="mb-1 bg-gradient-to-r from-white to-[#00f3ff] bg-clip-text text-[0.9375rem] font-black tracking-[0.16em] leading-none text-transparent [-webkit-text-fill-color:transparent]"
              >
                {EnvVariables.project.toUpperCase()}
              </Typography>
              <Typography variant="caption" className="flex items-center gap-1.5 text-[0.5rem] font-semibold leading-none tracking-[0.24em] text-[#00f3ff]/60">
                <span className="h-[3px] w-[3px] rounded-full bg-[#00f3ff]" />
                SYSTEM ONLINE
              </Typography>
            </div>
          </div>

          {/* Fila de navegación: mide su ancho disponible y desborda a "Más" */}
          <div
            ref={navRowRef}
            className="hidden min-w-0 flex-1 items-center self-stretch md:flex"
          >
            {shownItems.map(renderNavButton)}

            {overflowItems.length > 0 && (
              <Dropdown
                align="left"
                trigger={({ open }) => (
                  <NavLabel state={activeInOverflow || open ? 'active' : 'rest'}>
                    Más
                    <ChevronDown
                      size={12}
                      strokeWidth={2.5}
                      className={cn('transition-transform duration-200', open && 'rotate-180')}
                    />
                  </NavLabel>
                )}
              >
                {overflowItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        'group relative block w-full px-4 py-2.5 text-left text-[0.6875rem] font-semibold uppercase leading-none',
                        'tracking-[0.14em] transition-colors duration-200 focus-visible:outline-none',
                        isActive ? 'text-[#00f3ff]' : 'text-white/55 hover:text-white focus-visible:text-white'
                      )}
                    >
                      {/* Acento de borde: hairline vertical en vez de fondo relleno */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'pointer-events-none absolute inset-y-1 left-0 w-px transition-colors duration-200',
                          isActive
                            ? 'bg-[#00f3ff]'
                            : 'bg-transparent group-hover:bg-white/30 group-focus-visible:bg-white/30'
                        )}
                      />
                      {item.name}
                    </button>
                  );
                })}
              </Dropdown>
            )}

            {/* Copia oculta usada solo para medir el ancho real de cada item (misma tipografía/padding) */}
            <div className="pointer-events-none absolute left-0 top-0 flex -translate-y-full opacity-0" aria-hidden="true">
              {visibleNavItems.map((item, index) => (
                <NavLabel
                  key={item.id}
                  ref={(el) => { measureRefs.current[index] = el; }}
                  tabIndex={-1}
                >
                  {item.name}
                </NavLabel>
              ))}
              <NavLabel ref={moreMeasureRef} tabIndex={-1}>
                Más
                <ChevronDown size={12} strokeWidth={2.5} />
              </NavLabel>
            </div>
          </div>

          <div className="mx-2 hidden h-5 w-px shrink-0 bg-white/[0.08] md:block" />

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            {userInfo && <LabNavbarIndicator />}
            <NavbarUserMenu
              userInfo={userInfo}
              onLogoutClick={() => setLogoutConfirmOpen(true)}
            />
          </div>

          <button
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className="ml-auto rounded-[3px] border border-white/[0.08] p-1.5 text-white/70 transition-colors hover:border-white/20 hover:text-white md:hidden"
          >
            <MenuIcon size={18} />
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
