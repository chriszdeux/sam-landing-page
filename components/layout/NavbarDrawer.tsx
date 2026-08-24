// 1-Definir componente de menú lateral (Drawer)
// 2-Renderizar lista de redes y navegación
// 3-Renderizar opciones de usuario o acceso

//# 1-Definir componente de menú lateral (Drawer)
import React from "react";
import { Gift } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { EnvVariables } from "../../lib/constants/variables";
import { CustomButton } from "../ui/CustomButton";
import { CountUp } from "../ui/CountUp";
import { Typography } from "../ui/Typography";
import { Tooltip } from "../ui/Tooltip";
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
    <div onClick={handleDrawerToggle} className="text-center">
      <Typography variant="h6" className="my-4 text-primary">
        {EnvVariables.project.toUpperCase()}
      </Typography>
      <ul>
        {selectedNetwork && (
          <li onClick={handleNetworkClick}>
            <p
              className="cursor-pointer text-center"
              style={{ color: selectedNetwork.additionalInfo.color }}
            >
              {selectedNetwork.identification.name}
            </p>
          </li>
        )}
        <li>
          <div className="mb-2 w-full border-b border-white/10" />
        </li>
        {navItems.filter(item => !item.auth || userInfo).map((item) => {
          const isActive = pathname === item.path;
          const isOperations = item.id === 'dashboard';
          const formattedHash = formatHash(localHash, chronoBurstFreqTypes);
          const tooltipText = `Hash Acumulado Local: ${formattedHash}`;

          const itemClassName = [
            'block rounded p-3 text-center transition-all duration-300',
            isActive ? 'text-primary' : 'text-inherit',
            isOperations && isPoweredOn
              ? 'border border-[#D4A373] bg-gradient-to-br from-[rgba(212,163,115,0.05)] to-[rgba(230,197,148,0.1)] text-[#E6C594] animate-[pulseGold_2s_infinite_ease-in-out]'
              : '',
          ].join(' ');

          const itemContent = (
            <p className={itemClassName}>{item.name}</p>
          );

          return (
            <li
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="mb-1 px-4"
            >
              {isOperations ? (
                <Tooltip
                  content={tooltipText}
                  side="right"
                  className="border-[rgba(212,163,115,0.3)] bg-[rgba(10,10,10,0.95)] font-bold text-[#E6C594] shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                >
                  <div style={{ width: '100%' }}>{itemContent}</div>
                </Tooltip>
              ) : itemContent}
            </li>
          );
        })}
        <li>
          {/* //# 3-Renderizar opciones de usuario o acceso */}
          <div className="flex w-full flex-col gap-2 p-4">
            {userInfo ? (
              <>
                  <Typography variant="body2" className="mb-2 font-bold text-primary">
                  {'// USUARIO:'} {userInfo.username}
                </Typography>
                <div
                  className="mb-4 hidden items-center justify-center gap-2 rounded border border-[#00f3ff]/10 bg-[#00f3ff]/5 p-2 text-foreground-muted"
                >
                  <TaoIcon size={20} />
                  <Typography variant="body2" className="font-bold text-[#00f3ff]">
                     TAO: <CountUp to={userInfo.balance} />
                  </Typography>
                </div>
                <CustomButton
                  variant="info"
                  fullWidth
                  startIcon={<Gift />}
                  onClick={() => {
                      dispatch(openModal('rewards'));
                      handleDrawerToggle();
                  }}
                  className="mb-2 hidden"
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
                  className="mb-2"
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
          </div>
        </li>
      </ul>
    </div>
  );
};
