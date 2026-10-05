import type { Metadata, Viewport } from 'next';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import '@fontsource/jetbrains-mono/latin-800.css';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: 'PÅ MINUTTET – EMOM-trening på norsk', template: '%s · PÅ MINUTTET' },
  description: 'Ny EMOM-økt hver dag. Gym eller hjemme, fem nivåer, innebygd timer. 7 dager gratis.',
  openGraph: {
    title: 'PÅ MINUTTET – trening som holder tiden',
    description: 'Ny EMOM-økt hver dag. Gym eller hjemme, fem nivåer. 7 dager gratis.',
    images: ['/media/pdf-forside.png'],
    locale: 'nb_NO',
    type: 'website',
  },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
  appleWebApp: { capable: true, title: 'PÅ MINUTTET', statusBarStyle: 'black-translucent' },
};
export const viewport: Viewport = { themeColor: '#121212', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>{children}<Analytics /></body>
    </html>
  );
}
