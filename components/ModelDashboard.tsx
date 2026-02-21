'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Brain, Zap, Cpu, ShieldCheck, Info } from 'lucide-react'

type ModelInfo = {
  id: string
  name?: string
  description?: string
  context_length?: number
  supported_features?: string[]
  fallback?: boolean
}

const DEMO_MODELS: ModelInfo[] = [
  {
    id: 'ambient/large',
    name: 'Ambient Large',
    description: 'Verified inference, general-purpose Ambient flagship model',
    context_length: 128000,
    supported_features: ['verified', 'chat'],
    fallback: true,
  },
  {
    id: 'zai-org/GLM-4.6',
    name: 'GLM-4.6',
    description: 'High-context (200K) GLM variant available on Ambient',
    context_length: 200000,
    supported_features: ['chat'],
    fallback: true,
  },
]

export default function ModelDashboard() {
  const [models, setModels] = useState<ModelInfo[]>(DEMO_MODELS)
  const [fallback, setFallback] = useState(false)
  const [nameCounts, setNameCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/models', { cache: 'no-store' })
        const data = await res.json()
        if (Array.isArray(data?.data) && data.data.length > 0) {
          const list: ModelInfo[] = data.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            description: m.description,
            context_length: m.context_length,
            supported_features: m.supported_features,
          }))
          setModels(list)
          setFallback(Boolean(data.fallback))
          const counts: Record<string, number> = {}
          list.forEach(m => {
            if (!m.name) return
            counts[m.name] = (counts[m.name] || 0) + 1
          })
          setNameCounts(counts)
        } else {
          setFallback(true)
          setNameCounts({})
        }
      } catch {
        setFallback(true)
        setNameCounts({})
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
            {fallback && <span className="ml-2 text-sm text-amber-400">(demo verisi)</span>}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, i) => {
            const duplicate =
              model.name && nameCounts[model.name] && nameCounts[model.name] > 1
            const displayName = model.name
              ? duplicate
                ? `${model.name} (${model.id})`
                : model.name
              : model.id
            const contextK = model.context_length
              ? `${Math.round(model.context_length / 1000)}k`
              : '—'
            const features = model.supported_features?.length
              ? model.supported_features
              : ['chat']
            const isVerified = features.includes('verified')

            return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative glass-effect rounded-2xl p-6 hover:bg-white/5 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />

              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-[11px]">
                      <ShieldCheck className="w-3 h-3" />
                      verified
                    </span>
                  )}
                  {model.fallback && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px]">
                      demo
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{displayName}</h3>
              <p className="text-sm text-gray-400 mb-4">
                {model.description || 'Ambient model'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-black/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-500">Context</span>
                  </div>
                  <div className="text-lg font-bold">{contextK}</div>
                </div>
                <div className="p-3 bg-black/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-500">Features</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-200">
                    {features.slice(0, 2).join(', ')}
                    {features.length > 2 && ' …'}
                  </div>
                </div>
                <div className="p-3 bg-black/40 rounded-lg col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-gray-500">Usage hint</span>
                  </div>
                  <div className="text-xs text-gray-300">
                    Keep prompts within context; cost scales with total tokens. Rate-limits depend on your Ambient plan.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded">
                  {model.id}
                </span>
                {!model.supported_features?.length && (
                  <span className="px-2 py-1 bg-gray-600/20 text-gray-300 text-xs rounded">
                    minimal info
                  </span>
                )}
              </div>
            </motion.div>
            )
          })}
        </div>

        {loading && (
          <div className="mt-6 text-sm text-gray-500 flex items-center gap-2 justify-center">
            <Info className="w-4 h-4" />
            Modeller yükleniyor…
          </div>
        )}
      </div>
    </section>
  )
}
