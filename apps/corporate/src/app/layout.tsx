import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StrayDog Syndicate - Corporate',
  description: 'Professional business solutions and AI-powered services',
  keywords: ['business', 'AI', 'consulting', 'technology', 'justice reform'],
  authors: [{ name: 'Eric Hunter Petross', url: 'https://github.com/StrayDogSyndicate' }],
  openGraph: {
    title: 'StrayDog Syndicate - Corporate',
    description: 'Professional business solutions and AI-powered services',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-hunter-green-950 via-hunter-green-900 to-hunter-green-800 min-h-screen`}>
        <Providers>
          <div className="relative min-h-screen">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] pointer-events-none" />
            
            {/* Main Content */}
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}