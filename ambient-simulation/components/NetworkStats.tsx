'use client'

import { motion } from 'framer-motion'
import { Network, Zap, Activity, Globe, Server } from 'lucide-react'

export default function NetworkStats() {
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
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-400">Network Status</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            Decentralized <span className="gradient-text">Network</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A distributed network of nodes performing verified AI inference across the globe.
          </p>
        </motion.div>

        {/* Network Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            icon={<Server className="w-6 h-6" />}
            label="Total Nodes"
            value="12,847"
            change="+127"
            color="blue"
          />
          <MetricCard
            icon={<Activity className="w-6 h-6" />}
            label="Network Hashrate"
            value="2.4 PH/s"
            change="+5.2%"
            color="green"
          />
          <MetricCard
            icon={<Zap className="w-6 h-6" />}
            label="Inferences/sec"
            value="2,400"
            change="+12%"
            color="purple"
          />
          <MetricCard
            icon={<Network className="w-6 h-6" />}
            label="Network Uptime"
            value="99.9%"
            change="stable"
            color="cyan"
          />
        </div>

        {/* Node Distribution */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Node Distribution</h3>
            <div className="space-y-4">
              <NodeTypeBar
                label="Consensus Core"
                count={1}
                total={12847}
                color="from-blue-600 to-blue-500"
              />
              <NodeTypeBar
                label="Validators"
                count={1248}
                total={12847}
                color="from-purple-600 to-purple-500"
              />
              <NodeTypeBar
                label="Miners"
                count={4567}
                total={12847}
                color="from-cyan-600 to-cyan-500"
              />
              <NodeTypeBar
                label="Edge Nodes"
                count={7031}
                total={12847}
                color="from-green-600 to-green-500"
              />
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Network Features</h3>
            <div className="space-y-4">
              <Feature
                title="Censorship-Resistant"
                description="No single point of control or failure"
              />
              <Feature
                title="Privacy-Preserving"
                description="Encrypted inference with zero-knowledge proofs"
              />
              <Feature
                title="No Rate Limiting"
                description="Unrestricted access to AI inference"
              />
              <Feature
                title="Solana Compatible"
                description="Full compatibility with Solana tooling"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricCard({
  icon,
  label,
  value,
  change,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  color: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    cyan: 'text-cyan-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-effect rounded-xl p-6 hover:bg-white/5 transition-colors"
    >
      <div className={`${colorMap[color]} mb-4`}>{icon}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-xs text-green-400">{change}</div>
    </motion.div>
  )
}

function NodeTypeBar({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: string
}) {
  const percentage = (count / total) * 100

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-mono">{count.toLocaleString()}</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )
}
