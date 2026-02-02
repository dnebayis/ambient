'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { quizQuestions, getLevelForScore } from '@/lib/quiz-data'
import TicketGenerator from '@/components/quiz/TicketGenerator'
import { ArrowRight, Trophy, CheckCircle2, XCircle } from 'lucide-react'

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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-effect"
                >
                  <Trophy className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-400">Ambient Knowledge Quiz</span>
                </motion.div>
                <h1 className="text-5xl font-bold mb-4 gradient-text">Test Your Knowledge</h1>
                <p className="text-xl text-gray-400">
                  Challenge yourself with 10 questions about Ambient blockchain
                </p>
              </div>

              <form onSubmit={handleUsernameSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                    Enter your Twitter username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace('@', ''))}
                    placeholder="your_username"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required
                    pattern="[a-zA-Z0-9_]{1,15}"
                    title="Valid Twitter username (1-15 characters, alphanumeric and underscore only)"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Your profile picture will be included in your quiz result ticket
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Start Quiz
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>
            </motion.div>
          )}

          {quizState === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-3xl"
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                  <span className="text-sm font-medium">
                    Score: <span className="text-blue-500">{score}</span>
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-bold mb-8">
                  {quizQuestions[currentQuestion].question}
                </h2>

                <div className="space-y-4 mb-8">
                  {quizQuestions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedOption === index
                    const isCorrect = index === quizQuestions[currentQuestion].correctAnswer
                    const showResult = showExplanation

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                        whileTap={{ scale: showExplanation ? 1 : 0.98 }}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showExplanation}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showResult
                            ? isCorrect
                              ? 'border-green-500 bg-green-500/10'
                              : isSelected
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-gray-800 bg-gray-900/50'
                            : isSelected
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex-1">{option}</span>
                          {showResult && isCorrect && (
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                    >
                      <p className="text-sm text-gray-300">
                        {quizQuestions[currentQuestion].explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextQuestion}
                disabled={selectedOption === null || showExplanation}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                {showExplanation ? 'Loading next question...' : 'Submit Answer'}
                {!showExplanation && <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </motion.div>
          )}

          {quizState === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-8"
              >
                <Trophy className="w-24 h-24 mx-auto mb-4 text-blue-500" />
              </motion.div>

              <h1 className="text-5xl font-bold mb-4 gradient-text">Quiz Complete!</h1>
              <p className="text-2xl text-gray-400 mb-8">
                Great job, <span className="text-white font-medium">@{username}</span>!
              </p>

              <div className="glass-effect rounded-2xl p-8 mb-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Your Score</p>
                    <p className="text-6xl font-bold">{score}<span className="text-3xl text-gray-400">/10</span></p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Achievement Level</p>
                    <div className={`inline-block px-6 py-3 rounded-lg bg-gradient-to-r ${level.gradient} mb-2`}>
                      <p className="text-2xl font-bold">{level.name}</p>
                    </div>
                    <p className="text-sm text-gray-400">{level.description}</p>
                  </div>
                </div>

                <div className="h-px bg-gray-800 mb-8" />

                <p className="text-gray-400">
                  You answered {score} out of {quizQuestions.length} questions correctly!
                  {score === quizQuestions.length && ' Perfect score! 🎉'}
                  {score >= 8 && score < quizQuestions.length && ' Excellent work! 👏'}
                  {score >= 6 && score < 8 && ' Good job! 👍'}
                  {score < 6 && ' Keep learning! 📚'}
                </p>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTicket(true)}
                  className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Generate Ticket
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={restartQuiz}
                  className="flex-1 px-6 py-4 glass-effect rounded-lg font-medium hover:bg-white/5 transition-colors"
                >
                  Try Again
                </motion.button>
              </div>
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
