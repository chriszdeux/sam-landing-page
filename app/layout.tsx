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
import { CookieBanner } from "../components/legal/CookieBanner";
import { AnalyticsScript } from "../components/analytics/AnalyticsScript";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lyncore.io'),
  title: {
    default: `${EnvVariables.project} — Ecosistema Galáctico & Simulación Cripto`,
    template: `%s | ${EnvVariables.project}`,
  },
  description: "Simulación avanzada de inversiones en criptomonedas, exploración espacial y mercado galáctico descentralizado.",
  keywords: ["criptomonedas", "simulación espacial", "blockchain", "mercado galáctico", "Lyncore", "inversión crypto"],
  authors: [{ name: "Lyncore Team" }],
  creator: "Lyncore",
  publisher: "Lyncore",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://lyncore.io",
    siteName: "Lyncore",
    title: `${EnvVariables.project} — Ecosistema Galáctico & Simulación Cripto`,
    description: "Simulación de inversiones en criptomonedas, exploración espacial y mercado galáctico.",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "Lyncore — Ecosistema Galáctico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${EnvVariables.project} — Ecosistema Galáctico & Simulación Cripto`,
    description: "Simulación de inversiones en criptomonedas, exploración espacial y mercado galáctico.",
    images: ["/globe.svg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://lyncore.io/#organization",
      name: "Lyncore",
      url: "https://lyncore.io",
      logo: "https://lyncore.io/favicon.ico",
      description: "Simulación de inversiones en criptomonedas y exploración espacial en un universo galáctico interactivo.",
    },
    {
      "@type": "WebSite",
      "@id": "https://lyncore.io/#website",
      url: "https://lyncore.io",
      name: "Lyncore",
      publisher: {
        "@id": "https://lyncore.io/#organization",
      },
      inLanguage: "es",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Reduced-motion del revelado de texto */}
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
            <CookieBanner />
            <AnalyticsScript />
          </AuthLoader>
        </StoreProvider>
      </body>
    </html>
  );
}
