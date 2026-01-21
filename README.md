# Crypto Mining DApp - Earn USDT Tokens 🪙⛏️

A decentralized application (DApp) that enables users to mine cryptocurrency and earn USDT tokens on the Ethereum blockchain.

## 🌟 Features

- ⛏️ **Cryptocurrency Mining**: Browser-based Proof-of-Work mining
- 💰 **USDT Rewards**: Earn Mock USDT tokens for successful mining
- 🔗 **Web3 Integration**: Connect with MetaMask and Ethereum wallets
- 📊 **Real-time Stats**: Track mining progress and earnings
- 🔒 **Secure**: Built with OpenZeppelin security standards
- 🌐 **Backend API**: RESTful API for statistics and data

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to testnet
npm run deploy:testnet

# Start frontend
npm run start:frontend

# Start backend (in new terminal)
npm run start:backend
```

Visit `http://localhost:8080` to start mining!

## 📚 Documentation

- [Mining Guide](MINING_GUIDE.md) - Complete guide to using the DApp
- [Deployment Guide](DEPLOYMENT.md) - Deploy to testnet and production

## 🏗️ Project Structure

```
├── contracts/          # Solidity smart contracts
├── scripts/           # Deployment scripts
├── test/             # Contract tests
├── frontend/         # Web interface
├── backend/          # API server
└── docs/             # Documentation
```

## 🔧 Technology Stack

- **Smart Contracts**: Solidity 0.8.20
- **Development**: Hardhat
- **Frontend**: HTML5, CSS3, JavaScript, Ethers.js
- **Backend**: Node.js, Express
- **Security**: OpenZeppelin Contracts

## 🎯 How It Works

1. Connect your MetaMask wallet
2. Start mining to find valid nonces
3. Submit successful nonces to smart contract
4. Receive USDT rewards automatically
5. Track your earnings in real-time

## 🧪 Testing

```bash
npm test
```

All tests include:
- Contract deployment
- Mining functionality
- Security features
- Admin functions
- Edge cases

## 📦 Deployment

### Testnet (Recommended for testing)

```bash
npm run deploy:testnet
```

### Mainnet (After thorough testing)

⚠️ Get professional audit first!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔒 Security

- ReentrancyGuard protection
- Access control for admin functions
- Nonce uniqueness enforcement
- Input validation
- OpenZeppelin standards

## 📊 Contract Details

### MockUSDT
- Standard ERC20 token
- 6 decimals (like real USDT)
- Mintable by owner

### CryptoMining
- Proof-of-Work validation
- Configurable difficulty
- Adjustable rewards
- Statistics tracking

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Write tests
4. Submit pull request

## 📝 License

MIT License

## ⚠️ Disclaimer

Educational software. Use at your own risk. Not financial advice.

## 🔗 Resources

- [Hardhat Docs](https://hardhat.org/docs)
- [OpenZeppelin](https://docs.openzeppelin.com/contracts)
- [Ethers.js](https://docs.ethers.org/)

---

Made with ❤️ by the community
