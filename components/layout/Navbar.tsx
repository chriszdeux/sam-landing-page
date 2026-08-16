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
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { Drawer } from "../ui/Drawer";
import { Tooltip } from "../ui/Tooltip";
import { Dropdown } from "../ui/Dropdown";

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

const NAV_GAP = 4; // px, coincide con gap-1 en la fila de navegación

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
    const color = isOperations && isPoweredOn ? 'warning' : isActive ? 'primary' : 'info';

    const buttonContent = (
      <Button
        variant="text"
        size="small"
        color={color}
        onClick={() => handleNavClick(item)}
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
  };

  //# 6-Renderizar estructura principal de la barra
  return (
    <div className="grow">
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-center border-b border-[#00f3ff]/10 bg-[rgba(5,5,12,0.8)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl [background-image:linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] [background-size:30px_30px]"
      >
        { }
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent shadow-[0_0_15px_#00f3ff]" />

        <div className="flex w-full items-center gap-3 px-4 md:px-6">

          <div
            className="flex shrink-0 cursor-pointer items-center"
            onClick={() => handleNavClick(navItems[0])}
          >
            <div className="mr-3 flex items-center justify-center rounded-lg border border-[#00f3ff]/30 bg-[#00f3ff]/5 p-1.5 shadow-[0_0_15px_rgba(0,243,255,0.15)]">
              <Rocket size={20} className="text-primary [filter:drop-shadow(0_0_5px_#00f3ff)]" />
            </div>
            <div className="hidden sm:block">
              <Typography
                variant="h6"
                component="div"
                className="mb-0.5 bg-gradient-to-r from-white to-[#00f3ff] bg-clip-text text-base font-black tracking-[2px] leading-none text-transparent [-webkit-text-fill-color:transparent]"
              >
                {EnvVariables.project.toUpperCase()}
              </Typography>
              <Typography variant="caption" className="flex items-center gap-1.5 text-[0.55rem] tracking-[3px] text-[#00f3ff]/70">
                <span className="h-1 w-1 rounded-full bg-[#00f3ff] shadow-[0_0_5px_#00f3ff]" />
                SYSTEM ONLINE
              </Typography>
            </div>
          </div>

          {/* Fila de navegación: mide su ancho disponible y desborda a "Más" */}
          <div
            ref={navRowRef}
            className="hidden min-w-0 flex-1 items-center gap-1 rounded-xl border border-white/[0.08] bg-black/30 p-1 backdrop-blur-sm md:flex"
          >
            {shownItems.map(renderNavButton)}

            {overflowItems.length > 0 && (
              <Dropdown
                align="left"
                trigger={({ open }) => (
                  <Button
                    variant="text"
                    size="small"
                    color={activeInOverflow ? 'primary' : 'info'}
                    endIcon={<ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />}
                  >
                    Más
                  </Button>
                )}
              >
                {overflowItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        'block w-full px-4 py-2.5 text-left text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-white/5',
                        isActive ? 'text-[#00f3ff]' : 'text-white/70'
                      )}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </Dropdown>
            )}

            {/* Copia oculta usada solo para medir el ancho real de cada item (misma tipografía/padding) */}
            <div className="pointer-events-none absolute left-0 top-0 flex -translate-y-full gap-1 opacity-0" aria-hidden="true">
              {visibleNavItems.map((item, index) => (
                <Button
                  key={item.id}
                  ref={(el) => { measureRefs.current[index] = el; }}
                  variant="text"
                  size="small"
                  tabIndex={-1}
                >
                  {item.name}
                </Button>
              ))}
              <Button ref={moreMeasureRef} variant="text" size="small" endIcon={<ChevronDown size={14} />} tabIndex={-1}>
                Más
              </Button>
            </div>
          </div>

          <div className="mx-1 hidden h-[30px] w-px shrink-0 bg-white/10 md:block" />

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
