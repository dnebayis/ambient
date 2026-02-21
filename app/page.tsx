'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import Architecture from '@/components/Architecture'

const PoLVisualizer = dynamic(() => import('@/components/PoLVisualizer'), { ssr: false })
const MiningSimulator = dynamic(() => import('@/components/MiningSimulator'), { ssr: false })
const NetworkStats = dynamic(() => import('@/components/NetworkStats'), { ssr: false })
const AIChatPlayground = dynamic(() => import('@/components/AIChatPlayground'), { ssr: false })
const ModelDashboard = dynamic(() => import('@/components/ModelDashboard'), { ssr: false })

export default function Home() {
  // Ensure page starts at top on load
  useEffect(() => {
    // Clear hash and scroll to top on initial load
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname)
      window.scrollTo(0, 0)
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Navigation />

      <div id="home" className="scroll-mt-24">
        <Hero />
      </div>

      <div id="pol" className="scroll-mt-24">
        <PoLVisualizer />
      </div>

      <div id="mining" className="scroll-mt-24">
        <MiningSimulator />
      </div>

      <div id="network" className="scroll-mt-24">
        <NetworkStats />
      </div>

      <div id="assistant" className="scroll-mt-24">
        <AIChatPlayground />
      </div>

      <div id="models" className="scroll-mt-24">
        <ModelDashboard />
      </div>

      <div id="docs" className="scroll-mt-24">
        <Architecture />
      </div>

      <Footer />
    </main>
  )
}
