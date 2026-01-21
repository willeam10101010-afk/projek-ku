# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. ✅ Node.js installed (v16+)
2. ✅ MetaMask or another Ethereum wallet
3. ✅ Testnet ETH (Sepolia or Goerli)
4. ✅ Private key exported from your wallet
5. ✅ Dependencies installed (`npm install`)

## Step-by-Step Deployment

### Step 1: Get Testnet ETH

#### For Sepolia Testnet:
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Visit [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- Or use [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

#### For Goerli Testnet:
- Visit [Goerli Faucet](https://goerlifaucet.com/)
- Or [Alchemy Goerli Faucet](https://goerlifaucet.com/)

Request at least 0.5 ETH for deployment and testing.

### Step 2: Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your private key:
```env
PRIVATE_KEY=your_64_character_private_key_without_0x_prefix
SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

⚠️ **SECURITY WARNING**: Never commit your `.env` file or share your private key!

### Step 3: Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 5 Solidity files successfully
```

### Step 4: Run Tests

Verify contracts work correctly:

```bash
npm test
```

All tests should pass. If any fail, do not proceed with deployment.

### Step 5: Deploy to Testnet

```bash
npm run deploy:testnet
```

Expected output:
```
Deploying Crypto Mining DApp...
Deploying contracts with account: 0x...

1. Deploying MockUSDT...
MockUSDT deployed to: 0x...

2. Deploying CryptoMining...
CryptoMining deployed to: 0x...

3. Funding mining contract...
Transferred 100000.0 USDT to mining contract

✅ Deployment completed successfully!

📝 Contract Addresses:
==========================================
MockUSDT: 0x1234...
CryptoMining: 0x5678...
==========================================
```

### Step 6: Update Configuration

1. Copy the contract addresses from deployment output

2. Update `.env`:
```env
USDT_CONTRACT_ADDRESS=0x1234...
MINING_CONTRACT_ADDRESS=0x5678...
```

3. Update `frontend/app.js`:
```javascript
const MINING_CONTRACT_ADDRESS = "0x5678...";
const USDT_CONTRACT_ADDRESS = "0x1234...";
```

### Step 7: Verify Deployment

Check your contracts on block explorer:

- **Sepolia**: https://sepolia.etherscan.io/
- **Goerli**: https://goerli.etherscan.io/

Search for your contract addresses and verify:
- ✅ Contracts exist
- ✅ Contract balance shows USDT tokens
- ✅ Transaction history shows deployment

### Step 8: Test the DApp

1. Start the frontend:
```bash
npm run start:frontend
```

2. Start the backend:
```bash
# In a new terminal
npm run start:backend
```

3. Open browser to `http://localhost:8080`

4. Test functionality:
   - ✅ Connect MetaMask wallet
   - ✅ Switch to Sepolia network
   - ✅ View your USDT balance
   - ✅ Start mining
   - ✅ Receive rewards

### Step 9: Deploy to VPS (Production)

#### Prepare VPS

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone https://github.com/willeam10101010-afk/projek-ku.git
cd projek-ku

# Install dependencies
npm install
```

#### Configure VPS

1. Set up environment:
```bash
nano .env
# Add your configuration
```

2. Install and configure Nginx:
```bash
sudo apt-get install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/crypto-mining
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /home/user/projek-ku/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/crypto-mining /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Start Services

```bash
# Start backend with PM2
pm2 start backend/server.js --name "mining-backend"

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

#### SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Certbot will automatically configure HTTPS
```

### Step 10: Monitor and Maintain

#### Check Backend Logs
```bash
pm2 logs mining-backend
```

#### Monitor Contract Balance
```bash
# Use backend API
curl http://your-domain.com/api/stats/global
```

#### Fund Contract When Low
```javascript
// Use hardhat console
npx hardhat console --network sepolia

const MockUSDT = await ethers.getContractFactory("MockUSDT");
const usdt = await MockUSDT.attach("YOUR_USDT_ADDRESS");

const CryptoMining = await ethers.getContractFactory("CryptoMining");
const mining = await CryptoMining.attach("YOUR_MINING_ADDRESS");

// Approve and deposit more USDT
const amount = ethers.parseUnits("10000", 6);
await usdt.approve(mining.address, amount);
await mining.depositRewards(amount);
```

## Troubleshooting

### Issue: Deployment Fails

**Error**: "Insufficient funds"
- **Solution**: Get more testnet ETH from faucet

**Error**: "nonce too low"
- **Solution**: Reset MetaMask account or wait for pending transactions

**Error**: "Contract already deployed"
- **Solution**: Use a different account or deploy to different network

### Issue: Mining Not Working

**Error**: "Invalid proof of work"
- **Solution**: Check that frontend uses correct contract address
- Verify difficulty is not too high (should be 4 or less for testing)

**Error**: "Mining too fast"
- **Solution**: Wait 30 seconds between mining attempts

**Error**: "Insufficient contract balance"
- **Solution**: Fund the mining contract with more USDT

### Issue: Frontend Connection Issues

**Error**: "MetaMask not detected"
- **Solution**: Install MetaMask extension

**Error**: "Wrong network"
- **Solution**: Switch MetaMask to Sepolia testnet

**Error**: "Transaction rejected"
- **Solution**: Check gas settings in MetaMask

## Security Checklist

Before mainnet deployment:

- [ ] Professional smart contract audit completed
- [ ] All tests passing
- [ ] Code review by multiple developers
- [ ] Bug bounty program running
- [ ] Emergency pause mechanism implemented
- [ ] Multi-sig wallet for admin functions
- [ ] Monitoring and alerting set up
- [ ] Insurance considered
- [ ] Documentation complete
- [ ] User guides created

## Cost Estimates

### Testnet (Free)
- Deployment: ~0.05 ETH (free testnet ETH)
- Per mining transaction: ~0.001 ETH (free)

### Mainnet (Real Costs)
- Deployment: ~$50-100 USD (varies with gas)
- Per mining transaction: ~$2-10 USD (varies with gas)
- Monthly server costs: ~$10-50 USD (VPS)

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review contract events on block explorer
3. Check backend logs
4. Open an issue on GitHub
5. Review Hardhat documentation

## Next Steps

After successful deployment:

1. ✅ Test all features thoroughly
2. ✅ Monitor contract for 24-48 hours
3. ✅ Gather user feedback
4. ✅ Optimize gas costs
5. ✅ Plan scaling strategy
6. ✅ Consider additional features

---

**Deployment complete! Happy mining! ⛏️**
