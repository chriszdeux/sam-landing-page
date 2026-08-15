// 1-Definir componente de menú de usuario
// 2-Obtener despachador y router
// 3-Renderizar menú para usuario autenticado
// 4-Renderizar botones de acceso para invitados

//# 1-Definir componente de menú de usuario
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Settings, LogOut } from "lucide-react";
import { TaoIcon } from "../ui/TaoIcon";
import { Button } from "../ui/Button";
import { CountUp } from "../ui/CountUp";
import { Typography } from "../ui/Typography";

import { useAppDispatch } from "../../lib/hooks";
import { openModal } from "../../lib/features/uiSlice";

interface UserInfo {
  username: string;
  balance: number;
}

interface NavbarUserMenuProps {
  userInfo: UserInfo | null;

  onLogoutClick: () => void;
}

export const NavbarUserMenu = ({
  userInfo,
  onLogoutClick,
}: NavbarUserMenuProps) => {
  //# 2-Obtención del despachador y router
  const router = useRouter();

  const dispatch = useAppDispatch();

  if (userInfo) {


    //# 3-Renderizar menú para usuario autenticado
    return (
      <div className="flex flex-row items-center gap-4">
        <Button
          variant="text"
          onClick={() => router.push("/rewards")}
          sx={{
            display: 'none', // Ocultar por orden del PM
            color: "primary.main",
            "&:hover": { bgcolor: "rgba(0, 243, 255, 0.1)" },
          }}
        >
          Recompensas
        </Button>

        <Typography
          variant="body2"
          className="flex items-center gap-1 text-primary"
        >
          <UserIcon size={18} />
          {userInfo.username}
        </Typography>
        <Typography
          component="div"
          variant="body2"
          className="mr-2 hidden items-center gap-1 text-foreground-muted"
        >
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-4 py-1">
            <CountUp to={userInfo.balance} />
            <TaoIcon size={12} />
          </div>
        </Typography>

        <button
          onClick={() => router.push("/settings")}
          className="rounded-full p-2 text-foreground-muted transition-all duration-300 hover:rotate-90 hover:text-primary"
        >
          <Settings size={20} />
        </button>

        <button
          onClick={onLogoutClick}
          className="rounded-full p-2 text-error hover:bg-red-500/10"
        >
          <LogOut size={20} />
        </button>
      </div>
    );
  }

  //# 4-Renderizar botones de acceso para invitados
  return (
    <div className="flex flex-row items-center gap-2">
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
    </div>
  );
};
