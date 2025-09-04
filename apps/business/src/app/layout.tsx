import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StrayDog Business Services',
  description: 'AI-powered business services platform for justice reform',
  keywords: ['AI', 'business services', 'justice reform', 'legal technology'],
  authors: [{ name: 'StrayDog Syndicate' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-hunter-green-950 text-white antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-hunter-green-950 via-hunter-green-900 to-black">
          {children}
        </div>
      </body>
    </html>
  );
}