# Third-Party Authorization DApp

An Ethereum-based decentralized application (DApp) that allows users to grant and revoke authorization for third parties to perform transactions on their behalf.

## Features

### Smart Contract
- **Authorization Management**: Grant and revoke permissions for third-party addresses
- **Authorization Check**: Verify if a third party has the required permissions
- **Secure Access Control**: Built-in modifiers to ensure only authorized parties can perform actions
- **Event Logging**: Track all authorization and revocation events

### Frontend
- **MetaMask Integration**: Connect and interact with your Ethereum wallet
- **Admin Panel**: View all authorized third-party accounts
- **Authorization Management**: Easy-to-use interface for granting and revoking permissions
- **Real-time Feedback**: Success/failure notifications for all actions
- **Responsive Design**: Modern, user-friendly interface

## Technology Stack

- **Smart Contract**: Solidity 0.8.20
- **Development Framework**: Hardhat
- **Frontend**: React + Vite
- **Web3 Library**: ethers.js v5
- **Testing**: Hardhat + Chai

## Smart Contract Functions

### `authorize(address thirdParty)`
Allows a user to grant authorization to a third party to act on their behalf.

### `revokeAuthorization(address thirdParty)`
Revokes authorization from a previously authorized third party.

### `isAuthorized(address user, address thirdParty)`
Checks whether a third party is authorized by a user.

### `getAuthorizedList(address user)`
Returns an array of all authorized addresses for a user.

### `getAuthorizedCount(address user)`
Returns the number of active authorizations for a user.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MetaMask browser extension
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/willeam10101010-afk/projek-ku.git
cd projek-ku
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# For testnet deployment
GOERLI_RPC_URL=your_goerli_rpc_url
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key

# For frontend
VITE_CONTRACT_ADDRESS=deployed_contract_address
```

## Usage

### Compile Smart Contract

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Deploy Smart Contract

**Local Hardhat Network:**
```bash
npm run deploy:local
```

**Goerli Testnet:**
```bash
npm run deploy:goerli
```

**Sepolia Testnet:**
```bash
npm run deploy:sepolia
```

After deployment, copy the contract address and add it to your `.env` file as `VITE_CONTRACT_ADDRESS`.

### Run Frontend

**Development Mode:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

**Production Build:**
```bash
npm run build
npm run preview
```

## How to Use the DApp

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask wallet
2. **Authorize Third Party**: Enter an Ethereum address and click "Authorize" to grant permissions
3. **View Authorized Accounts**: See all addresses that have been authorized
4. **Revoke Authorization**: Click "Revoke" next to any address to remove their permissions

## Security Features

- **Zero Address Protection**: Cannot authorize the zero address
- **Self-Authorization Prevention**: Users cannot authorize themselves
- **Duplicate Protection**: Prevents authorizing the same address twice
- **Event Logging**: All authorization changes are logged on-chain
- **Access Control Modifier**: `onlyAuthorized` modifier ensures only authorized parties can perform protected actions

## Testing

The smart contract includes comprehensive test coverage:

- Authorization functionality
- Revocation functionality
- Authorization checks
- Edge cases and security scenarios
- Access control validation

Run tests with:
```bash
npm test
```

## Project Structure

```
projek-ku/
├── contracts/              # Smart contracts
│   └── Authorization.sol
├── test/                   # Smart contract tests
│   └── Authorization.test.js
├── scripts/                # Deployment scripts
│   └── deploy.js
├── frontend/               # React frontend
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── hardhat.config.js       # Hardhat configuration
├── vite.config.js          # Vite configuration
├── package.json
└── README.md
```

## Deployment on VPS

To deploy the frontend on a VPS:

1. Build the frontend:
```bash
npm run build
```

2. Copy the `dist` folder to your VPS

3. Serve using nginx or another web server

4. Ensure MetaMask is configured for the correct network

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Author

willeam10101010-afk

## Support

For issues and questions, please open an issue on GitHub.

