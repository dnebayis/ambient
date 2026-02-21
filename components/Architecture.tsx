'use client'

import { motion } from 'framer-motion'
import { BookOpen, Code, Layers, Zap, Shield, Cpu } from 'lucide-react'

const architectureFeatures = [
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'SVM-Compatible L1',
    description: 'Solana lineage keeps fast finality and tooling; consensus swapped for Proof of Logits to anchor AI inference.',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'On-Chain Fine-Tuning',
    description: 'Model weights can be updated on-chain with auditable deltas; checkpoints are referenceable by hash.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Verified Inference',
    description: 'Per-token logit hashing (claimed ~0.1% overhead) yields verifiable traces without TEEs or heavy ZK.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Deterministic Replay',
    description: 'Logit fingerprints allow any node to replay and verify outputs, slashing inconsistent miners.',
  },
]

const technicalSpecs = [
  { label: 'Consensus', value: 'Proof of Logits (PoL)' },
  { label: 'Verification Overhead', value: 'claimed ~0.1% (per-token hashing)' },
  { label: 'Model Footprint', value: '600B+ params (target/claim)' },
  { label: 'Context Length', value: '200K (GLM-4.6)' },
  { label: 'Runtime', value: 'SVM-compatible' },
  { label: 'Block Time', value: 'target ~10s' },
  { label: 'Mining', value: 'GPU, no ASIC lock-in' },
  { label: 'Security', value: 'Hash-based replay, slashing' },
]

export default function Architecture() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-blue-950/10 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-effect">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-400">Technical Overview</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            <span className="gradient-text">Architecture</span> & Design
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Built on battle-tested infrastructure with revolutionary AI-native consensus.
            Ambient combines the best of blockchain and machine learning.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {architectureFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-effect rounded-2xl p-8 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-effect rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Code className="w-6 h-6 text-blue-500" />
            <h3 className="text-2xl font-semibold">Technical Specifications</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalSpecs.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-black/40 rounded-lg border border-white/5"
              >
                <div className="text-sm text-gray-400 mb-2">{spec.label}</div>
                <div className="text-lg font-semibold">{spec.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-effect rounded-2xl p-8"
        >
          <h3 className="text-2xl font-semibold mb-8">How Proof of Logits Works</h3>

          <div className="space-y-8">
            <Step
              number={1}
              title="Model Inference"
              description="Nodes perform LLM inference tasks, generating logits (raw token scores) for each prediction step."
            />
            <Step
              number={2}
              title="Logit Fingerprinting"
              description="Each logit sequence is hashed, creating a unique cryptographic fingerprint of the exact model state and computation."
            />
            <Step
              number={3}
              title="Network Verification"
              description="Other nodes verify the computation by checking the logit hash, ensuring authentic inference with minimal overhead (0.1%)."
            />
            <Step
              number={4}
              title="Reward Distribution"
              description="Verified nodes earn AMB tokens through transaction fees and inflation, creating predictable mining economics."
            />
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap gap-4 justify-center">
            <ResourceButton label="Documentation" href="https://docs.ambient.xyz" />
            <ResourceButton label="GitHub" href="https://github.com/ambient-xyz" />
            <ResourceButton label="Litepaper" href="https://ambient.xyz/litepaper" />
            <ResourceButton label="Testnet" href="https://app.ambient.xyz" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-blue-500 font-bold text-lg">
        {number}
      </div>
      <div className="flex-1 pt-1">
        <h4 className="text-xl font-semibold mb-2">{title}</h4>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function ResourceButton({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 glass-effect rounded-lg hover:bg-white/5 transition-colors inline-flex items-center gap-2"
    >
      <span>{label}</span>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </motion.a>
  )
}
