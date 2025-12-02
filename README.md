# 🤖 AI Content Payment & Ownership Tracker

> **🌐 LIVE DEMO:** [https://x402-gmpayer-demo-5mz5pr18x-dannysteffes-projects.vercel.app](https://x402-gmpayer-demo-5mz5pr18x-dannysteffes-projects.vercel.app)

## Project Overview

This project demonstrates a practical workflow where:

- Users request AI content generation through X402 orchestration
- Payments are processed via GMPayer integration
- Content ownership is tracked using ERC-8004 principles

## Features

- Simple web interface for content requests
- Mock payment processing with GMPayer
- Ownership tracking and verification
- Content generation simulation
- Basic user dashboard

## 🚀 Quick Start

### Local Development

```bash
git clone https://github.com/yourusername/ai-content-marketplace.git
cd ai-content-marketplace
npm install
npm start
```

Open `http://localhost:3000` in your browser.

## Architecture

- `src/orchestrator/` - X402-style orchestration logic
- `src/payment/` - GMPayer integration
- `src/ownership/` - ERC-8004 ownership tracking
- `src/web/` - Simple web interface
- `src/ai/` - Mock AI content generation

## Use Case

A content creator wants to:

1. Pay for AI-generated artwork
2. Receive verifiable ownership of the output
3. Track their content library
4. Potentially resell or license their AI-generated content

## 🎬 Quick Demo

### Key mo Points

- ✅ **X402 Orchestration**: 4-step workflow (validate → pay → generate → register)
- ✅ **GMPayer Integration**: Automatic payment processing with different rates
- ✅ **ERC-8004 Ownership**: Verifiable content ownership with proof generation
- ✅ **Real-time UI**: Modern web interface with instant updates

### Web Interface

- Clean, modern UI for content generation
- Real-time balance and transaction tracking
- Complete content library with ownership details

### Workflow Execution

- Step-by-step orchestration logging
- Payment processing with transaction IDs
- Ownership registration with proof hashes

## 🌟 Key Features

### 🔄 X402 Orchestration

- Multi-step workflow management
- Atomic operations with rollback
- Job monitoring and status tracking
- Component coordination

### 💳 GMPayer Integration

- Automatic payment processing
- Multiple pricing tiers
- Transaction history tracking
- Balance management

### 🔐 ERC-8004 Ownership

- Content registration and metadata
- Ownership proof generation
- Transfer capability
- Complete audit trail

### 🎨 AI Content Generation

- Multiple content types (text, image, audio, video)
- AI model selection
- Quality assurance
- Unique content IDs

## 📊 Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** Vanilla JavaScript, Modern CSS
- **Architecture:** Modular, component-based
- **Deployment:** Vercel, Railway, Heroku ready
- **Database:** In-memory (easily replaceable)

## 🎯 Use Cases

- **Portfolio Projects**: Showcase integration skills
- **Technical Interviews**: Demonstrate architecture knowledge
- **Hackathons**: Ready-to-deploy AI marketplace
- **Learning**: Understand blockchain concepts practically
- **Prototyping**: Foundation for real AI marketplaces

## 📈 What's Next?

- [ ] Deploy your version using this template
- [ ] Integrate real AI APIs (OpenAI, Anthropic)
- [ ] Add user authentication
- [ ] Implement database backend
- [ ] Create mobile app version
- [ ] Add blockchain smart contracts
