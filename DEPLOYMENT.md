# Deployment Guide

This guide provides step-by-step instructions for deploying the Authorization DApp to Ethereum testnets and hosting the frontend.

## Prerequisites

1. **Node.js and npm** - Ensure you have Node.js v14+ installed
2. **MetaMask** - Install the MetaMask browser extension
3. **Test ETH** - Obtain test ETH from faucets for the network you're deploying to
4. **RPC Provider** - Get an Infura or Alchemy API key

## Step 1: Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:
```env
# Get these from https://infura.io or https://alchemy.com
GOERLI_RPC_URL=https://goerli.infura.io/v3/YOUR_API_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY

# Export your MetaMask private key (NEVER share this!)
PRIVATE_KEY=your_private_key_without_0x_prefix

# Will be updated after deployment
VITE_CONTRACT_ADDRESS=
```

⚠️ **Security Warning**: Never commit your `.env` file or share your private key!

## Step 2: Get Test ETH

### For Sepolia Testnet:
- https://sepolia-faucet.pk910.de/
- https://www.alchemy.com/faucets/ethereum-sepolia

### For Goerli Testnet (deprecated):
- https://goerlifaucet.com/
- https://faucet.quicknode.com/ethereum/goerli

## Step 3: Deploy Smart Contract

### Deploy to Local Hardhat Network (for testing):

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy contract
npm run deploy:local
```

### Deploy to Sepolia Testnet (recommended):

```bash
npm run deploy:sepolia
```

### Deploy to Goerli Testnet:

```bash
npm run deploy:goerli
```

After successful deployment, you'll see output like:
```
Deploying Authorization contract...
Authorization contract deployed to: 0x1234567890123456789012345678901234567890

Update your frontend .env file with:
VITE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

## Step 4: Update Frontend Configuration

1. Copy the deployed contract address from the deployment output

2. Update `.env` file:
```env
VITE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

## Step 5: Test Frontend Locally

```bash
npm run dev
```

Open http://localhost:3000 and:
1. Connect your MetaMask wallet
2. Switch to the network where you deployed (e.g., Sepolia)
3. Test authorizing and revoking addresses

## Step 6: Build Frontend for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Step 7: Deploy Frontend to VPS

### Option A: Using Nginx

1. **Copy files to VPS:**
```bash
scp -r dist/* user@your-vps-ip:/var/www/authorization-dapp/
```

2. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/authorization-dapp;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Restart Nginx:**
```bash
sudo systemctl restart nginx
```

### Option B: Using PM2 + serve

1. **Install serve globally on VPS:**
```bash
npm install -g serve pm2
```

2. **Upload dist folder:**
```bash
scp -r dist user@your-vps-ip:~/authorization-dapp/
```

3. **Start with PM2:**
```bash
cd ~/authorization-dapp
pm2 serve dist 3000 --name authorization-dapp --spa
pm2 save
pm2 startup
```

### Option C: Using Vercel (easiest)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Add environment variable in Vercel dashboard:**
   - Go to your project settings
   - Add `VITE_CONTRACT_ADDRESS` with your deployed contract address

## Step 8: Verify Deployment

1. Open your deployed frontend URL
2. Connect MetaMask
3. Ensure you're on the correct network
4. Test the following:
   - Authorize a test address
   - View authorized list
   - Revoke authorization
   - Check that events are logged properly

## Smart Contract Verification (Optional)

To verify your contract on Etherscan:

1. Install the verify plugin (already included in hardhat-toolbox)

2. Get an Etherscan API key from https://etherscan.io/myapikey

3. Add to `.env`:
```env
ETHERSCAN_API_KEY=your_etherscan_api_key
```

4. Verify the contract:
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Troubleshooting

### "Insufficient funds" error
- Make sure your wallet has enough test ETH for gas fees
- Get more test ETH from faucets

### "Network mismatch" in frontend
- Ensure MetaMask is connected to the same network as your deployed contract
- Check `VITE_CONTRACT_ADDRESS` is correct

### Contract deployment fails
- Verify your RPC URL is correct
- Check your private key is properly formatted (no 0x prefix in .env)
- Ensure you have test ETH in your deployment wallet

### Frontend can't connect to contract
- Verify the contract address in `.env` is correct
- Rebuild the frontend after updating `.env`: `npm run build`
- Clear browser cache and reconnect MetaMask

## Security Checklist

Before going to production:

- [ ] Never commit `.env` file
- [ ] Never share private keys
- [ ] Use a separate wallet for deployment (not your main wallet)
- [ ] Test all functions thoroughly on testnet first
- [ ] Consider getting a professional security audit
- [ ] Set up monitoring for contract events
- [ ] Have a plan for contract upgrades if needed

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review Hardhat docs: https://hardhat.org
- Review ethers.js docs: https://docs.ethers.io
