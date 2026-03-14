// app/layout.tsx — Javari eBook Creator — CR AudioViz AI — Created: 2026-03-15
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Javari eBook Creator | CR AudioViz AI',
  description: 'AI-powered eBook builder — create, design, and publish professional digital books in minutes. Part of the CR AudioViz AI creative ecosystem.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body className="min-h-screen bg-white dark:bg-gray-950">
        {children}
        <Script src="https://javariai.com/embed.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}