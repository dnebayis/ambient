'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Sparkles, Coins, Clock, MessageSquare, Shield, AlertTriangle, Clipboard } from 'lucide-react'
import { ambientAPI, ChatMessage } from '@/lib/ambient-api'

type ModelInfo = {
  id: string
  name?: string
  context_length?: number
  supported_features?: string[]
}

type LocalMessage = ChatMessage & {
  model?: string
  verified?: boolean
  merkle_root?: string
  error_status?: number
  error_text?: string
}

type HistoryItem = {
  model: string
  durationMs: number | null
  tokens: number | null
  status: 'ok' | 'error'
  fallback?: boolean
}

export default function AIChatPlayground() {
  const [messages, setMessages] = useState<LocalMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tokenCount, setTokenCount] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const FALLBACK_MODELS: ModelInfo[] = [
    { id: 'ambient/large', name: 'Ambient Large', context_length: 128000 },
    { id: 'zai-org/GLM-4.6', name: 'GLM-4.6', context_length: 200000 },
  ]
  const [models, setModels] = useState<ModelInfo[]>(FALLBACK_MODELS)
  const [selectedModel, setSelectedModel] = useState('ambient/large')
  const [modelsLoading, setModelsLoading] = useState(false)
  const [modelsError, setModelsError] = useState<string | null>(null)
  const [modelsFallback, setModelsFallback] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
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

  // Fetch model list from server (falls back to defaults if fails)
  useEffect(() => {
    const fetchModels = async () => {
      setModelsLoading(true)
      setModelsError(null)
      try {
        const res = await fetch('/api/models', { cache: 'no-store' })
        if (!res.ok) throw new Error('model fetch failed')
        const data = await res.json()
        if (Array.isArray(data?.data) && data.data.length > 0) {
          const list: ModelInfo[] = data.data
          setModels(list)
          setModelsFallback(Boolean(data.fallback))
          // Keep selected model if still valid, else pick first
          const ids = list.map(m => m.id)
          setSelectedModel(prev => (ids.includes(prev) ? prev : ids[0]))
        } else if (data?.error) {
          setModelsError('Model list alınamadı, varsayılan modeller gösteriliyor.')
          setModels(FALLBACK_MODELS)
          setModelsFallback(true)
          const fallbackIds = FALLBACK_MODELS.map(m => m.id)
          setSelectedModel(prev => (fallbackIds.includes(prev) ? prev : fallbackIds[0]))
        }
      } catch (err) {
        setModelsError('Model listesi yüklenemedi, varsayılan modeller gösteriliyor.')
        setModels(FALLBACK_MODELS)
        setModelsFallback(true)
        const fallbackIds = FALLBACK_MODELS.map(m => m.id)
        setSelectedModel(prev => (fallbackIds.includes(prev) ? prev : fallbackIds[0]))
      } finally {
        setModelsLoading(false)
      }
    }
    fetchModels()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: LocalMessage = {
      role: 'user',
      content: input.trim(),
      model: selectedModel,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const startTime = Date.now()

    try {
      // Use server-side API route to protect API key (it already injects the system prompt)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...messages, userMessage],
          temperature: 0.7,
          max_completion_tokens: 2048,
        }),
      })

      let data: any
      if (!response.ok) {
        // Try to surface API error details for easier debugging
        const errorBody = await response.json().catch(() => null)
        const message = errorBody?.error || response.statusText || 'Unknown error'
        const err: any = new Error(`API request failed: ${message}`)
        ;(err as any).status = response.status
        throw err
      } else {
        data = await response.json()
      }

      const endTime = Date.now()
      setResponseTime(endTime - startTime)

      let rawContent = data.choices?.[0]?.message?.content || 'No response from AI'
      let cleanContent = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()

      const assistantMessage: LocalMessage = {
        role: 'assistant',
        content: cleanContent,
        model: selectedModel,
        verified: data.verified,
        merkle_root: data.merkle_root,
      }

      setMessages(prev => [...prev, assistantMessage])

      if (data.usage) {
        setTokenCount(data.usage.completion_tokens)
        setTotalTokens(prev => prev + data.usage.total_tokens)
      }

      setHistory(prev => [
        {
          model: selectedModel,
          durationMs: endTime - startTime,
          tokens: data.usage?.total_tokens ?? null,
          status: 'ok',
          fallback: modelsFallback,
        },
        ...prev,
      ].slice(0, 5))
    } catch (error: any) {
      console.error('Chat error:', error)

      const errorMessage: LocalMessage = {
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        model: selectedModel,
        error_status: error?.status || error?.response?.status,
        error_text: error?.message,
      }

      setMessages(prev => [...prev, errorMessage])
      setHistory(prev => [
        {
          model: selectedModel,
          durationMs: null,
          tokens: null,
          status: 'error',
          fallback: modelsFallback,
        },
        ...prev,
      ].slice(0, 5))
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
            <span className="gradient-text">Ambient AI</span> Assistant
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Ask anything about Ambient blockchain. Our AI is specialized in Proof of Logits,
            architecture, mining, API, and all things Ambient.
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
                      className="text-center py-12 text-gray-500"
                    >
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Ask me about Ambient!</p>
                      <p className="text-sm mb-4">I'm specialized in Ambient blockchain technology</p>
                      <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                        {[
                          'What is Ambient? Summarize in 2 sentences.',
                          'Explain Proof of Logits step by step.',
                          'How do I enable verified inference via API?',
                          'Return an example answer in JSON format.',
                        ].map((q, i) => (
                          <button
                            key={i}
                            onClick={() => setInput(q)}
                            className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
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
                          {message.model && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">
                              {message.model}
                            </span>
                          )}
                          {message.verified && (
                            <span className="flex items-center gap-1 text-[10px] text-green-400">
                              <Shield className="w-3 h-3" />
                              verified
                            </span>
                          )}
                          {message.error_status && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-200">
                              Hata {message.error_status}
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        {message.merkle_root && (
                          <button
                            type="button"
                            className="mt-2 inline-flex items-center gap-1 text-[11px] text-blue-300 hover:text-white"
                            onClick={() => navigator.clipboard?.writeText(message.merkle_root!)}
                            title="Merkle root'u kopyala"
                          >
                            <Clipboard className="w-3 h-3" />
                            <span>hash</span>
                          </button>
                        )}
                        {message.error_text && (
                          <p className="mt-2 text-[12px] text-amber-300">
                            {message.error_text}
                          </p>
                        )}
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
              <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 space-y-3">
                <div className="flex gap-3">
                  <div className="w-48">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs text-gray-400">Model</label>
                      {modelsLoading && (
                        <span className="text-[10px] text-gray-500">yükleniyor…</span>
                      )}
                      {modelsFallback && !modelsLoading && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300">
                          demo listesi
                        </span>
                      )}
                    </div>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={modelsLoading}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60"
                    >
                      {models.map((m) => {
                        const name = m.name || m.id
                        const duplicate = models.filter(x => x.name === m.name && m.name).length > 1
                        const label = duplicate ? `${name} (${m.id})` : name
                        return (
                          <option key={m.id} value={m.id}>
                            {label}
                          </option>
                        )
                      })}
                    </select>
                    {modelsError && (
                      <p className="mt-1 text-[11px] text-amber-400">{modelsError}</p>
                    )}
                  </div>
                </div>
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
              {history.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs text-gray-400 mb-2">Recent requests</div>
                  <div className="space-y-2">
                    {history.map((h, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm text-gray-300 bg-white/5 px-3 py-2 rounded-lg">
                        <span className="font-mono text-xs">{h.model}</span>
                        <span className="text-xs">{h.durationMs ? `${h.durationMs}ms` : '—'}</span>
                        <span className="text-xs">{h.tokens ?? '—'} tok</span>
                        <span className={`text-xs ${h.status === 'ok' ? 'text-green-400' : 'text-red-300'}`}>
                          {h.status === 'ok' ? 'ok' : 'error'}
                        </span>
                        {h.fallback && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded">demo</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
