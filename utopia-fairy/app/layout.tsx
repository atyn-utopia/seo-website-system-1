import type { Metadata } from 'next'
import { Cormorant_Garamond, Quicksand } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-display', weight: ['300', '400', '600'] })
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Utopia Fairy',
  description: 'Your wish is my command — what website shall I create for you today?',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✨</text></svg>',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${quicksand.variable}`}>
      <body className="min-h-screen flex items-center justify-center px-4" style={{ paddingTop: 100, paddingBottom: 100 }}>
        <div className="magic-bg" />
        <Sparkles />
        {children}
      </body>
    </html>
  )
}

function Sparkles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${6 + Math.random() * 8}s`,
    delay: `${Math.random() * 10}s`,
    size: `${2 + Math.random() * 3}px`,
  }))

  return (
    <div className="sparkles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            '--duration': p.duration,
            '--delay': p.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
