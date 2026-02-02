'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search, FileText, Loader2, Download, Sparkles, Brain } from 'lucide-react'
import { ambientAPI } from '@/lib/ambient-api'

interface ResearchResult {
  id: string
  query: string
  status: 'running' | 'completed' | 'error'
  summary?: string
  findings?: string[]
  timestamp: number
  error?: string
}

export default function ResearchDemo() {
  const [query, setQuery] = useState('')
  const [isResearching, setIsResearching] = useState(false)
  const [results, setResults] = useState<ResearchResult[]>([])

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim() || isResearching) {
      return
    }

    console.log('=== RESEARCH STARTED ===')
    console.log('Query:', query.trim())

    const newResearch: ResearchResult = {
      id: Date.now().toString(),
      query: query.trim(),
      status: 'running',
      timestamp: Date.now(),
    }

    setResults(prev => [newResearch, ...prev])
    setQuery('')
    setIsResearching(true)

    try {
      console.log('Calling API...')
      const response = await ambientAPI.conductResearch({
        topic: query,
        max_sources: 3,
        max_queries: 2,
        research_iterations: 1
      })

      console.log('API Response:', response)

      setResults(prev =>
        prev.map(r =>
          r.id === newResearch.id
            ? {
                ...r,
                status: 'completed' as const,
                summary: response.summary || response.answer || 'Research completed successfully',
                findings: response.findings || response.sources?.map((s: any) => s.title || s.url) || [],
              }
            : r
        )
      )
    } catch (error) {
      console.error('API Error:', error)

      setResults(prev =>
        prev.map(r =>
          r.id === newResearch.id
            ? {
                ...r,
                status: 'error' as const,
                error: error instanceof Error ? error.message : 'Research failed',
              }
            : r
        )
      )
    } finally {
      setIsResearching(false)
      console.log('=== RESEARCH ENDED ===')
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
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-effect">
            <Brain className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-400">AI Research Engine</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            <span className="gradient-text">Research</span> Demo
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Let Ambient AI conduct in-depth research on any topic. Powered by verified
            inference and distributed computation.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Research Input */}
          <form onSubmit={handleResearch} className="mb-12">
            <div className="glass-effect rounded-2xl p-6">
              <label className="block text-sm font-medium mb-3">Research Query</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., How does Proof of Logits ensure AI verification?"
                  disabled={isResearching}
                  className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={!query.trim() || isResearching}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Research
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>

          {/* Results */}
          <div className="space-y-6">
            {results.length === 0 && (
              <div className="glass-effect rounded-2xl p-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
                <p className="text-gray-500">No research conducted yet</p>
                <p className="text-sm text-gray-600 mt-2">
                  Enter a query above to start AI-powered research
                </p>
              </div>
            )}

            {results.map((result, i) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-effect rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {result.status === 'running' ? (
                        <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                      ) : result.status === 'error' ? (
                        <span className="w-4 h-4 text-red-500">✗</span>
                      ) : (
                        <Sparkles className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm text-gray-400">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{result.query}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      result.status === 'completed'
                        ? 'bg-green-500/10 text-green-500'
                        : result.status === 'error'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {result.status}
                  </span>
                </div>

                {result.status === 'running' && (
                  <p className="text-sm text-gray-400 mb-4">
                    AI is researching your query... This may take 30-60 seconds.
                  </p>
                )}

                {result.error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{result.error}</p>
                  </div>
                )}

                {result.summary && (
                  <div className="mb-4">
                    <p className="text-gray-300">{result.summary}</p>
                  </div>
                )}

                {result.findings && result.findings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">Key Findings:</h4>
                    <ul className="space-y-2">
                      {result.findings.map((finding, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <button className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors">
                      <Download className="w-4 h-4" />
                      Download PDF Report
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
