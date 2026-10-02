import type { MetadataRoute } from 'next';

// Gjør at siden kan legges på Hjem-skjermen og åpnes som en app
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PÅ MINUTTET',
    short_name: 'PÅ MINUTTET',
    description: 'Ny EMOM-økt hver dag. Gym eller hjemme, fem nivåer, innebygd timer.',
    start_url: '/program',
    scope: '/',
    display: 'standalone',
    background_color: '#121212',
    theme_color: '#121212',
    lang: 'nb',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
