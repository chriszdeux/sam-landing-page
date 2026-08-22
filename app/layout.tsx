// 1-Estructuración y renderizado visual del componente UI

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Navbar } from "../components/layout/Navbar";
import { AuthLoader } from "../components/auth/AuthLoader";
import { Modal } from "../components/ui/Modal";
import { ToastStack } from "../components/ui/ToastStack";
import { LabSimulationManager } from "../components/labs/LabSimulationManager";

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
  
  
  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <html lang="es">
      <head>
        {/* Reduced-motion del revelado de texto (data-reveal-item lo estampa
            components/ui/Typography.tsx).

            Va inline y en <head> a propósito. El HTML del servidor siempre llega
            con los estilos inline del estado "hidden" de framer-motion, porque el
            servidor no puede leer la media query: el texto queda oculto antes de
            que corra JS, así que ningún hook de React puede corregirlo a tiempo.
            Esta regla lo anula en el primer paint sin depender de que globals.css
            ya haya cargado.

            El !important de autor gana a los estilos inline y también a las
            animaciones WAAPI en el orden de cascada, así que framer no le puede
            pelear. El selector apunta al item y NO a `[data-reveal] *`: el
            descendiente universal mataría el transform de cualquier cosa dentro
            de un Reveal (spinners, hovers con scale, el fondo galáctico). */}
        <style>{`@media (prefers-reduced-motion: reduce){[data-reveal-item]{opacity:1 !important;transform:none !important}}`}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <AuthLoader>
              <Navbar />
              <LabSimulationManager />
              <Modal />
              <ToastStack />
              {children}
          </AuthLoader>
        </StoreProvider>
      </body>
    </html>
  );
}
