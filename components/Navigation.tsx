'use client'

import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="Ambient Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-xl font-bold">Ambient</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="#features">PoL</NavLink>
            <NavLink href="/playground">AI Assistant</NavLink>
            <NavLink href="#models">Models</NavLink>
            <NavLink href="#architecture">Docs</NavLink>
            <NavLink href="/quiz">Quiz</NavLink>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.open('https://app.ambient.xyz/', '_blank')
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Launch App
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-3"
          >
            <MobileNavLink href="#features">Proof of Logits</MobileNavLink>
            <MobileNavLink href="/playground">AI Assistant</MobileNavLink>
            <MobileNavLink href="#models">Models</MobileNavLink>
            <MobileNavLink href="#architecture">Docs</MobileNavLink>
            <MobileNavLink href="/quiz">Quiz</MobileNavLink>
            <button
              onClick={() => {
                window.open('https://app.ambient.xyz/', '_blank')
                setIsOpen(false)
              }}
              className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Launch App
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      className="text-gray-400 hover:text-white transition-colors"
    >
      {children}
    </motion.a>
  )
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block py-2 text-gray-400 hover:text-white transition-colors"
    >
      {children}
    </a>
  )
}
