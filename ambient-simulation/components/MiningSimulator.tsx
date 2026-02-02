'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, TrendingUp, Coins, Zap, Play, Pause } from 'lucide-react'

interface MiningStats {
  hashrate: number
  blocksFound: number
  rewards: number
  efficiency: number
}

export default function MiningSimulator() {
  const [isRunning, setIsRunning] = useState(false)
  const [stats, setStats] = useState<MiningStats>({
    hashrate: 0,
    blocksFound: 0,
    rewards: 0,
    efficiency: 0,
  })
  const [gpuUtilization, setGpuUtilization] = useState(0)
  const [recentBlocks, setRecentBlocks] = useState<{ id: number; reward: number; time: string }[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        let newBlockFound = false
        let blockReward = 0
        let blockId = 0

        setStats(prev => {
          const newHashrate = prev.hashrate + Math.random() * 10
          const shouldFindBlock = Math.random() > 0.7

          if (shouldFindBlock) {
            blockReward = 2.5 + Math.random() * 2.5
            blockId = prev.blocksFound + 1
            newBlockFound = true

            return {
              hashrate: newHashrate,
              blocksFound: prev.blocksFound + 1,
              rewards: prev.rewards + blockReward,
              efficiency: Math.min(99.9, prev.efficiency + 0.5),
            }
          }

          return {
            ...prev,
            hashrate: newHashrate,
            efficiency: Math.min(99.9, prev.efficiency + 0.2),
          }
        })

        // Update recent blocks if a block was found (outside of setStats to prevent nested updates)
        if (newBlockFound) {
          setRecentBlocks(blocks => [
            { id: blockId, reward: blockReward, time: new Date().toLocaleTimeString() },
            ...blocks.slice(0, 4)
          ])
        }

        setGpuUtilization(60 + Math.random() * 30)
      }, 1000)
    } else {
      setGpuUtilization(0)
    }

    return () => clearInterval(interval)
  }, [isRunning])

  const toggleMining = () => {
    setIsRunning(!isRunning)
    if (!isRunning) {
      setStats({ hashrate: 0, blocksFound: 0, rewards: 0, efficiency: 0 })
      setRecentBlocks([])
    }
  }

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent to-blue-950/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-effect">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-400">Interactive Demo</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            <span className="gradient-text">GPU Mining</span> Simulator
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience Bitcoin-like mining economics with predictable AI inference rewards.
            No enterprise GPUs required—standard hardware earns through computation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Control */}
            <div className="glass-effect rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold">Mining Control</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMining}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${isRunning
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Stop Mining
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start Mining
                    </>
                  )}
                </motion.button>
              </div>

              {/* GPU Utilization */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">GPU Utilization</span>
                  <span className="text-sm font-mono text-blue-400">{gpuUtilization.toFixed(1)}%</span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                    animate={{ width: `${gpuUtilization}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatBox
                  icon={<Zap className="w-5 h-5" />}
                  label="Hashrate"
                  value={`${stats.hashrate.toFixed(2)} GH/s`}
                  trend={isRunning}
                />
                <StatBox
                  icon={<Cpu className="w-5 h-5" />}
                  label="Efficiency"
                  value={`${stats.efficiency.toFixed(1)}%`}
                  trend={isRunning}
                />
                <StatBox
                  icon={<Coins className="w-5 h-5" />}
                  label="Blocks Found"
                  value={stats.blocksFound.toString()}
                  trend={false}
                />
                <StatBox
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Total Rewards"
                  value={`${stats.rewards.toFixed(2)} AMB`}
                  trend={false}
                />
              </div>
            </div>

            {/* Recent Blocks */}
            <div className="glass-effect rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Recent Blocks</h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {recentBlocks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Start mining to discover blocks
                    </div>
                  ) : (
                    recentBlocks.map((block) => (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-green-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="font-mono text-sm">Block #{block.id}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-400">{block.time}</span>
                          <span className="text-green-500 font-semibold">
                            +{block.reward.toFixed(2)} AMB
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Mining Features</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Bitcoin-like reward economics</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Predictable profits from inference tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>No enterprise GPU required</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Rewards for inference, fine-tuning & training</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Non-overlapping problem sets</span>
                </li>
              </ul>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Network Stats</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Hashrate</span>
                  <span className="font-mono">2.4 PH/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Miners</span>
                  <span className="font-mono">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Block Time</span>
                  <span className="font-mono">~10s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty</span>
                  <span className="font-mono">2.1M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatBox({ icon, label, value, trend }: {
  icon: React.ReactNode
  label: string
  value: string
  trend: boolean
}) {
  return (
    <div className="p-4 bg-black/40 rounded-lg border border-white/5">
      <div className="flex items-center gap-2 mb-2 text-blue-400">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold font-mono">{value}</span>
        {trend && (
          <TrendingUp className="w-4 h-4 text-green-500" />
        )}
      </div>
    </div>
  )
}
