'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Sparkles, Coins, Clock, MessageSquare } from 'lucide-react'
import { ambientAPI, ChatMessage } from '@/lib/ambient-api'

export default function AIChatPlayground() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tokenCount, setTokenCount] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 0)
    return () => clearTimeout(timer)
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const startTime = Date.now()

    try {
      const systemMessage: ChatMessage = {
        role: 'system',
        content: 'You are a helpful AI assistant. Provide clear, concise answers in 2-3 sentences. Be direct and avoid lengthy explanations unless specifically asked.'
      }

      // Use server-side API route to protect API key
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mini',
          messages: [systemMessage, ...messages, userMessage],
          temperature: 0.7,
          max_completion_tokens: 2000,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()

      const endTime = Date.now()
      setResponseTime(endTime - startTime)

      let rawContent = data.choices?.[0]?.message?.content || 'No response from AI'
      let cleanContent = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: cleanContent,
      }

      setMessages(prev => [...prev, assistantMessage])

      if (data.usage) {
        setTokenCount(data.usage.completion_tokens)
        setTotalTokens(prev => prev + data.usage.total_tokens)
      }
    } catch (error) {
      console.error('Chat error:', error)

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="gradient-text">AI Chat</span> Playground
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience Ambient's powerful AI models. Chat with our 600B+ parameter model
            and explore the capabilities of decentralized AI inference.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl overflow-hidden flex flex-col h-[600px]">
              {/* Messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 text-gray-500"
                    >
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start a conversation with Ambient AI</p>
                      <p className="text-sm mt-2">Powered by decentralized AI models</p>
                    </motion.div>
                  )}

                  {messages.map((message, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-100'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.role === 'assistant' && (
                            <Sparkles className="w-3 h-3 text-blue-400" />
                          )}
                          <span className="text-xs opacity-70 uppercase">
                            {message.role === 'user' ? 'You' : 'Ambient AI'}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-800 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        <span className="text-sm text-gray-400">Generating response...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-white/5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about Ambient..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Session Stats
              </h3>
              <div className="space-y-4">
                <StatRow
                  icon={<Coins className="w-4 h-4" />}
                  label="Last Response Tokens"
                  value={tokenCount.toString()}
                />
                <StatRow
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Total Tokens Used"
                  value={totalTokens.toLocaleString()}
                />
                <StatRow
                  icon={<Clock className="w-4 h-4" />}
                  label="Response Time"
                  value={responseTime ? `${responseTime}ms` : '-'}
                />
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Messages sent to Ambient's AI models</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Distributed mining network processes requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Responses generated using decentralized inference</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span>Miners earn rewards for computation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatRow({ icon, label, value }: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-mono text-sm font-semibold">
        {value}
      </span>
    </div>
  )
}
