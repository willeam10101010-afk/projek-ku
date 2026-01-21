# Quick Start Guide

This is a quick reference for getting started with the Ethereum Message DApp.

## 🎯 For Developers (Local Testing)

### 1. One-Command Local Setup

```bash
# Make the script executable (first time only)
chmod +x scripts/local-deploy.sh

# Run the local deployment script
./scripts/local-deploy.sh
```

This will:
- Install all dependencies
- Compile the smart contract
- Run tests
- Start a local Hardhat network
- Deploy the contract locally
- Configure the frontend

### 2. Start Frontend

In a new terminal:
```bash
cd frontend
npm start
```

### 3. Configure MetaMask

1. Install MetaMask browser extension
2. Add Localhost 8545 network:
   - Network Name: Hardhat Local
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency: ETH
3. Import an account using a private key from Hardhat output

### 4. Test the DApp

1. Visit http://localhost:3000
2. Connect MetaMask
3. Read and update messages!

## 🌐 For Deployment (Testnet)

### Prerequisites
- Infura account (get API key from https://infura.io)
- MetaMask with testnet ETH
- Domain name (for VPS deployment)

### Quick Deploy to Sepolia

1. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your PRIVATE_KEY and SEPOLIA_RPC_URL
   ```

2. **Get Testnet ETH**
   - Visit https://sepoliafaucet.com/
   - Request ETH for your address

3. **Deploy Contract**
   ```bash
   npm run deploy:sepolia
   ```
   Save the contract address!

4. **Configure Frontend**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env and add your contract address
   ```

5. **Build Frontend**
   ```bash
   npm run build
   ```

6. **Deploy to VPS**
   - Follow detailed instructions in `deployment/VPS-DEPLOYMENT.md`

## 📚 Key Files

| File | Purpose |
|------|---------|
| `contracts/MessageStorage.sol` | Smart contract source code |
| `scripts/deploy.js` | Deployment script |
| `test/MessageStorage.test.js` | Contract tests |
| `frontend/src/App.js` | Main React component |
| `frontend/src/config.js` | Contract ABI and configuration |
| `hardhat.config.js` | Hardhat configuration |
| `deployment/VPS-DEPLOYMENT.md` | Full VPS deployment guide |
| `deployment/TESTING.md` | Testing guide |

## 🔧 Common Commands

### Smart Contract
```bash
npm run compile        # Compile contracts
npm test              # Run tests
npm run deploy:local  # Deploy to local network
npm run deploy:sepolia # Deploy to Sepolia testnet
```

### Frontend
```bash
cd frontend
npm start             # Start development server
npm run build         # Build for production
npm test              # Run tests
```

## 🆘 Quick Troubleshooting

### Issue: MetaMask not connecting
**Solution**: Make sure you're on the correct network (Hardhat Local or Sepolia)

### Issue: Transaction failing
**Solution**: Check you have enough ETH and are on the correct network

### Issue: Frontend not loading
**Solution**: 
1. Check contract address in `frontend/.env`
2. Verify the contract is deployed
3. Check browser console for errors

### Issue: Build errors
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📖 Documentation

- **Full README**: See `README.md` for comprehensive documentation
- **VPS Deployment**: See `deployment/VPS-DEPLOYMENT.md` for server setup
- **Testing Guide**: See `deployment/TESTING.md` for testing instructions

## 🎓 Learning Path

1. ✅ Run locally with `./scripts/local-deploy.sh`
2. ✅ Test message storage and retrieval
3. ✅ Deploy to Sepolia testnet
4. ✅ Configure frontend for testnet
5. ✅ Deploy to VPS (optional)
6. ✅ Add custom features

## 🔗 Useful Links

- [Ethereum Docs](https://ethereum.org/en/developers/)
- [Hardhat](https://hardhat.org/)
- [Ethers.js](https://docs.ethers.org/)
- [React](https://react.dev/)
- [MetaMask](https://metamask.io/)
- [Sepolia Faucet](https://sepoliafaucet.com/)

---

**Need help?** Check the full documentation in `README.md` or create an issue on GitHub.
