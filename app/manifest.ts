import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lyncore — Ecosistema Galáctico & Simulación Cripto',
    short_name: 'Lyncore',
    description: 'Simulación de inversiones en criptomonedas, exploración espacial y mercado galáctico.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07090e',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
