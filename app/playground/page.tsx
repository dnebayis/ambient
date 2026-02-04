'use client'

import { motion } from 'framer-motion'
import { Bot, Sparkles, Zap, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AmbientChat from '@/components/playground/AmbientChat'

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 grid-background opacity-10 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Testnet Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-effect">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-400">AI Playground</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Ambient</span> AI Assistant
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Ask anything about Ambient blockchain. Powered by verified AI inference
            with Proof of Logits consensus.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <div className="flex items-center gap-3 p-4 glass-effect rounded-xl">
            <Bot className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Ambient Expert</div>
              <div className="text-xs text-gray-400">Specialized knowledge</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 glass-effect rounded-xl">
            <Shield className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-sm font-medium">Verified Inference</div>
              <div className="text-xs text-gray-400">On-chain proof</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 glass-effect rounded-xl">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-sm font-medium">Fast Response</div>
              <div className="text-xs text-gray-400">100x legacy systems</div>
            </div>
          </div>
        </motion.div>

        {/* Chat Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AmbientChat />
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 glass-effect rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-4">About This AI</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-400">
            <div>
              <p className="mb-3">
                This AI assistant is specialized exclusively in Ambient blockchain technology.
                It can answer questions about:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Proof of Logits consensus mechanism</li>
                <li>Ambient's architecture and SVM compatibility</li>
                <li>Mining and verification process</li>
                <li>API usage and development</li>
                <li>Technical specifications</li>
              </ul>
            </div>
            <div>
              <p className="mb-3">
                All responses are generated using Ambient's own AI infrastructure with
                verified inference, ensuring:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Cryptographic proof of computation</li>
                <li>On-chain verification via Proof of Logits</li>
                <li>Transparent and auditable AI</li>
                <li>No centralized control</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
