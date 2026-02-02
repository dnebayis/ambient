'use client'

import { motion } from 'framer-motion'
import { Cpu, Zap, Shield, Network } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Particle {
  left: number
  top: number
  duration: number
  delay: number
}

export default function Hero() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate random positions only on client side to avoid hydration mismatch
    // Reduced from 20 to 10 particles for better performance
    setParticles(
      Array.from({ length: 10 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    )
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-background opacity-20" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-effect">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-400">AI-Powered Proof of Work</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="gradient-text">Machine Intelligence</span>
            <br />
            <span className="text-white">as Currency</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            SVM-compatible Proof of Work L1 blockchain delivering hyperscaled
            verified inference on a 600B+ parameter model
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Explore Simulation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.open('https://docs.ambient.xyz/', '_blank')
              }}
              className="px-8 py-4 glass-effect rounded-lg font-medium hover:bg-white/5 transition-colors"
            >
              Read Documentation
            </motion.button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <StatCard
              icon={<Cpu className="w-6 h-6" />}
              label="Parameter Model"
              value="600B+"
            />
            <StatCard
              icon={<Zap className="w-6 h-6" />}
              label="Faster Inference"
              value="100x"
            />
            <StatCard
              icon={<Shield className="w-6 h-6" />}
              label="Verification Overhead"
              value="0.1%"
            />
            <StatCard
              icon={<Network className="w-6 h-6" />}
              label="Network Status"
              value="Testnet"
            />
          </div>
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>
    </section>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect rounded-xl p-6 hover:bg-white/5 transition-colors"
    >
      <div className="flex justify-center mb-3 text-blue-500">{icon}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  )
}
