"use client";

import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { Dialog } from "./Dialog";
import { Typography } from "./Typography";
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
      className="w-full max-w-[400px] rounded-2xl border border-[#00f3ff]/30 bg-[rgba(10,15,30,0.95)] text-white shadow-[0_0_30px_rgba(0,243,255,0.2)] backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between p-6 pb-0">
        <Typography variant="h6" className="font-bold">Join Lyncore Wishlist</Typography>
        <button onClick={onClose} className="rounded-full p-1 text-white/70 hover:text-white">
          <X size={20} />
        </button>
      </div>
      <div className="p-6">
        {status === "success" ? (
          <div className="py-8 text-center">
            <CheckCircle size={60} className="mx-auto mb-4 text-[#00f3ff]" />
            <Typography variant="h6">¡Gracias por unirte!</Typography>
            <Typography variant="body2" className="mt-2 text-white/70">
              Te notificaremos cuando el MVP esté listo.
            </Typography>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mt-2">
              <Typography variant="body2" className="mb-6 text-white/70">
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
                <Typography variant="caption" className="mt-2 block text-error">
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
                {status === "loading" ? (
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : "Unirse a la Wishlist"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Dialog>
  );
};
