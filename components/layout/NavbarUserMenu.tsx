// 1-Definir componente de menú de usuario
// 2-Obtener despachador y router
// 3-Renderizar menú para usuario autenticado
// 4-Renderizar botones de acceso para invitados

//# 1-Definir componente de menú de usuario
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Person as UserIcon,
  Settings,
  Logout,
} from "@mui/icons-material";
import { TaoIcon } from "../ui/TaoIcon";
import { Button } from "../ui/Button";
import { CountUp } from "../ui/CountUp";

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
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="text"
          onClick={() => router.push("/rewards")}
          sx={{
            color: "primary.main",
            "&:hover": { bgcolor: "rgba(0, 243, 255, 0.1)" },
          }}
        >
          Recompensas
        </Button>

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
          <Box
            sx={{
              bgcolor: "rgba(0, 0, 0, 0.4)",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CountUp to={userInfo.balance} />
            <TaoIcon size={12} />
          </Box>
        </Typography>

        <IconButton
          onClick={() => router.push("/settings")}
          sx={{
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
              transform: "rotate(90deg)",
              transition: "all 0.3s",
            },
          }}
        >
          <Settings />
        </IconButton>

        <IconButton
          onClick={onLogoutClick}
          sx={{
            color: "error.main",
            "&:hover": { bgcolor: "rgba(255,0,0,0.1)" },
          }}
        >
          <Logout />
        </IconButton>
      </Stack>
    );
  }

  //# 4-Renderizar botones de acceso para invitados
  return (
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
  );
};
