'use client'

import { useRef, useEffect, useState } from 'react'
import html2canvas from 'html2canvas'
import { Download, Share2, Sparkles } from 'lucide-react'
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
            // Force all styles to be inline and visible
            clonedElement.style.display = 'block'
            clonedElement.style.opacity = '1'
            clonedElement.style.visibility = 'visible'

            // Ensure all text is visible
            const allText = clonedElement.querySelectorAll('p, h1, h2, h3, span, div')
            allText.forEach((el: any) => {
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
            className="relative w-full aspect-[1.91/1] rounded-xl overflow-hidden mb-6"
            style={{
              background: `linear-gradient(135deg, ${level.color}15 0%, #00000080 100%)`,
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid-background h-full" />
            </div>

            {/* Main Content */}
            <div className="relative h-full flex flex-col justify-between p-8">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-400">AMBIENT QUIZ</span>
                  </div>
                </div>
                {avatarUrl && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <img
                      src={avatarUrl}
                      alt={`@${username}`}
                      className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover"
                      onError={(e) => {
                        // Fallback to default avatar
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
                      }}
                    />
                  </div>
                )}
              </div>

              {/* User Info & Score */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Participant</p>
                  <p className="text-2xl font-bold">@{username}</p>
                </div>

                <div className="flex items-end gap-8">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Score</p>
                    <p className="text-5xl font-bold">{score}<span className="text-2xl text-gray-400">/10</span></p>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-1" style={{ color: '#9ca3af' }}>Achievement</p>
                    <p
                      style={{
                        color: level.color,
                        fontSize: '28px',
                        fontWeight: '900',
                        lineHeight: '1.3',
                        marginTop: '4px',
                        marginBottom: '4px',
                        textShadow: `0 0 20px ${level.color}40`,
                        WebkitFontSmoothing: 'antialiased'
                      }}
                    >
                      {level.name}
                    </p>
                    <p className="text-sm text-gray-400 mt-1" style={{ color: '#9ca3af', marginTop: '4px' }}>{level.description}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="text-sm text-gray-500">
                  Machine Intelligence as Currency
                </div>
                <div className="text-sm font-mono text-gray-600">
                  ambient.xyz
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
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
