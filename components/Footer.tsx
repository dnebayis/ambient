'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold">Ambient</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Machine Intelligence as Currency. The world's first AI-powered
              Proof of Work blockchain with verified inference at scale.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://x.com/ambient_xyz" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="https://github.com/ambient-xyz" icon={<Github className="w-5 h-5" />} />
              <SocialLink href="https://discord.gg/ambient" icon={<MessageCircle className="w-5 h-5" />} />
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-gray-400">
              <li><FooterLink href="#features">Features</FooterLink></li>
              <li><FooterLink href="#mining">Mining</FooterLink></li>
              <li><FooterLink href="#network">Network</FooterLink></li>
              <li><FooterLink href="https://app.ambient.xyz">Testnet</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-gray-400">
              <li><FooterLink href="https://docs.ambient.xyz">Documentation</FooterLink></li>
              <li><FooterLink href="https://ambient.xyz">Whitepaper</FooterLink></li>
              <li><FooterLink href="https://github.com/ambient-xyz">GitHub</FooterLink></li>
              <li><FooterLink href="#">Blog</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Ambient. Interactive simulation for educational purposes.
            </p>
            <span className="hidden md:inline text-gray-700">•</span>
            <p className="text-sm text-gray-500">
              Created by{' '}
              <a
                href="https://x.com/0xshawtyy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 transition-colors font-medium"
              >
                @0xshawtyy
              </a>
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="p-3 glass-effect rounded-lg hover:bg-white/5 transition-colors"
    >
      {icon}
    </motion.a>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="hover:text-white transition-colors inline-block"
    >
      {children}
    </a>
  )
}
