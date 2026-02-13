/**
 * Layout Principal de la Aplicación
 * Configuración de fuentes (Geist)
 * Proveedores globales (Store, Theme)
 * Componentes de interfaz global (Navbar, Modales)
 * Definición de metadatos básicos
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import ThemeRegistry from "../components/ThemeRegistry";
import { Navbar } from "../components/layout/Navbar";
import { AuthLoader } from "../components/auth/AuthLoader";
import { Modal } from "../components/ui/Modal";
import { ToastStack } from "../components/ui/ToastStack";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { EnvVariables } from "@/lib/constants/variables";

export const metadata: Metadata = {
  title: EnvVariables.project,
  description: "Simulación de inversiones en criptomonedas y exploración espacial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <ThemeRegistry>
            <AuthLoader>
                <Navbar />
                <Modal />
                <ToastStack />
                {children}
            </AuthLoader>
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
