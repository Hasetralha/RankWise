import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Providers from '../components/layout/Providers';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'RankWise',
  description: 'Rank and manage your tasks efficiently',
  icons: {
    icon: '/favicon.svg',
  },
}; 