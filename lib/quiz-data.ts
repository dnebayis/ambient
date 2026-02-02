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
    question: "What consensus mechanism does Ambient blockchain use?",
    options: [
      "Proof of Stake",
      "Proof of Logits",
      "Proof of Authority",
      "Delegated Proof of Stake"
    ],
    correctAnswer: 1,
    explanation: "Ambient uses Proof of Logits (PoL), which leverages logits as verifiable 'mental states' in AI reasoning."
  },
  {
    id: 2,
    question: "What is the verification overhead in Ambient's Proof of Logits?",
    options: [
      "5%",
      "1%",
      "0.1%",
      "0.01%"
    ],
    correctAnswer: 2,
    explanation: "Ambient achieves a remarkably low 0.1% verification overhead, making it extremely efficient."
  },
  {
    id: 3,
    question: "How much faster is Ambient's inference compared to legacy systems?",
    options: [
      "10x",
      "50x",
      "100x",
      "1000x"
    ],
    correctAnswer: 2,
    explanation: "Ambient's hyper-optimized PoL consensus delivers 100x faster LLM operations compared to legacy systems."
  },
  {
    id: 4,
    question: "What is the parameter size of Ambient's AI model?",
    options: [
      "100B+",
      "300B+",
      "600B+",
      "1T+"
    ],
    correctAnswer: 2,
    explanation: "Ambient operates on a massive 600B+ parameter model with provably secure inference."
  },
  {
    id: 5,
    question: "Which blockchain architecture is Ambient forked from?",
    options: [
      "Ethereum",
      "Solana",
      "Polkadot",
      "Cosmos"
    ],
    correctAnswer: 1,
    explanation: "Ambient is a Solana fork chain that combines Solana's high speed with innovative PoL consensus."
  },
  {
    id: 6,
    question: "Who led Ambient's $7.2M seed funding round?",
    options: [
      "Sequoia Capital",
      "Paradigm",
      "a16z CSX",
      "Coinbase Ventures"
    ],
    correctAnswer: 2,
    explanation: "Ambient's seed round was led by a16z CSX, along with Delphi Digital and Amber Group."
  },
  {
    id: 7,
    question: "In Proof of Logits, how many tokens does a validator need to verify?",
    options: [
      "All 4000 tokens",
      "500 tokens",
      "10 tokens",
      "Just 1 token"
    ],
    correctAnswer: 3,
    explanation: "Mining requires 4000 tokens, but validation only needs to check 1 random token - making it cheap to verify but costly to mine."
  },
  {
    id: 8,
    question: "What is Ambient's core value proposition?",
    options: [
      "Speed as Currency",
      "Machine Intelligence as Currency",
      "Data as Currency",
      "Compute as Currency"
    ],
    correctAnswer: 1,
    explanation: "Ambient's tagline is 'Machine Intelligence as Currency', representing AI-powered decentralized reasoning."
  },
  {
    id: 9,
    question: "What does SVM stand for in Ambient's architecture?",
    options: [
      "Secure Virtual Machine",
      "Scalable Verification Module",
      "Solana Virtual Machine",
      "Smart Validation Mechanism"
    ],
    correctAnswer: 2,
    explanation: "SVM stands for Solana Virtual Machine, ensuring compatibility with Solana's ecosystem."
  },
  {
    id: 10,
    question: "By how much does Ambient reduce AI training costs?",
    options: [
      "2x",
      "5x",
      "10x",
      "20x"
    ],
    correctAnswer: 2,
    explanation: "Ambient's architecture reduces training costs by 10x compared to existing solutions."
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
