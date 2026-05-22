import type { NextConfig } from "next";

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
      {
        protocol: 'https',
        hostname: 'clim-v1.s3.us-east-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'thelyncore.s3.us-east-2.amazonaws.com',
      },
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
