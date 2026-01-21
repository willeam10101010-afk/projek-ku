# Ethereum Message DApp

A decentralized application (DApp) built on Ethereum that allows users to store and retrieve messages on the blockchain. This project demonstrates full-stack blockchain development with Solidity smart contracts and a React frontend.

## 🌟 Features

- **Smart Contract**: Solidity-based contract for storing and retrieving messages
- **Frontend Interface**: Modern React-based UI for blockchain interaction
- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Testnet Support**: Deployable on Sepolia, Goerli, or other Ethereum testnets
- **VPS Ready**: Complete deployment guide for hosting on a VPS with HTTPS

## 📋 Prerequisites

- Node.js v18.x or higher
- npm or yarn package manager
- MetaMask browser extension
- Testnet ETH (from faucets)
- Basic knowledge of Ethereum and blockchain

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/willeam10101010-afk/projek-ku.git
cd projek-ku
```

### 2. Install Dependencies

```bash
# Install Hardhat dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your values:
```
PRIVATE_KEY=your_metamask_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

**⚠️ WARNING**: Never commit your `.env` file to version control!

### 4. Get Testnet ETH

Visit one of these faucets to get free testnet ETH:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Goerli Faucet](https://goerlifaucet.com/)

## 🔧 Development

### Compile Smart Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Deploy to Local Network

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy contract
npm run deploy:local
```

### Deploy to Testnet (Sepolia)

```bash
npm run deploy:sepolia
```

Save the contract address from the output!

### Run Frontend Locally

```bash
cd frontend

# Create .env file
cp .env.example .env
# Edit .env and add your contract address

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
projek-ku/
├── contracts/              # Solidity smart contracts
│   └── MessageStorage.sol  # Main contract
├── scripts/                # Deployment scripts
│   └── deploy.js           # Contract deployment
├── test/                   # Contract tests
│   └── MessageStorage.test.js
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js         # Main component
│   │   ├── App.css        # Styles
│   │   └── config.js      # Contract configuration
│   └── public/
├── deployment/             # Deployment configuration
│   ├── nginx.conf         # Nginx configuration
│   └── VPS-DEPLOYMENT.md  # VPS deployment guide
├── hardhat.config.js      # Hardhat configuration
└── package.json           # Project dependencies
```

## 🔐 Smart Contract

### MessageStorage.sol

The contract provides three main functions:

1. **Constructor**: Initializes the contract with an initial message
2. **setMessage(string)**: Updates the stored message
3. **getMessage()**: Retrieves the current message

```solidity
// Set a new message
await contract.setMessage("Hello, Blockchain!");

// Get current message
const message = await contract.getMessage();
```

### Events

- `MessageUpdated(string newMessage, address updatedBy)`: Emitted when message is updated

## 🌐 Frontend Usage

### Connect Wallet

1. Click "Connect MetaMask" button
2. Approve the connection in MetaMask
3. Ensure you're on the correct network (Sepolia/Goerli)

### View Message

- The current message is displayed automatically after connecting
- Click "Refresh" to reload the message from the blockchain

### Update Message

1. Enter your new message in the text area
2. Click "Update Message"
3. Confirm the transaction in MetaMask
4. Wait for the transaction to be mined
5. The new message will be displayed

## 🚀 Deployment

### Deploy to VPS

Follow the comprehensive guide in `deployment/VPS-DEPLOYMENT.md` for:

- VPS setup and configuration
- Smart contract deployment
- Frontend build and deployment
- Nginx configuration
- SSL/HTTPS setup with Let's Encrypt
- Security best practices

### Quick Deployment Steps

1. Deploy smart contract to testnet
2. Build frontend with contract address
3. Copy build files to VPS
4. Configure Nginx
5. Setup SSL certificate
6. Access via your domain

See [VPS-DEPLOYMENT.md](deployment/VPS-DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

### Run Contract Tests

```bash
npm test
```

Tests include:
- Contract deployment verification
- Message storage and retrieval
- Event emission
- Access control

### Manual Testing Checklist

- [ ] Connect MetaMask wallet
- [ ] Switch to correct network
- [ ] View current message
- [ ] Update message
- [ ] Verify transaction on block explorer
- [ ] Refresh and verify new message

## 📚 Technologies Used

### Smart Contract
- **Solidity** ^0.8.20 - Smart contract language
- **Hardhat** - Development environment
- **Ethers.js** - Ethereum library

### Frontend
- **React** - UI framework
- **Ethers.js** - Blockchain interaction
- **CSS3** - Styling

### Deployment
- **Nginx** - Web server
- **Let's Encrypt** - SSL certificates
- **Ubuntu** - Server OS

## 🔍 Network Configuration

### Sepolia Testnet (Recommended)
- Chain ID: 11155111 (0xaa36a7)
- RPC: https://sepolia.infura.io/v3/YOUR_KEY
- Explorer: https://sepolia.etherscan.io

### Goerli Testnet
- Chain ID: 5 (0x5)
- RPC: https://goerli.infura.io/v3/YOUR_KEY
- Explorer: https://goerli.etherscan.io

## 🐛 Troubleshooting

### MetaMask Issues
- Ensure you're on the correct network
- Check you have sufficient testnet ETH
- Try resetting your account in MetaMask settings

### Contract Interaction Issues
- Verify contract address in frontend config
- Check network configuration
- Ensure contract is deployed

### Build Issues
- Clear cache: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`

## 📖 Additional Resources

- [Ethereum Developer Docs](https://ethereum.org/en/developers/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [React Documentation](https://react.dev/)
- [MetaMask Documentation](https://docs.metamask.io/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## ⚠️ Security Notice

- This is a educational/demonstration project
- Never use mainnet private keys in development
- Always audit smart contracts before mainnet deployment
- Keep your private keys secure
- Use hardware wallets for production deployments

## 📞 Support

For questions and support:
- Create an issue in the GitHub repository
- Check existing issues for solutions
- Review the documentation

## 🎯 Next Steps

- Deploy to Ethereum mainnet (after thorough testing)
- Add more features (message history, permissions, etc.)
- Implement additional security measures
- Add unit tests for frontend components
- Set up CI/CD pipeline

---

**Built with ❤️ using Ethereum and React**
