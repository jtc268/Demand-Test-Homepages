import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demand Testing Platform',
  description: 'A platform for launching landing pages to gauge demand and collect email sign-ups',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-128x128.png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
        <footer className="py-4 px-6 text-center text-sm text-gray-600 border-t border-gray-200">
          <p>© {new Date().getFullYear()} Adore LLC. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
} 