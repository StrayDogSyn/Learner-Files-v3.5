import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StrayDog AI Education - Personalized Learning Platform',
  description: 'Revolutionary AI-powered education platform offering personalized tutoring, adaptive learning paths, and intelligent assessment tools for students of all ages.',
  keywords: [
    'AI education',
    'personalized learning',
    'AI tutoring',
    'adaptive learning',
    'online education',
    'machine learning education',
    'intelligent tutoring system',
    'educational technology',
    'learning analytics',
    'AI-powered assessment'
  ],
  authors: [{ name: 'StrayDog AI Education Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-hunter-950 via-hunter-900 to-education-wisdom/20 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}