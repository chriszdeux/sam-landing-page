"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { Input } from "./Input";
import { Button } from "./Button";

interface WishlistModalProps {
  open: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validación básica en el cliente
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) {
      setStatus("error");
      setErrorMsg("Por favor, ingresa tu nombre.");
      return;
    }
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMsg("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setStatus("loading");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/sam-v1/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (!res.ok) {
        throw new Error("Error al unirse a la Wishlist");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Ocurrió un error.");
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(10, 15, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 243, 255, 0.3)',
          boxShadow: '0 0 30px rgba(0, 243, 255, 0.2)',
          borderRadius: 4,
          color: 'white',
          maxWidth: 400,
          width: '100%',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Join Lyncore Wishlist</Typography>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {status === "success" ? (
          <Box textAlign="center" py={4}>
            <CheckCircleIcon sx={{ fontSize: 60, color: '#00f3ff', mb: 2 }} />
            <Typography variant="h6">¡Gracias por unirte!</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
              Te notificaremos cuando el MVP esté listo.
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
                Sé de los primeros en experimentar el poder de la economía Lyncore. ¡Regístrate ahora!
              </Typography>
              <Input
                label="Nombre"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {status === "error" && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                  {errorMsg}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                glow
                disabled={status === "loading"}
                sx={{ mt: 3, py: 1.5, background: 'linear-gradient(45deg, #00f3ff, #0088ff)' }}
              >
                {status === "loading" ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Unirse a la Wishlist"}
              </Button>
            </Box>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
