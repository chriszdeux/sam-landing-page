import type { NextConfig } from "next";

// Host(s) publico(s) del bucket de imagenes del backend (Cloudflare R2).
// Configurable via NEXT_PUBLIC_IMAGE_HOSTNAME (lista separada por comas, sin
// protocolo) para poder migrar a un dominio propio sin tocar codigo: *.r2.dev
// es el dominio de desarrollo de Cloudflare y tiene rate limit.
// Ojo: se lee en build time; un cambio requiere rebuild.
const DEFAULT_IMAGE_HOSTNAMES = 'pub-2b3c8556aca3428d8484fd9df2ecf080.r2.dev';

const imageHostnames = (process.env.NEXT_PUBLIC_IMAGE_HOSTNAME || DEFAULT_IMAGE_HOSTNAMES)
  .split(',')
  .map((hostname) => hostname.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Hosts S3 muertos (la BD todavia guarda URLs viejas de S3). Se mantienen
      // a proposito: en next/image un host NO configurado es un error de
      // runtime, mientras que un 404 solo degrada al avatar de letra.
      {
        protocol: 'https',
        hostname: 'clim-v1.s3.us-east-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'thelyncore.s3.us-east-2.amazonaws.com',
      },
      ...imageHostnames.map((hostname) => ({
        protocol: 'https' as const,
        hostname,
      })),
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/inicio',
        destination: '/',
        permanent: true,
      },
      {
        source: '/explorar-universo',
        destination: '/exploracion-infinita',
        permanent: true,
      },
      {
        source: '/mercado',
        destination: '/galactic-market',
        permanent: true,
      },
      {
        source: '/transacciones',
        destination: '/transactions',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
