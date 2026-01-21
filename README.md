# Ethereum Message DApp

A decentralized application (DApp) built with React.js and Ethereum smart contracts that allows users to store and retrieve messages on the blockchain.

## Features

- 🔐 **Wallet Connection**: Connect your MetaMask wallet to interact with the DApp
- 💰 **Balance Display**: View your wallet balance in real-time
- 📝 **Message Storage**: Store and retrieve messages on the Ethereum blockchain
- ✅ **Input Validation**: Prevents empty messages and enforces a 280-character limit
- 🔔 **Real-time Updates**: Get instant notifications for transaction status
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🛡️ **Security**: Proper error handling and user input validation

## Project Structure

```
projek-ku/
├── client/                  # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── WalletButton.js
│   │   │   ├── MessageBox.js
│   │   │   └── Notification.js
│   │   ├── config/         # Contract configuration
│   │   │   └── contract.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── contracts/              # Smart contracts
    └── MessageStorage.sol
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask browser extension
- An Ethereum wallet with test ETH (for testnet deployment)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/willeam10101010-afk/projek-ku.git
cd projek-ku
```

### 2. Install dependencies

```bash
cd client
npm install
```

## Smart Contract Deployment

### Option 1: Using Remix IDE (Recommended for beginners)

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file called `MessageStorage.sol`
3. Copy the contract code from `contracts/MessageStorage.sol`
4. Compile the contract (Solidity version 0.8.19)
5. Deploy using MetaMask:
   - Select "Injected Provider - MetaMask" as the environment
   - Choose a network (e.g., Sepolia testnet)
   - Deploy with an initial message (e.g., "Hello from Ethereum!")
6. Copy the deployed contract address

### Option 2: Using Hardhat (Advanced)

```bash
# Install Hardhat and dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat project
npx hardhat init

# Copy the contract to contracts/MessageStorage.sol
# Update hardhat.config.js with your network settings

# Compile the contract
npx hardhat compile

# Deploy to a local network
npx hardhat node  # In one terminal
npx hardhat run scripts/deploy.js --network localhost  # In another terminal

# Or deploy to a testnet (e.g., Sepolia)
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Update Contract Address

After deploying the contract, update the contract address in:
`client/src/config/contract.js`

```javascript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

## Running the Application

### Development Mode

```bash
cd client
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/build` folder.

## Deployment to VPS

### Using Nginx

1. **Build the application**:
   ```bash
   cd client
   npm run build
   ```

2. **Copy build files to VPS**:
   ```bash
   scp -r build/* user@your-vps-ip:/var/www/ethereum-dapp/
   ```

3. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/ethereum-dapp;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Restart Nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

### Using PM2 with serve

1. **Install serve globally**:
   ```bash
   npm install -g serve pm2
   ```

2. **Build and serve**:
   ```bash
   cd client
   npm run build
   pm2 serve build 3000 --name ethereum-dapp --spa
   pm2 save
   pm2 startup
   ```

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask wallet
2. **View Current Message**: The current message stored on the blockchain is displayed
3. **Update Message**: 
   - Type a new message (max 280 characters)
   - Click "Update Message"
   - Confirm the transaction in MetaMask
   - Wait for transaction confirmation
4. **View Updates**: The message will update automatically after the transaction is confirmed

## Contract Details

### MessageStorage.sol

The smart contract provides the following functions:

- `getMessage()`: Returns the currently stored message (view function)
- `setMessage(string newMessage)`: Updates the message (transaction)
- Emits `MessageUpdated` event when a message is updated

### Security Features

- Message length validation (1-280 characters)
- Empty message prevention
- Proper error handling for all transactions
- Event emission for tracking updates

## Technologies Used

- **Frontend**: React.js
- **Web3 Library**: Ethers.js v6
- **Smart Contract**: Solidity 0.8.19
- **Wallet**: MetaMask
- **Styling**: CSS3 with responsive design

## Network Support

The DApp can work on:
- Ethereum Mainnet
- Sepolia Testnet
- Goerli Testnet
- Local Hardhat Network
- Any EVM-compatible network

## Troubleshooting

### MetaMask Not Detected
- Ensure MetaMask extension is installed
- Refresh the page after installing MetaMask

### Transaction Failing
- Ensure you have enough ETH for gas fees
- Check that you're connected to the correct network
- Verify the contract address is correct

### Contract Not Deployed Warning
- Deploy the smart contract first
- Update the contract address in `src/config/contract.js`

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Author

willeam10101010-afk

## Support

For support, please open an issue in the GitHub repository.
