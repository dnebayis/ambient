'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { quizQuestions, getLevelForScore } from '@/lib/quiz-data'
import TicketGenerator from '@/components/quiz/TicketGenerator'
import { ArrowRight, Trophy, CheckCircle2, XCircle, Sparkles } from 'lucide-react'

type QuizState = 'username' | 'quiz' | 'results'

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('username')
  const [username, setUsername] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [showTicket, setShowTicket] = useState(false)

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim().length > 0) {
      setQuizState('quiz')
    }
  }

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return
    setSelectedOption(optionIndex)
  }

  const handleNextQuestion = () => {
    if (selectedOption === null) return

    const isCorrect = selectedOption === quizQuestions[currentQuestion].correctAnswer
    if (isCorrect) {
      setScore(score + 1)
    }

    setSelectedAnswers([...selectedAnswers, selectedOption])
    setShowExplanation(true)

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
        setShowExplanation(false)
      } else {
        setQuizState('results')
      }
    }, 2500)
  }

  const restartQuiz = () => {
    setQuizState('username')
    setUsername('')
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setSelectedOption(null)
    setShowExplanation(false)
    setScore(0)
    setShowTicket(false)
  }

  const level = getLevelForScore(score)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 grid-background opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {quizState === 'username' && (
            <motion.div
              key="username"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
                  className="inline-flex items-center gap-3 px-5 py-3 mb-8 rounded-full glass-effect"
                  style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <Trophy className="w-6 h-6 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-300 tracking-wide">
                    AMBIENT KNOWLEDGE QUIZ
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl font-bold mb-6 gradient-text"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Test Your
                  <br />
                  Knowledge
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-gray-400 leading-relaxed"
                >
                  Challenge yourself with 10 questions about
                  <br />
                  <span className="text-blue-400 font-medium">Ambient blockchain</span>
                </motion.p>
              </div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleUsernameSubmit}
                className="space-y-6"
              >
                <div className="glass-effect rounded-2xl p-6" style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <label
                    htmlFor="username"
                    className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3"
                  >
                    Twitter Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg font-medium">
                      @
                    </span>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace('@', ''))}
                      placeholder="your_username"
                      className="w-full pl-10 pr-4 py-4 bg-gray-900/50 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-lg font-medium"
                      required
                      pattern="[a-zA-Z0-9_]{1,15}"
                      title="Valid Twitter username (1-15 characters, alphanumeric and underscore only)"
                      style={{ letterSpacing: '-0.01em' }}
                    />
                  </div>
                  <p className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Your profile picture will be included in your result ticket
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-xl font-semibold text-base transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  Start Quiz
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.form>
            </motion.div>
          )}

          {quizState === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-3xl"
            >
              {/* Progress Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 glass-effect rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Progress</div>
                    <div className="text-lg font-bold">
                      Question <span className="text-blue-500">{currentQuestion + 1}</span>
                      <span className="text-gray-600"> / {quizQuestions.length}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Score</div>
                    <div className="text-2xl font-bold text-blue-500">{score}</div>
                  </div>
                </div>
                <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </motion.div>

              {/* Question Card */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="glass-effect rounded-2xl p-8 mb-6"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                <motion.h2
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold mb-8 leading-tight"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {quizQuestions[currentQuestion].question}
                </motion.h2>

                <div className="space-y-3 mb-8">
                  {quizQuestions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedOption === index
                    const isCorrect = index === quizQuestions[currentQuestion].correctAnswer
                    const showResult = showExplanation

                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ scale: showExplanation ? 1 : 1.01, x: showExplanation ? 0 : 4 }}
                        whileTap={{ scale: showExplanation ? 1 : 0.99 }}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showExplanation}
                        className={`w-full text-left p-5 rounded-xl transition-all duration-300 ${
                          showResult
                            ? isCorrect
                              ? 'bg-green-500/10 border-2 border-green-500/50'
                              : isSelected
                              ? 'bg-red-500/10 border-2 border-red-500/50'
                              : 'bg-gray-900/30 border-2 border-gray-800/50'
                            : isSelected
                            ? 'bg-blue-500/10 border-2 border-blue-500'
                            : 'bg-gray-900/30 border-2 border-gray-800/50 hover:border-gray-700 hover:bg-gray-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                                showResult
                                  ? isCorrect
                                    ? 'bg-green-500 text-white'
                                    : isSelected
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-800 text-gray-500'
                                  : isSelected
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-800 text-gray-500'
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-base">{option}</span>
                          </div>
                          {showResult && isCorrect && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            >
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </motion.div>
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <motion.div
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            >
                              <XCircle className="w-6 h-6 text-red-500" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {quizQuestions[currentQuestion].explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: selectedOption !== null && !showExplanation ? 1.02 : 1 }}
                whileTap={{ scale: selectedOption !== null && !showExplanation ? 0.98 : 1 }}
                onClick={handleNextQuestion}
                disabled={selectedOption === null || showExplanation}
                className="w-full flex items-center justify-center gap-2 px-6 py-5 rounded-xl font-semibold text-base transition-all duration-300 disabled:cursor-not-allowed"
                style={{
                  background: selectedOption !== null && !showExplanation
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : '#1f2937',
                  color: selectedOption !== null && !showExplanation ? '#ffffff' : '#6b7280',
                  boxShadow: selectedOption !== null && !showExplanation
                    ? '0 8px 24px rgba(59, 130, 246, 0.3)'
                    : 'none',
                }}
              >
                {showExplanation ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Loading next question...
                  </>
                ) : (
                  <>
                    Submit Answer
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {quizState === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-2xl text-center"
            >
              {/* Trophy Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 12 }}
                className="mb-8"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: 0.6, duration: 0.6, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full blur-2xl"
                    style={{ background: `radial-gradient(circle, ${level.color}60 0%, transparent 70%)` }}
                  />
                  <Trophy className="relative w-24 h-24 mx-auto mb-4" style={{ color: level.color }} />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl font-bold mb-4 gradient-text"
                style={{ letterSpacing: '-0.02em' }}
              >
                Quiz Complete!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-400 mb-10"
              >
                Great work, <span className="text-white font-semibold">@{username}</span>!
              </motion.p>

              {/* Results Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-effect rounded-2xl p-8 mb-8"
                style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
              >
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Score */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-medium">
                      Your Score
                    </div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-7xl font-bold" style={{ letterSpacing: '-0.03em' }}>
                        {score}
                      </span>
                      <span className="text-3xl text-gray-500 font-medium">/10</span>
                    </div>
                    <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ background: `linear-gradient(90deg, ${level.color}, ${level.color}cc)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(score / 10) * 100}%` }}
                        transition={{ delay: 0.8, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                      />
                    </div>
                  </motion.div>

                  {/* Achievement */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-medium">
                      Achievement
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-block px-5 py-2.5 rounded-xl mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${level.color}20 0%, ${level.color}10 100%)`,
                        border: `2px solid ${level.color}40`,
                      }}
                    >
                      <p
                        className="text-2xl font-bold"
                        style={{
                          color: level.color,
                          letterSpacing: '-0.01em',
                          textShadow: `0 0 20px ${level.color}60`,
                        }}
                      >
                        {level.name}
                      </p>
                    </motion.div>
                    <p className="text-sm text-gray-500 px-4">{level.description}</p>
                  </motion.div>
                </div>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-900 px-4 text-xs text-gray-600 uppercase tracking-wider">
                      Performance
                    </span>
                  </div>
                </div>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-base text-gray-400 leading-relaxed"
                >
                  You answered <span className="text-white font-semibold">{score}</span> out of{' '}
                  <span className="text-white font-semibold">{quizQuestions.length}</span> questions correctly!
                  {score === quizQuestions.length && ' 🎉 Perfect score!'}
                  {score >= 8 && score < quizQuestions.length && ' 👏 Excellent work!'}
                  {score >= 6 && score < 8 && ' 👍 Good job!'}
                  {score < 6 && ' 📚 Keep learning!'}
                </motion.p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTicket(true)}
                  className="flex-1 px-8 py-5 rounded-xl font-semibold text-base transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  Generate Ticket
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={restartQuiz}
                  className="flex-1 px-8 py-5 glass-effect rounded-xl font-semibold text-base hover:bg-white/5 transition-all"
                >
                  Try Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ticket Modal */}
      {showTicket && (
        <TicketGenerator
          username={username}
          score={score}
          level={level}
          onClose={() => setShowTicket(false)}
        />
      )}
    </div>
  )
}
