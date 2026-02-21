export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which consensus does Ambient use?",
    options: [
      "Proof of Stake",
      "Proof of Logits",
      "Proof of Authority",
      "Delegated Proof of Stake"
    ],
    correctAnswer: 1,
    explanation: "Ambient uses Proof of Logits (PoL), hashing logits to prove inference."
  },
  {
    id: 2,
    question: "What does PoL hash for verification?",
    options: [
      "Full model weights",
      "Execution traces",
      "Token logits",
      "Network state"
    ],
    correctAnswer: 2,
    explanation: "PoL hashes per-token logits to fingerprint the computation."
  },
  {
    id: 3,
    question: "Ambient is compatible with which VM?",
    options: [
      "EVM",
      "SVM (Solana Virtual Machine)",
      "Move VM",
      "CosmWasm"
    ],
    correctAnswer: 1,
    explanation: "Ambient is forked from Solana and keeps SVM compatibility for tooling and developer experience."
  },
  {
    id: 4,
    question: "Ambient is currently in which network stage?",
    options: [
      "Mainnet",
      "Testnet",
      "Devnet only",
      "Maintenance mode"
    ],
    correctAnswer: 1,
    explanation: "Ambient is positioned as an active testnet in the UI copy."
  },
  {
    id: 5,
    question: "Ambient positions itself primarily as:",
    options: [
      "A privacy L2",
      "An AI-first L1 with PoL",
      "A gaming sidechain",
      "A DeFi yield optimizer"
    ],
    correctAnswer: 1,
    explanation: "Ambient is presented as an AI-first Layer 1 using Proof of Logits."
  },
  {
    id: 6,
    question: "Default model id in the demo app is:",
    options: [
      "ambient/base",
      "ambient/large",
      "ambient/chat",
      "zai-org/GLM-4.6"
    ],
    correctAnswer: 1,
    explanation: "The UI defaults to the 'ambient/large' model unless changed in settings or API response."
  },
  {
    id: 7,
    question: "What kind of hardware can mine/validate in Ambient?",
    options: [
      "ASICs only",
      "Standard GPUs",
      "CPU-only devices",
      "Special AI accelerators only"
    ],
    correctAnswer: 1,
    explanation: "The narrative emphasizes GPU-based mining/validation; no ASIC lock-in is mentioned."
  },
  {
    id: 8,
    question: "Which part of the stack does PoL secure?",
    options: [
      "Token transfers only",
      "Smart contracts only",
      "AI inference outputs",
      "File storage"
    ],
    correctAnswer: 2,
    explanation: "PoL is designed to secure AI inference outputs via logit hashing."
  },
  {
    id: 9,
    question: "Which compatibility benefit does SVM give Ambient?",
    options: [
      "Runs EVM bytecode natively",
      "Reuses Solana tooling and runtimes",
      "Allows off-chain enclaves",
      "Adds built-in ZK circuits"
    ],
    correctAnswer: 1,
    explanation: "SVM means Solana Virtual Machine, enabling reuse of Solana tooling/runtimes."
  },
  {
    id: 10,
    question: "Why is PoL verification cheap?",
    options: [
      "It samples hashed logits instead of executing the model again",
      "It skips safety checks",
      "It uses smaller models for verification",
      "It prunes layers at runtime"
    ],
    correctAnswer: 0,
    explanation: "PoL uses hashed logits to prove computation, avoiding full re-execution for verifiers."
  }
]

export interface LevelTier {
  name: string
  minScore: number
  maxScore: number
  color: string
  description: string
  gradient: string
}

export const levelTiers: LevelTier[] = [
  {
    name: "Ambient Novice",
    minScore: 0,
    maxScore: 3,
    color: "#6B7280",
    description: "Just starting your Ambient journey",
    gradient: "from-gray-600 to-gray-500"
  },
  {
    name: "Blockchain Explorer",
    minScore: 4,
    maxScore: 5,
    color: "#3B82F6",
    description: "Understanding the basics",
    gradient: "from-blue-600 to-blue-500"
  },
  {
    name: "PoL Enthusiast",
    minScore: 6,
    maxScore: 7,
    color: "#8B5CF6",
    description: "Grasping Proof of Logits",
    gradient: "from-purple-600 to-purple-500"
  },
  {
    name: "AI Chain Expert",
    minScore: 8,
    maxScore: 9,
    color: "#EC4899",
    description: "Deep knowledge of AI blockchain",
    gradient: "from-pink-600 to-pink-500"
  },
  {
    name: "Ambient Master",
    minScore: 10,
    maxScore: 10,
    color: "#F59E0B",
    description: "Complete mastery of Ambient",
    gradient: "from-amber-600 to-amber-500"
  }
]

export function getLevelForScore(score: number): LevelTier {
  return levelTiers.find(tier => score >= tier.minScore && score <= tier.maxScore) || levelTiers[0]
}
