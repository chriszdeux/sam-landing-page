import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { Button } from "../ui/Button";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutDialog: React.FC<LogoutDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#0a0a1a",
          border: "1px solid rgba(0, 243, 255, 0.3)",
          boxShadow: "0 0 20px rgba(0, 243, 255, 0.2)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <DialogTitle sx={{ color: "white" }}>
        ¿Confirmar cierre de sesión?
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "text.secondary" }}>
          Estás a punto de desconectarte del sistema.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          color="error"
          variant="contained"
        >
          Cerrar Sesión
        </Button>
      </DialogActions>
    </Dialog>
  );
};
