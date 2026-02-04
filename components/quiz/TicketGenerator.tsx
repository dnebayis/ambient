'use client'

import { useRef, useEffect, useState } from 'react'
import html2canvas from 'html2canvas'
import { Download, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { LevelTier } from '@/lib/quiz-data'

interface TicketGeneratorProps {
  username: string
  score: number
  level: LevelTier
  onClose: () => void
}

export default function TicketGenerator({ username, score, level, onClose }: TicketGeneratorProps) {
  const ticketRef = useRef<HTMLDivElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [ticketBlob, setTicketBlob] = useState<Blob | null>(null)

  useEffect(() => {
    // Fetch Twitter avatar through our proxy
    setAvatarUrl(`/api/twitter-avatar?username=${encodeURIComponent(username)}`)

    // Preload fonts for better rendering
    if (typeof window !== 'undefined') {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded')
      })
    }
  }, [username])

  const generateTicket = async () => {
    if (!ticketRef.current) return

    setIsGenerating(true)
    try {
      // Wait for fonts and images to fully load
      await document.fonts.ready
      await new Promise(resolve => setTimeout(resolve, 500))

      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#000000',
        scale: 3, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 15000,
        width: ticketRef.current.offsetWidth,
        height: ticketRef.current.offsetHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-ticket-ref]') as HTMLElement
          if (clonedElement) {
            // Set explicit pixel dimensions (critical: aspect-ratio doesn't work in cloned doc)
            clonedElement.style.width = ticketRef.current!.offsetWidth + 'px'
            clonedElement.style.height = ticketRef.current!.offsetHeight + 'px'
            clonedElement.style.aspectRatio = 'auto'

            // Force visibility
            clonedElement.style.display = 'block'
            clonedElement.style.opacity = '1'
            clonedElement.style.visibility = 'visible'

            // Ensure all children have proper dimensions
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
      }, 'image/png', 1.0) // Maximum quality
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

    const tweetText = `I just scored ${score}/10 on the Ambient Quiz and achieved ${level.name} level! 🚀\n\nTest your knowledge about AI-powered blockchain:\n`
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent('https://ambient.xyz')}`

    window.open(tweetUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-2xl w-full"
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          {/* Ticket Preview */}
          <div
            ref={ticketRef}
            data-ticket-ref="true"
            className="relative w-full aspect-[1.91/1] rounded-2xl overflow-hidden mb-6"
            style={{
              background: '#0a0a0f',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Background: simple gradient for html2canvas compatibility */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)`,
              }}
            />

            {/* Ambient Logo/Brand */}
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Ambient Logo"
                  className="w-12 h-12 rounded-xl"
                />
                <div className="flex flex-col justify-center">
                  <div className="text-white font-bold text-lg" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                    AMBIENT
                  </div>
                  <div className="font-medium uppercase" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.12em', lineHeight: '1.4' }}>
                    Knowledge Quiz
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Picture */}
            {avatarUrl && (
              <div className="absolute top-6 right-6 z-10">
                <img
                  src={avatarUrl}
                  alt={`@${username}`}
                  className="w-28 h-28 rounded-full object-cover"
                  style={{
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
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Participant */}
              <div className="mb-3">
                <div className="font-medium uppercase" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '0.12em', marginBottom: '2px' }}>
                  Participant
                </div>
                <div className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.01em' }}>
                  @{username}
                </div>
              </div>

              {/* Score & Level — inline row, left-aligned together */}
              <div className="flex items-end gap-8 mb-4">
                <div>
                  <div className="font-medium uppercase" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '0.12em', marginBottom: '2px' }}>
                    Score
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                      {score}
                    </span>
                    <span className="font-medium" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.25rem' }}>
                      /10
                    </span>
                  </div>
                </div>
                <div>
                  <div className="font-medium uppercase" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.12em', marginBottom: '2px' }}>
                    Level
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{
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
                className="pt-3 flex items-center justify-between"
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className="font-medium" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                  Machine Intelligence as Currency
                </div>
                <div className="font-mono" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                  ambient.xyz
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadTicket}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Download Ticket'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={shareOnTwitter}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
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
