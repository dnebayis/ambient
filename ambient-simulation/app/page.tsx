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
    // Only run on initial page load, not on hash changes
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Navigation />

      <div id="hero">
        <Hero />
      </div>

      <div id="features">
        <PoLVisualizer />
      </div>

      <div id="mining">
        <MiningSimulator />
      </div>

      <div id="network">
        <NetworkStats />
      </div>

      <div id="playground">
        <AIChatPlayground />
      </div>

      <div id="models">
        <ModelDashboard />
      </div>

      <div id="architecture">
        <Architecture />
      </div>

      <Footer />
    </main>
  )
}
