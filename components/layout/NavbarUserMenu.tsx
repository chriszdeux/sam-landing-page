"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Person as UserIcon,
  Settings,
  Logout,
  Bolt,
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

interface Network {
  identification: {
    symbol: string;
  };
  additionalInfo: {
    color: string;
  };
}

interface NavbarUserMenuProps {
  userInfo: UserInfo | null;
  selectedNetwork: Network | null;
  handleNetworkClick: () => void;
  onLogoutClick: () => void;
}

export const NavbarUserMenu = ({
  userInfo,
  selectedNetwork,
  handleNetworkClick,
  onLogoutClick,
}: NavbarUserMenuProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (userInfo) {
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
            <TaoIcon size={20} />
            <CountUp to={userInfo.balance} />
          </Box>
        </Typography>

        {/* {selectedNetwork && (
          <>
            <Tooltip title="Cambiar Red">
              <Button
                onClick={handleNetworkClick}
                startIcon={
                  <Bolt sx={{ color: selectedNetwork.additionalInfo.color }} />
                }
                variant="outlined"
                sx={{
                  borderColor: `${selectedNetwork.additionalInfo.color}80`,
                  color: "white",
                  bgcolor: `${selectedNetwork.additionalInfo.color}10`,
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2,
                  minWidth: "auto",
                  "&:hover": {
                    bgcolor: `${selectedNetwork.additionalInfo.color}30`,
                    borderColor: selectedNetwork.additionalInfo.color,
                    boxShadow: `0 0 15px ${selectedNetwork.additionalInfo.color}60`,
                  },
                }}
              >
                {selectedNetwork.identification.symbol}
              </Button>
            </Tooltip>
          </>
        )} */}

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
