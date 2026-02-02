'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Line } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Network, Globe } from 'lucide-react'

function Node({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <Sphere ref={meshRef} args={[0.1 * scale, 8, 8]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </Sphere>
  )
}

function NetworkGraph() {
  const nodes = useMemo(() => {
    const positions: Array<{ pos: [number, number, number]; color: string; scale: number }> = []

    // Central node (main consensus)
    positions.push({ pos: [0, 0, 0], color: '#3b82f6', scale: 2 })

    // Ring 1: Core validators
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const radius = 2
      positions.push({
        pos: [Math.cos(angle) * radius, Math.sin(angle) * radius, Math.random() * 0.5 - 0.25],
        color: '#8b5cf6',
        scale: 1.5,
      })
    }

    // Ring 2: Miners (reduced from 16 to 8 for performance)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const radius = 4
      positions.push({
        pos: [Math.cos(angle) * radius, Math.sin(angle) * radius, Math.random() * 1 - 0.5],
        color: '#06b6d4',
        scale: 1,
      })
    }

    // Ring 3: Edge nodes (reduced from 24 to 12 for performance)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const radius = 6
      positions.push({
        pos: [Math.cos(angle) * radius, Math.sin(angle) * radius, Math.random() * 1.5 - 0.75],
        color: '#10b981',
        scale: 0.8,
      })
    }

    return positions
  }, [])

  const connections = useMemo(() => {
    const lines: Array<{ start: [number, number, number]; end: [number, number, number] }> = []

    // Connect central node to ring 1
    for (let i = 1; i <= 8; i++) {
      lines.push({ start: nodes[0].pos, end: nodes[i].pos })
    }

    // Connect ring 1 to ring 2
    for (let i = 1; i <= 8; i++) {
      const ring2Start = 9
      lines.push({ start: nodes[i].pos, end: nodes[ring2Start + (i - 1) * 2].pos })
      lines.push({ start: nodes[i].pos, end: nodes[ring2Start + (i - 1) * 2 + 1].pos })
    }

    // Some random connections in ring 3
    for (let i = 25; i < nodes.length; i += 3) {
      if (i + 1 < nodes.length) {
        lines.push({ start: nodes[i].pos, end: nodes[i + 1].pos })
      }
    }

    return lines
  }, [nodes])

  return (
    <group>
      {/* Connections */}
      {connections.map((conn, i) => {
        const points = [new THREE.Vector3(...conn.start), new THREE.Vector3(...conn.end)]
        return (
          <Line
            key={i}
            points={points}
            color="#3b82f6"
            lineWidth={0.5}
            opacity={0.2}
            transparent
          />
        )
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <Node key={i} position={node.pos} color={node.color} scale={node.scale} />
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </group>
  )
}

export default function NetworkVisualization() {
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
            <span className="text-sm text-gray-400">Network Topology</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            Decentralized <span className="gradient-text">Network</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A distributed network of nodes performing verified AI inference. Explore the
            live topology of miners, validators, and edge nodes working in harmony.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Visualization */}
          <div className="lg:col-span-2 glass-effect rounded-2xl p-8 h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Live Network Topology</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            </div>

            <div className="h-[500px] rounded-xl overflow-hidden bg-black/40">
              <Canvas
                camera={{ position: [0, 0, 12], fov: 50 }}
                frameloop="demand"
                dpr={[1, 1.5]}
              >
                <color attach="background" args={['#000000']} />
                <NetworkGraph />
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  autoRotate
                  autoRotateSpeed={0.2}
                  enableDamping={false}
                />
              </Canvas>
            </div>
          </div>

          {/* Legend & Stats */}
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-500" />
                Node Types
              </h3>
              <div className="space-y-4">
                <LegendItem color="#3b82f6" label="Consensus Core" count="1" />
                <LegendItem color="#8b5cf6" label="Validators" count="8" />
                <LegendItem color="#06b6d4" label="Miners" count="16" />
                <LegendItem color="#10b981" label="Edge Nodes" count="24" />
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Network Metrics</h3>
              <div className="space-y-4 text-sm">
                <MetricRow label="Total Nodes" value="12,847" />
                <MetricRow label="Active Validators" value="1,248" />
                <MetricRow label="Network Uptime" value="99.9%" />
                <MetricRow label="Avg. Latency" value="47ms" />
                <MetricRow label="Throughput" value="2.4k TPS" />
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Censorship-resistant infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>No rate limiting or bans</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Privacy-preserving by design</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Solana-compatible tooling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LegendItem({ color, label, count }: { color: string; label: string; count: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-mono text-gray-400">{count}</span>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  )
}
