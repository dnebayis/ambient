'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Brain, Hash, CheckCircle, Activity } from 'lucide-react'

interface LogitData {
  id: number
  value: number
  token: string
  verified: boolean
}

export default function PoLVisualizer() {
  const [logits, setLogits] = useState<LogitData[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const verificationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const generateLogits = () => {
    // Clear any existing interval
    if (verificationIntervalRef.current) {
      clearInterval(verificationIntervalRef.current)
      verificationIntervalRef.current = null
    }

    setIsProcessing(true)
    const tokens = ['The', 'future', 'of', 'AI', 'is', 'decentralized', 'and', 'verifiable']
    const newLogits: LogitData[] = tokens.map((token, i) => ({
      id: Date.now() + i,
      token,
      value: Math.random() * 10 - 5,
      verified: false,
    }))

    setLogits(newLogits)

    // Schedule all verifications
    tokens.forEach((_, index) => {
      setTimeout(() => {
        setLogits(prev =>
          prev.map((l, idx) =>
            idx === index ? { ...l, verified: true } : l
          )
        )

        // Mark as finished after last token
        if (index === tokens.length - 1) {
          setTimeout(() => setIsProcessing(false), 100)
        }
      }, 100 + (index * 300))
    })
  }

  useEffect(() => {
    generateLogits()

    // Cleanup on unmount
    return () => {
      if (verificationIntervalRef.current) {
        clearInterval(verificationIntervalRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-effect">
            <Brain className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-400">Core Technology</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            Proof of <span className="gradient-text">Logits</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real-time LLM verification through logit fingerprinting. Each token generation
            creates a unique hash, ensuring cryptographic proof of authentic AI inference.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Visualization */}
          <div className="glass-effect rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Live Inference Verification</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateLogits}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg text-sm transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Generate New'}
              </motion.button>
            </div>

            <div className="space-y-3">
              {logits.map((logit, i) => (
                <motion.div
                  key={logit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-white/5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-blue-400">{logit.token}</span>
                      {logit.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${((logit.value + 5) / 10) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500 font-mono">
                      {logit.value.toFixed(4)}
                    </div>
                  </div>
                  <Hash className={`w-5 h-5 ${logit.verified ? 'text-green-500' : 'text-gray-600'}`} />
                </motion.div>
              ))}
            </div>

            {logits.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    Verification complete: {logits.filter(l => l.verified).length}/{logits.length} logits verified
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Information Cards */}
          <div className="space-y-6">
            <InfoCard
              icon={<Activity className="w-6 h-6" />}
              title="0.1% Overhead"
              description="Near-zero verification cost with cryptographic security. Each logit creates an infallible fingerprint of the model state."
            />
            <InfoCard
              icon={<Brain className="w-6 h-6" />}
              title="600B+ Parameters"
              description="Full verification on massive language models. The network consensus is the model itself, continuously evolving."
            />
            <InfoCard
              icon={<Hash className="w-6 h-6" />}
              title="Real-time Hashing"
              description="Logit sequences are hashed in real-time, providing instant verification without ZK bottlenecks or TEE limitations."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="glass-effect rounded-xl p-6 hover:bg-white/5 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
