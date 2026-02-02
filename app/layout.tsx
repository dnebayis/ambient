import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ambient - Machine Intelligence as Currency',
  description: 'Interactive simulation of Ambient: SVM-compatible Proof of Work L1 blockchain with AI-powered inference',
  keywords: ['blockchain', 'AI', 'proof of work', 'machine learning', 'proof of logits'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  )
}
