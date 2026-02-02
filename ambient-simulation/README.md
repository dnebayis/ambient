# Ambient Simulation

An interactive simulation and educational showcase of **Ambient** - the world's first AI-powered Proof of Work blockchain.

## About Ambient

Ambient is an SVM-compatible Proof of Work Layer 1 blockchain that integrates machine learning inference at the protocol level. It positions "machine intelligence as currency," offering Bitcoin-like mining economics combined with AI productivity.

### Key Features

- **Proof of Logits (PoL)**: Revolutionary consensus mechanism performing LLM operations at 100x the speed of legacy systems
- **600B+ Parameter Model**: Hyperscaled verified inference on massive language models
- **0.1% Verification Overhead**: Near-zero cost verification with cryptographic security
- **GPU Mining**: Bitcoin-like rewards for nodes that infer, fine-tune, or train
- **Solana Compatibility**: Full compatibility with Solana development tools and ecosystem

## This Project

This is an interactive web simulation built to demonstrate and educate about Ambient's technology. It features:

- 🎨 **Minimalist Vercel-style Design**: Clean, professional interface
- 🤖 **AI Chat Playground**: Real-time chat with Ambient's 600B+ model via public API
- 📊 **Model Dashboard**: Live model data from Ambient API
- 🔬 **Research Demo**: AI-powered research engine with streaming results
- 🔮 **3D Network Visualization**: Interactive exploration of network topology
- ⚡ **Live Mining Simulator**: Experience GPU mining economics in real-time
- 🧠 **Proof of Logits Visualizer**: Understand how logit fingerprinting works
- 📡 **Real API Integration**: Uses Ambient's public API endpoints

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Three.js** & **React Three Fiber** - 3D visualization
- **Lucide React** - Icons

## Getting Started

```bash
# Install dependencies
npm install

# (Optional) Configure API key for live features
cp .env.example .env.local
# Edit .env.local and add your Ambient API key from https://api.ambient.xyz

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the simulation.

## API Integration

This project integrates with Ambient's public API (https://api.ambient.xyz):

- **Chat Completions**: Real-time AI inference
- **Model Listing**: Live model data
- **Research Engine**: AI-powered research
- **Token Counting**: Calculate inference costs

The app works in demo mode without an API key, but connecting to the real API provides authentic Ambient AI responses.

## Features

### AI Chat Playground 🤖
Real-time chat interface powered by Ambient's API:
- Chat with 600B+ parameter models
- Token counting and usage tracking
- Response time monitoring
- Proof of Logits verification info

### Model Dashboard 📊
Live model explorer using Ambient API:
- Browse all available models
- Model specifications and capabilities
- Performance metrics
- Interactive model details

### Research Demo 🔬
AI-powered research engine:
- Submit research queries
- Stream research progress
- View AI-generated findings
- Download PDF reports

### Proof of Logits Visualizer 🧠
Interactive demonstration of logit fingerprinting:
- Live token generation
- Logit value visualization
- Verification process animation
- Cryptographic proof explanation

### Mining Simulator ⚡
Real-time GPU mining simulation:
- Live hashrate monitoring
- Block discovery tracking
- Reward calculations
- GPU utilization metrics

### Network Visualization 🔮
3D interactive network topology:
- Consensus nodes
- Validators & Miners
- Edge nodes
- Live network connections
- Orbital camera controls

### Architecture & Documentation 📚
Comprehensive technical overview:
- System specifications
- PoL consensus explained
- Developer resources
- External links

## Learn More

- [Ambient Website](https://ambient.xyz)
- [Documentation](https://docs.ambient.xyz)
- [Twitter](https://x.com/ambient_xyz)
- [Testnet](https://app.ambient.xyz)

## License

MIT - This is an educational simulation project.

## Disclaimer

This is an independent educational simulation created to demonstrate Ambient's technology. It is not an official Ambient product.
