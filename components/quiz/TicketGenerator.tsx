'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { Download, Share2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { LevelTier } from '@/lib/quiz-data'

interface TicketGeneratorProps {
  username: string
  score: number
  level: LevelTier
  onClose: () => void
}

// Fixed ticket dimensions - ensures consistent rendering across all devices
const TICKET_WIDTH = 600
const TICKET_HEIGHT = Math.round(TICKET_WIDTH / 1.91)

export default function TicketGenerator({ username, score, level, onClose }: TicketGeneratorProps) {
  const ticketRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [ticketBlob, setTicketBlob] = useState<Blob | null>(null)
  const [scale, setScale] = useState(1)

  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const availableWidth = containerRef.current.offsetWidth
      setScale(Math.min(1, availableWidth / TICKET_WIDTH))
    }
  }, [])

  useEffect(() => {
    setAvatarUrl(`/api/twitter-avatar?username=${encodeURIComponent(username)}`)

    if (typeof window !== 'undefined') {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded')
      })
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [username, updateScale])

  const generateTicket = async () => {
    if (!ticketRef.current) return

    setIsGenerating(true)
    try {
      await document.fonts.ready
      await new Promise(resolve => setTimeout(resolve, 500))

      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#000000',
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 15000,
        width: TICKET_WIDTH,
        height: TICKET_HEIGHT,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-ticket-ref]') as HTMLElement
          if (clonedElement) {
            // Reset to full fixed dimensions for capture
            clonedElement.style.width = TICKET_WIDTH + 'px'
            clonedElement.style.height = TICKET_HEIGHT + 'px'
            clonedElement.style.transform = 'none'
            clonedElement.style.position = 'relative'
            clonedElement.style.overflow = 'hidden'

            const allElements = clonedElement.querySelectorAll('*')
            allElements.forEach((el: any) => {
              el.style.opacity = '1'
              el.style.visibility = 'visible'
            })
          }
        }
      })

      canvas.toBlob((blob) => {
        if (blob) {
          setTicketBlob(blob)
        }
      }, 'image/png', 1.0)
    } catch (error) {
      console.error('Error generating ticket:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadTicket = () => {
    if (!ticketBlob) {
      generateTicket()
      return
    }

    const url = URL.createObjectURL(ticketBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ambient-quiz-${username}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const shareOnTwitter = async () => {
    if (!ticketBlob) {
      await generateTicket()
    }

    const tweetText = `I just scored ${score}/10 on the Ambient Quiz and achieved ${level.name} level! \u{1F680}\n\nTest your knowledge about AI-powered blockchain:\n`
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent('https://ambient.xyz')}`

    window.open(tweetUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative max-w-2xl w-full my-auto"
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-gray-900 rounded-2xl p-4 sm:p-8 border border-gray-800">
          {/* Ticket Preview - container measures available width */}
          <div
            ref={containerRef}
            className="w-full mb-4 sm:mb-6 overflow-hidden rounded-2xl"
            style={{ height: Math.round(TICKET_HEIGHT * scale) }}
          >
            {/* Ticket always renders at fixed 600px width, scaled to fit */}
            <div
              ref={ticketRef}
              data-ticket-ref="true"
              className="relative overflow-hidden rounded-2xl"
              style={{
                width: TICKET_WIDTH,
                height: TICKET_HEIGHT,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                background: '#0a0a0f',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Background gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
                }}
              />

              {/* Ambient Logo/Brand */}
              <div style={{ position: 'absolute', top: 24, left: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src="/logo.png"
                    alt="Ambient Logo"
                    style={{ width: 48, height: 48, borderRadius: 12 }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                      AMBIENT
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: 11, letterSpacing: '0.12em', lineHeight: '1.4', textTransform: 'uppercase' }}>
                      Knowledge Quiz
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Picture */}
              {avatarUrl && (
                <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
                  <img
                    src={avatarUrl}
                    alt={`@${username}`}
                    style={{
                      width: 112,
                      height: 112,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: `0 0 28px ${level.color}45, 0 8px 32px rgba(0, 0, 0, 0.5)`,
                    }}
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
                    }}
                  />
                </div>
              )}

              {/* Main Content */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24 }}>
                {/* Participant */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 500, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: '0.12em', marginBottom: 2 }}>
                    Participant
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                    @{username}
                  </div>
                </div>

                {/* Score & Level */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 500, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: '0.12em', marginBottom: 2 }}>
                      Score
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
                        {score}
                      </span>
                      <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>
                        /10
                      </span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.12em', marginBottom: 2 }}>
                      Level
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: level.color,
                        letterSpacing: '-0.01em',
                        textShadow: `0 0 20px ${level.color}50`,
                      }}
                    >
                      {level.name}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ fontWeight: 500, color: 'rgba(255,255,255,0.25)', fontSize: 11, letterSpacing: '0.05em' }}>
                    Machine Intelligence as Currency
                  </div>
                  <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', fontSize: 11, letterSpacing: '0.08em' }}>
                    ambient.xyz
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadTicket}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Download Ticket'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={shareOnTwitter}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share on X
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
