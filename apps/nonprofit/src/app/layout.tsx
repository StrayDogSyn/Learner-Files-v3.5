import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StrayDog AI Justice Reform Initiative',
  description: 'Advancing justice through AI-powered legal advocacy, reform initiatives, and community empowerment. Join the movement for equitable legal systems.',
  keywords: [
    'justice reform',
    'legal advocacy',
    'AI legal assistance',
    'criminal justice',
    'legal aid',
    'community empowerment',
    'civil rights',
    'legal technology',
    'nonprofit',
    'social justice'
  ],
  authors: [{ name: 'StrayDog AI Justice Reform Initiative' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}