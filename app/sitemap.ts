import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lyncore.io';

  const routes = [
    '',
    '/que-es-lyncore',
    '/operaciones',
    '/galactic-market',
    '/exploracion-infinita',
    '/laboratorio',
    '/roadmap',
    '/news',
    '/portfolio',
    '/rewards',
    '/transactions',
    '/aviso-legal',
    '/privacidad',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/aviso') || route.startsWith('/privacidad') ? 0.3 : 0.8,
  }));
}
