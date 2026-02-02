'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Brain, Zap, Cpu, ChevronRight } from 'lucide-react'

const DEMO_MODELS = [
  {
    id: 'ambient-600b',
    name: 'Ambient 600B',
    description: 'Flagship 600B+ parameter model with verified inference',
    parameters: '600B+',
    speed: '100x',
    use_cases: ['General AI', 'Code Generation', 'Research', 'Analysis'],
  },
  {
    id: 'ambient-175b',
    name: 'Ambient 175B',
    description: 'High-performance model optimized for speed',
    parameters: '175B',
    speed: '150x',
    use_cases: ['Chat', 'Q&A', 'Summarization'],
  },
  {
    id: 'ambient-70b',
    name: 'Ambient 70B',
    description: 'Efficient model for everyday tasks',
    parameters: '70B',
    speed: '200x',
    use_cases: ['Assistant', 'Translation', 'Writing'],
  },
]

export default function ModelDashboard() {
  const [models] = useState(DEMO_MODELS)

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent to-purple-950/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-effect">
            <Brain className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-400">Available Models</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            <span className="gradient-text">Model</span> Dashboard
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore Ambient's verified AI models powered by Proof of Logits consensus.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-effect rounded-2xl p-6 hover:bg-white/5 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                  <Brain className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{model.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-black/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-500">Parameters</span>
                  </div>
                  <div className="text-lg font-bold">{model.parameters}</div>
                </div>
                <div className="p-3 bg-black/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-500">Speed</span>
                  </div>
                  <div className="text-lg font-bold">{model.speed}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {model.use_cases.slice(0, 3).map((use_case) => (
                  <span
                    key={use_case}
                    className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded"
                  >
                    {use_case}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
