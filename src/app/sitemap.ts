import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  return ['', '/start', '/logg-inn', '/vilkar', '/personvern'].map(p => ({ url: site + p }));
}
