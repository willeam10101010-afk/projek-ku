# Ethereum Wallet DApp

A decentralized application (DApp) that connects to Ethereum wallets like MetaMask using Ethers.js.

## Features

- **Wallet Connection**: Connect to MetaMask and other Ethereum-compatible wallets
- **Connection Status Detection**: Real-time detection of wallet connection status
- **User Address Display**: Retrieve and display the connected user's Ethereum address
- **Network Information**: Show current network name and chain ID
- **Balance Display**: Display the user's ETH balance
- **Test Transactions**: Send test transactions from the connected wallet
- **Browser Compatibility**: Works with major web browsers (Chrome, Firefox, Edge, Brave)
- **Wallet Compatibility**: Compatible with MetaMask, Trust Wallet, and other Web3 wallets

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, or Brave)
- MetaMask or another Ethereum wallet extension installed
- Node.js and npm (optional, for local development server)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/willeam10101010-afk/projek-ku.git
cd projek-ku
```

2. Install dependencies (optional, for local server):
```bash
npm install
```

## Usage

### Method 1: Using Local Server (Recommended)

1. Start the local development server:
```bash
npm start
```

2. Your default browser will open automatically at `http://localhost:8080`

### Method 2: Direct File Opening

Simply open `index.html` in your web browser. Note: Some features may not work due to browser security restrictions.

## How to Use the DApp

1. **Connect Wallet**:
   - Click the "Connect Wallet" button
   - Approve the connection request in your MetaMask popup
   - Your wallet information will be displayed

2. **View Wallet Information**:
   - Once connected, you'll see:
     - Connection status
     - Your Ethereum address
     - Current network
     - Your ETH balance

3. **Send Test Transaction**:
   - Enter a recipient address
   - Enter the amount in ETH
   - Click "Send Transaction"
   - Confirm the transaction in MetaMask
   - Wait for confirmation

4. **Disconnect Wallet**:
   - Click the "Disconnect" button to disconnect your wallet

## Technology Stack

- **Ethers.js v5.7.2**: Modern Ethereum library for wallet interaction (included locally)
- **HTML5/CSS3**: Frontend structure and styling
- **Vanilla JavaScript**: ES6+ modules for clean code organization
- **MetaMask**: Primary wallet provider

## Files Included

- `ethers.min.js`: Local copy of Ethers.js library (ESM module)

## Security Notes

- Never share your private keys or seed phrases
- Always verify transaction details before confirming
- This is a demo application - use with test networks (testnets) for practice
- Only send small amounts on mainnet for testing purposes

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Edge
- Brave
- Opera
- Any browser with Web3 wallet support

## Supported Wallets

- MetaMask
- Trust Wallet (mobile)
- Coinbase Wallet
- Any wallet supporting the Ethereum Provider API (EIP-1193)

## Project Structure

```
projek-ku/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── app.js              # JavaScript logic and wallet integration
├── ethers.min.js       # Ethers.js library (local copy)
├── package.json        # Project dependencies
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Development

The DApp uses ES6 modules and includes Ethers.js locally, so no build step is required. Simply edit the files and refresh your browser.

### Note on Ethers.js
This project includes a local copy of Ethers.js (ethers.min.js) for better compatibility and offline development. The library is imported as an ES module in app.js.

## Troubleshooting

**"No Ethereum wallet detected"**
- Install MetaMask or another Web3 wallet extension
- Refresh the page after installation

**Transaction fails**
- Check that you have sufficient ETH for the transaction + gas fees
- Verify the recipient address is valid
- Make sure you're on the correct network

**Connection issues**
- Clear your browser cache
- Try disconnecting and reconnecting your wallet
- Check MetaMask is unlocked

## License

MIT
