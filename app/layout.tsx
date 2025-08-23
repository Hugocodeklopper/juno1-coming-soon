import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Juno1 - AI & Software Development',
  description: 'Juno1 biedt AI-innovatie, software development, BIM-diensten en offshore teams. Heeft u vragen over software of AI toepassingen? Neem contact op.',
  keywords: 'AI innovatie, software development, BIM, offshore teams, maatwerk software, AI-specialisten',
  authors: [{ name: 'Juno1' }],
  creator: 'Juno1',
  publisher: 'Juno1',
  robots: 'index, follow',
  openGraph: {
    title: 'Juno1 - AI & Software Development',
    description: 'Juno1 biedt AI-innovatie, software development, BIM-diensten en offshore teams.',
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juno1 - AI & Software Development',
    description: 'Juno1 biedt AI-innovatie, software development, BIM-diensten en offshore teams.',
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/logo.png'
  },
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
