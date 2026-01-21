# Crypto Mining DApp - Earn USDT Tokens

A decentralized application (DApp) that enables users to mine cryptocurrency and earn USDT tokens on the Ethereum blockchain.

## 🌟 Features

- **Smart Contract Mining**: Proof-of-Work style mining mechanism implemented in Solidity
- **USDT Rewards**: Earn Mock USDT tokens for successful mining attempts
- **Web3 Integration**: Connect with MetaMask and other Ethereum wallets
- **Real-time Statistics**: Track your mining progress and earnings
- **Backend API**: RESTful API for mining statistics and data
- **Security**: Protected against common exploits with OpenZeppelin contracts

## 📋 Prerequisites

- Node.js (v16 or higher)
- MetaMask wallet extension
- Ethereum testnet ETH (Sepolia or Goerli)

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/willeam10101010-afk/projek-ku.git
cd projek-ku

# Install dependencies
npm install
```

### 2. Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Your private key (DO NOT COMMIT THIS)
PRIVATE_KEY=your_private_key_here

# RPC URLs
SEPOLIA_RPC_URL=https://rpc.sepolia.org
GOERLI_RPC_URL=https://rpc.goerli.eth.gateway.fm

# Will be filled after deployment
MINING_CONTRACT_ADDRESS=
USDT_CONTRACT_ADDRESS=
```

### 3. Compile Smart Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm test
```

### 5. Deploy to Testnet

Deploy to Sepolia testnet:

```bash
npm run deploy:testnet
```

After deployment, update your `.env` file with the contract addresses shown in the console.

### 6. Update Frontend Configuration

Edit `frontend/app.js` and update the contract addresses:

```javascript
const MINING_CONTRACT_ADDRESS = "YOUR_MINING_CONTRACT_ADDRESS";
const USDT_CONTRACT_ADDRESS = "YOUR_USDT_CONTRACT_ADDRESS";
```

### 7. Start the Application

In separate terminals:

```bash
# Terminal 1: Start frontend
npm run start:frontend

# Terminal 2: Start backend API
npm run start:backend
```

Visit `http://localhost:8080` in your browser.

## 📖 How to Use

### Mining Cryptocurrency

1. **Connect Wallet**: Click "Connect MetaMask" to connect your wallet
2. **Start Mining**: Click "Start Mining" to begin the mining process
3. **Earn Rewards**: Successfully mine blocks to earn USDT tokens
4. **Track Progress**: Monitor your statistics in real-time

### Mining Process

The mining process uses a client-side Proof-of-Work algorithm:

1. The browser searches for a valid nonce that satisfies the difficulty requirement
2. Once found, the nonce is submitted to the smart contract
3. The contract validates the proof and transfers USDT rewards
4. Statistics are updated automatically

## 🔧 Smart Contract Details

### MockUSDT Contract

A test USDT token with 6 decimals, used for reward distribution.

**Key Functions:**
- `mint(address to, uint256 amount)`: Mint new tokens (owner only)
- `balanceOf(address account)`: Get token balance

### CryptoMining Contract

Manages the mining process and reward distribution.

**Key Functions:**
- `mine(bytes32 nonce)`: Submit a mining attempt
- `getMinerStats(address miner)`: Get miner statistics
- `updateDifficulty(uint256 newDifficulty)`: Adjust mining difficulty (owner)
- `updateReward(uint256 newReward)`: Adjust reward amount (owner)
- `depositRewards(uint256 amount)`: Fund the contract with rewards

**Security Features:**
- ReentrancyGuard: Prevents reentrancy attacks
- Nonce tracking: Prevents duplicate mining attempts
- Time-based limits: Prevents spam mining
- Ownable: Admin functions protected

## 🌐 Backend API

The backend server provides REST endpoints for mining data.

### Endpoints

```bash
GET /api/health                    # Health check
GET /api/stats/global              # Global mining statistics
GET /api/stats/miner/:address      # Miner-specific statistics
GET /api/balance/:address          # USDT balance for address
GET /api/mining/info               # Mining difficulty and reward info
GET /api/gas                       # Current gas prices
```

### Example Usage

```bash
# Get global statistics
curl http://localhost:3000/api/stats/global

# Get miner statistics
curl http://localhost:3000/api/stats/miner/0x742d35Cc6634C0532925a3b844Bc454e4438f44e
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- Contract deployment
- Mining functionality
- Security features
- Admin functions
- Edge cases

## 📦 Deployment

### Testnet Deployment (Sepolia)

1. Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
2. Configure `.env` with your private key
3. Run deployment script:

```bash
npm run deploy:testnet
```

### Mainnet Deployment

**⚠️ WARNING**: Thoroughly test on testnet before mainnet deployment!

1. Update `hardhat.config.js` with mainnet configuration
2. Ensure sufficient ETH for gas fees
3. Run security audit
4. Deploy:

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## 🔒 Security Considerations

### Smart Contract Security

- ✅ Uses OpenZeppelin battle-tested contracts
- ✅ ReentrancyGuard protection
- ✅ Access control for admin functions
- ✅ Input validation
- ✅ Nonce uniqueness enforcement

### Recommended Before Mainnet

1. **Audit**: Get professional smart contract audit
2. **Testing**: Extensive testing on testnet
3. **Bug Bounty**: Consider running a bug bounty program
4. **Insurance**: Consider smart contract insurance
5. **Monitoring**: Set up monitoring and alerts

### Known Limitations

- Client-side mining is less secure than true PoW
- Gas costs may be high during network congestion
- Requires constant contract funding for rewards

## 🛠️ Development

### Project Structure

```
projek-ku/
├── contracts/           # Solidity smart contracts
│   ├── MockUSDT.sol
│   └── CryptoMining.sol
├── scripts/            # Deployment scripts
│   └── deploy.js
├── test/              # Contract tests
│   └── CryptoMining.test.js
├── frontend/          # Web frontend
│   ├── index.html
│   └── app.js
├── backend/           # Backend API server
│   └── server.js
├── hardhat.config.js  # Hardhat configuration
└── package.json       # Dependencies
```

### Adding New Features

1. Write tests first
2. Implement feature
3. Test thoroughly
4. Update documentation
5. Deploy to testnet
6. Verify functionality

## 📊 Mining Economics

### Default Configuration

- **Difficulty**: 4 (adjustable)
- **Reward**: 10 USDT per successful mine
- **Minimum Block Time**: 30 seconds between attempts
- **Contract Funding**: 100,000 USDT initial

### Adjusting Parameters

Only contract owner can adjust:
- Mining difficulty (1-10)
- Reward amount
- Minimum block time

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This is educational software. Use at your own risk. The authors are not responsible for any losses incurred through the use of this software.

## 🔗 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Documentation](https://docs.metamask.io/)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review test files for examples

## 🎯 Roadmap

- [ ] Add leaderboard functionality
- [ ] Implement mining pools
- [ ] Add mobile wallet support
- [ ] Create mining statistics dashboard
- [ ] Implement dynamic difficulty adjustment
- [ ] Add NFT rewards for top miners
- [ ] Multi-chain support

---

**Happy Mining! ⛏️**
