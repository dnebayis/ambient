'use client'

import { motion } from 'framer-motion'
import { Github, Twitter } from 'lucide-react'

// Discord icon SVG
const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Ambient Logo" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold">Ambient</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Machine Intelligence as Currency. The world's first AI-powered
              Proof of Work blockchain with verified inference at scale.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://x.com/ambient_xyz" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="https://github.com/ambient-xyz" icon={<Github className="w-5 h-5" />} />
              <SocialLink href="https://discord.com/invite/3Seasf7DcB" icon={<DiscordIcon />} />
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
              <li><FooterLink href="https://ambient.xyz/litepaper">Litepaper</FooterLink></li>
              <li><FooterLink href="https://github.com/ambient-xyz">GitHub</FooterLink></li>

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
              {' • '}
              <a
                href="https://siyabald.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-400 transition-colors font-medium"
              >
                Portfolio
              </a>
            </p>
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
