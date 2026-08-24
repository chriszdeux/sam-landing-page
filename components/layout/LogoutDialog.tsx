// 1-Definir componente de diálogo de cierre de sesión
// 2-Renderizar contenido y acciones del diálogo

//# 1-Definir componente de diálogo de cierre de sesión
import React from "react";
import { Dialog } from "../ui/Dialog";
import { Typography } from "../ui/Typography";
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
  //# 2-Renderizar contenido y acciones del diálogo
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="rounded-2xl border border-[#00f3ff]/30 bg-[#0a0a1a] shadow-[0_0_20px_rgba(0,243,255,0.2)] backdrop-blur-md"
    >
      <div className="p-6">
        <Typography variant="h6" className="text-white">
          ¿Confirmar cierre de sesión?
        </Typography>
        <Typography variant="body1" className="mt-3 text-foreground-muted">
          Estás a punto de desconectarte del sistema.
        </Typography>
        <div className="mt-6 flex justify-end gap-2">
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
        </div>
      </div>
    </Dialog>
  );
};
