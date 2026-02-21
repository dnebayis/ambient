'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, Sparkles, Shield, AlertCircle, Copy } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  verified?: boolean
  merkle_root?: string
  model?: string
  error_status?: number
  error_text?: string
}

type ModelInfo = {
  id: string
  name?: string
  context_length?: number
}

const SUGGESTED_QUESTIONS = [
  "What is Ambient?",
  "How does Proof of Logits work?",
  "What makes Ambient different from Bittensor?",
  "How can I mine on Ambient?",
  "What is the verification overhead?",
  "Is Ambient compatible with Solana?",
]

export default function AmbientChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const FALLBACK_MODELS: ModelInfo[] = [
    { id: 'ambient/large', name: 'Ambient Large', context_length: 128000 },
    { id: 'zai-org/GLM-4.6', name: 'GLM-4.6', context_length: 200000 },
  ]
  const [models, setModels] = useState<ModelInfo[]>(FALLBACK_MODELS)
  const [selectedModel, setSelectedModel] = useState('ambient/large')
  const [modelsLoading, setModelsLoading] = useState(false)
  const [modelsError, setModelsError] = useState<string | null>(null)
  const [modelsFallback, setModelsFallback] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
          const ids = list.map(m => m.id)
          setModels(list)
          setSelectedModel(prev => (ids.includes(prev) ? prev : ids[0]))
          setModelsFallback(Boolean(data.fallback))
        } else if (data?.error) {
          setModelsError('Model list alınamadı, varsayılan modeller gösteriliyor.')
          setModels(FALLBACK_MODELS)
          const fallbackIds = FALLBACK_MODELS.map(m => m.id)
          setSelectedModel(prev => (fallbackIds.includes(prev) ? prev : fallbackIds[0]))
          setModelsFallback(true)
        }
      } catch (err) {
        setModelsError('Model listesi yüklenemedi, varsayılan modeller gösteriliyor.')
        setModels(FALLBACK_MODELS)
        const fallbackIds = FALLBACK_MODELS.map(m => m.id)
        setSelectedModel(prev => (fallbackIds.includes(prev) ? prev : fallbackIds[0]))
        setModelsFallback(true)
      } finally {
        setModelsLoading(false)
      }
    }
    fetchModels()
  }, [])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    setError(null)
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      let data: any
      if (!response.ok) {
        // Try to surface API's error payload
        const errorBody = await response.json().catch(() => null)
        const message = errorBody?.error || errorBody?.message || `API error: ${response.status}`
        const err: any = new Error(message)
        err.status = response.status
        throw err
      } else {
        data = await response.json()
      }

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || data.message || 'No response',
        verified: data.verified,
        merkle_root: data.merkle_root,
        model: selectedModel,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Chat error:', err)
      const status = (err as any)?.status
      const suggestion =
        status === 401
          ? 'API key kontrol edin.'
          : status === 429
          ? 'Daha yavaş tekrar deneyin.'
          : 'Tekrar deneyin.'
      setError(`${err instanceof Error ? err.message : 'Failed to send message'} ${suggestion}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800 bg-gray-900/80">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Bot className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Ambient AI Playground</h3>
          <p className="text-xs text-gray-400">Specialized in Ambient blockchain</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex flex-col items-end mr-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={modelsLoading}
              className="bg-gray-900/80 border border-gray-800 text-xs rounded-lg px-2 py-1 focus:outline-none disabled:opacity-60"
            >
              {models.map((m) => {
                const name = m.name || m.id
                const duplicate = models.filter(x => x.name === m.name && m.name).length > 1
                const label = duplicate ? `${name} (${m.id})` : name
                return (
                  <option key={m.id} value={m.id}>{label}</option>
                )
              })}
            </select>
            {modelsLoading && (
              <span className="text-[10px] text-gray-500 mt-0.5">yükleniyor…</span>
            )}
            {modelsError && (
              <span className="text-[10px] text-amber-400 mt-0.5">{modelsError}</span>
            )}
            {modelsFallback && !modelsLoading && (
              <span className="text-[10px] text-amber-300 mt-0.5">demo listesi</span>
            )}
          </div>
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-500">Verified Inference</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Ask me about Ambient!</h4>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              I'm specialized in Ambient blockchain technology. Ask me about Proof of Logits,
              mining, API, architecture, or anything Ambient-related.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_QUESTIONS.map((question, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sendMessage(question)}
                  className="px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                  ? 'bg-blue-600'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-2xl ${message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                  }`}>
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-gray-400">
                    {message.model && <span className="px-2 py-0.5 bg-white/5 rounded">{message.model}</span>}
                    {message.error_status && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-200 rounded">
                        Hata {message.error_status}
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>
                {message.role === 'assistant' && message.verified && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-green-500">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                    {message.merkle_root && (
                      <button
                        type="button"
                        className="flex items-center gap-1 text-[11px] text-gray-300 hover:text-white"
                        onClick={() => navigator.clipboard?.writeText(message.merkle_root!)}
                        title="Merkle root'u kopyala"
                      >
                        <Copy className="w-3 h-3" />
                        <span>hash</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-800 rounded-2xl p-4">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-gray-900/80">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Ambient..."
            rows={1}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by Ambient's verified AI inference
        </p>
      </form>
    </div>
  )
}
