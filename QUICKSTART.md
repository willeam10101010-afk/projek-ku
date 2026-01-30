# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v16+ installed
- MetaMask browser extension
- Testnet ETH (we'll help you get this)

### Step 1: Clone and Install
```bash
git clone https://github.com/<your-github-username>/projek-ku.git
cd projek-ku
npm install
```

### Step 2: Get Testnet ETH
Visit one of these faucets and get free testnet ETH:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

You need about 0.1 ETH for deployment and testing.

### Step 3: Configure
```bash
cp .env.example .env
```

Edit `.env` and add your private key (from MetaMask):
```env
PRIVATE_KEY=your_private_key_here
```

⚠️ **Never share or commit your private key!**

### Step 4: Deploy to Testnet
```bash
npm run compile
npm run deploy:testnet
```

Save the contract addresses shown in the output!

### Step 5: Update Frontend
Edit `frontend/app.js` lines 2-3:
```javascript
const MINING_CONTRACT_ADDRESS = "0x..."; // Your address here
const USDT_CONTRACT_ADDRESS = "0x...";   // Your address here
```

Also update `.env`:
```env
MINING_CONTRACT_ADDRESS=0x...
USDT_CONTRACT_ADDRESS=0x...
```

### Step 6: Start the App
```bash
# Terminal 1 - Backend
npm run start:backend

# Terminal 2 - Frontend  
npm run start:frontend
```

Visit **http://localhost:8080**

### Step 7: Start Mining!
1. Click "Connect MetaMask"
2. Switch to Sepolia network in MetaMask
3. Click "Start Mining"
4. Watch your USDT rewards grow! 💰

## 🎯 What's Next?

- Read [MINING_GUIDE.md](MINING_GUIDE.md) for detailed usage
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review [SECURITY.md](SECURITY.md) for security best practices

## ⚡ Quick Commands

```bash
npm run compile          # Compile contracts
npm test                 # Run tests
npm run deploy:testnet   # Deploy to Sepolia
npm run start:frontend   # Start frontend (port 8080)
npm run start:backend    # Start backend (port 3000)
```

## 🆘 Having Issues?

Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common solutions.

## 📚 Full Documentation

- [README.md](README.md) - Project overview
- [MINING_GUIDE.md](MINING_GUIDE.md) - Complete user guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [API.md](API.md) - API documentation
- [SECURITY.md](SECURITY.md) - Security information
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute

---

**Happy Mining! ⛏️💎**
