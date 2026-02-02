# Ambient Blockchain Simulation

An interactive educational simulation showcasing **Ambient** - the world's first AI-powered Proof of Work blockchain.

![Ambient Demo](./AmbientDemo.mp4)

## Overview

This project demonstrates Ambient's revolutionary technology through an interactive web application featuring:

- 🤖 **AI Chat Playground** - Real-time chat with Ambient's 600B+ parameter model
- 📊 **Model Dashboard** - Live model data from Ambient API
- 🔬 **Research Demo** - AI-powered research engine with streaming results
- 🔮 **3D Network Visualization** - Interactive exploration of network topology
- ⚡ **Live Mining Simulator** - Experience GPU mining economics in real-time
- 🧠 **Proof of Logits Visualizer** - Understand how logit fingerprinting works

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- (Optional) Ambient API key from [https://api.ambient.xyz](https://api.ambient.xyz)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ambient

# Navigate to the project directory
cd ambient-simulation

# Install dependencies
npm install

# (Optional) Configure API key for live features
cp .env.example .env.local
# Edit .env.local and add your API key
```

### Development

```bash
# Start development server
cd ambient-simulation
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
# Build for production
cd ambient-simulation
npm run build

# Start production server
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Ambient blockchain simulation"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the Next.js configuration
   - (Optional) Add environment variable:
     - Key: `NEXT_PUBLIC_AMBIENT_API_KEY`
     - Value: Your Ambient API key
   - Click "Deploy"

3. **Configuration**
   - The `vercel.json` file is already configured for optimal deployment
   - Build and install commands are set to use the `ambient-simulation` directory
   - Framework is detected as Next.js

### Manual Deployment

If deploying to other platforms:

1. Ensure Node.js 18+ is available
2. Set the root directory to `ambient-simulation`
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variable `NEXT_PUBLIC_AMBIENT_API_KEY` (optional)

## Project Structure

```
ambient/
├── ambient-simulation/          # Main Next.js application
│   ├── app/                     # Next.js app directory
│   ├── components/              # React components
│   ├── lib/                     # Utility functions
│   ├── public/                  # Static assets
│   ├── remotion/                # Video generation (optional)
│   └── package.json
├── vercel.json                  # Vercel deployment config
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## API Integration

The application uses Ambient's public API endpoints:

- **Chat Completions**: `POST /v1/chat/completions`
- **Model Listing**: `GET /v1/models`
- **Research Engine**: `POST /v1/research`
- **Token Counting**: `POST /v1/tokens/count`

The app works in demo mode without an API key, but connecting to the real API provides authentic Ambient AI responses.

## Environment Variables

Create `ambient-simulation/.env.local` with:

```bash
# Optional: Ambient API key for live features
NEXT_PUBLIC_AMBIENT_API_KEY=your_api_key_here
```

For Vercel deployment, add this as an environment variable in the Vercel dashboard.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Smooth animations
- **Three.js & React Three Fiber** - 3D visualizations
- **Lucide React** - Icon library

## Features Documentation

For detailed feature documentation, see [ambient-simulation/README.md](./ambient-simulation/README.md)

## Learn More About Ambient

- [Ambient Website](https://ambient.xyz)
- [Documentation](https://docs.ambient.xyz)
- [Twitter](https://x.com/ambient_xyz)
- [Testnet](https://app.ambient.xyz)

## License

MIT - This is an educational simulation project.

## Disclaimer

This is an independent educational simulation created to demonstrate Ambient's technology. It is not an official Ambient product.

## Support

For issues or questions:
- Open an issue on GitHub
- Visit Ambient's official channels
- Check the documentation

---

Built with ❤️ to showcase the future of AI-powered blockchain technology.
