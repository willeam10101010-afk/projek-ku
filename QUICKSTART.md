# Quick Start Guide - Ethereum Message DApp

This guide will help you get started with the Ethereum Message DApp in just a few minutes.

## Prerequisites

Before you begin, make sure you have:

1. **MetaMask Extension** installed in your browser
   - [Install MetaMask for Chrome/Brave](https://chrome.google.com/webstore/detail/metamask/)
   - [Install MetaMask for Firefox](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/)
   - [Install MetaMask for Edge](https://microsoftedge.microsoft.com/addons/detail/metamask/)

2. **Node.js** installed (v14 or higher)
   - [Download Node.js](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

3. **Some test ETH** (for testnet deployment)
   - Get free test ETH from faucets (see below)

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/willeam10101010-afk/projek-ku.git
cd projek-ku

# Install dependencies
cd client
npm install
```

## Step 2: Deploy the Smart Contract

You have two options for deploying the smart contract:

### Option A: Using Remix IDE (Easiest)

1. Go to [Remix IDE](https://remix.ethereum.org/)

2. Create a new file: `MessageStorage.sol`

3. Copy the contract code from `contracts/MessageStorage.sol` and paste it into Remix

4. Compile the contract:
   - Click on "Solidity Compiler" tab (left sidebar)
   - Select compiler version: 0.8.19
   - Click "Compile MessageStorage.sol"

5. Deploy the contract:
   - Click on "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask" as environment
   - Make sure MetaMask is connected to your desired network:
     - **Sepolia** (Recommended testnet)
     - **Goerli** (Alternative testnet)
     - **Mainnet** (Only if using real ETH)
   - In the "Deploy" section, enter an initial message (e.g., "Hello Blockchain!")
   - Click "Deploy"
   - Confirm the transaction in MetaMask
   - Wait for deployment confirmation

6. Copy the deployed contract address:
   - After deployment, you'll see the contract under "Deployed Contracts"
   - Click the copy icon next to the contract address

### Option B: Using Hardhat (Advanced)

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init
# Select: Create a JavaScript project

# Copy contract to contracts folder
cp ../contracts/MessageStorage.sol contracts/

# Create .env file for your private key
echo "PRIVATE_KEY=your_metamask_private_key" > .env
echo "SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY" >> .env

# Compile
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Save the deployed contract address shown in the output
```

## Step 3: Configure the Contract Address

1. Open `client/src/config/contract.js`

2. Replace the placeholder address with your deployed contract address:

```javascript
export const CONTRACT_ADDRESS = "0xYourContractAddressHere";
```

3. Save the file

## Step 4: Run the Application

```bash
# Make sure you're in the client directory
cd client

# Start the development server
npm start
```

The application will automatically open at [http://localhost:3000](http://localhost:3000)

## Step 5: Use the DApp

1. **Connect Your Wallet**
   - Click the "Connect Wallet" button
   - MetaMask will pop up - click "Next" then "Connect"
   - Your wallet address and balance will appear

2. **View Current Message**
   - The current message stored on the blockchain will be displayed
   - This is the initial message you set during deployment

3. **Update the Message**
   - Type a new message in the text box (max 280 characters)
   - Click "Update Message"
   - Confirm the transaction in MetaMask
   - Wait for the transaction to be confirmed
   - The message will automatically update on the page

## Getting Test ETH

If you're using a testnet, you'll need test ETH for gas fees:

### Sepolia Testnet Faucets:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Sepolia Faucet](https://faucet.quicknode.com/ethereum/sepolia)

### Goerli Testnet Faucets:
- [Alchemy Goerli Faucet](https://goerlifaucet.com/)
- [Chainlink Goerli Faucet](https://faucets.chain.link/goerli)

### How to Use a Faucet:
1. Copy your MetaMask wallet address
2. Visit a faucet website
3. Paste your address and request test ETH
4. Wait 1-2 minutes for the ETH to arrive
5. Check your MetaMask balance

## Switching Networks in MetaMask

1. Open MetaMask
2. Click the network dropdown at the top
3. Select your desired network (Sepolia, Goerli, etc.)
4. If the network isn't listed, click "Add Network" and manually add it

### Sepolia Network Details:
- **Network Name**: Sepolia
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- **Chain ID**: 11155111
- **Symbol**: ETH
- **Block Explorer**: https://sepolia.etherscan.io

## Troubleshooting

### "MetaMask not detected"
- Make sure MetaMask extension is installed
- Refresh the page after installing MetaMask
- Check that MetaMask is enabled for the site

### "Transaction Failed"
- Ensure you have enough ETH for gas fees
- Check that you're on the correct network
- Verify the contract address is correct

### "Contract not deployed yet" warning
- Make sure you've deployed the smart contract
- Update the contract address in `src/config/contract.js`
- Refresh the page

### Message not updating
- Wait for transaction confirmation (can take 15-30 seconds)
- Check MetaMask for transaction status
- Make sure you're connected to the same network as the contract

### Build errors
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## Next Steps

### For Development:
- Modify the UI in `src/App.js` and component files
- Customize styling in the CSS files
- Add new features to the smart contract

### For Production:
1. Build the application: `npm run build`
2. Follow the deployment guide in `DEPLOYMENT.md`
3. Deploy to your VPS or hosting service
4. Configure your domain and SSL certificate

## Support

- **Issues**: Open an issue on GitHub
- **Documentation**: See README.md and DEPLOYMENT.md
- **Smart Contract**: Review contracts/MessageStorage.sol

## Tips

- Always use testnet first before deploying to mainnet
- Test ETH is free - don't worry about using it
- Gas fees vary - be patient during network congestion
- Keep your private keys secure - never share them
- Back up your MetaMask seed phrase

## Resources

- [MetaMask Documentation](https://docs.metamask.io/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Remix IDE](https://remix.ethereum.org/)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)

---

Happy building! 🚀
