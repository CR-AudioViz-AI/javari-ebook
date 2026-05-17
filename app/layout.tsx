// app/layout.tsx — Javari Books
// Fortune 50 quality — uses AppShell for full ecosystem integration
// May 17, 2026 — CR AudioViz AI, LLC
import type { Metadata } from 'next'
import './globals.css'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Javari Books | Javari by CR AudioViz AI',
  description: 'AI eBook and publication creator',
  keywords: 'Javari Books, Javari, AI, CR AudioViz AI',
}

import AppShell from '@/components/AppShell'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <AppShell
          appName="Javari Books"
          appColor="#10b981"
          appEmoji="📚"
          appDesc="AI eBook and publication creator"
        >
          {children}
        </AppShell>
      </body>
    </html>
  )
}
