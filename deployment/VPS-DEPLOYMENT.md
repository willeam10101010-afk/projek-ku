# VPS Deployment Guide for Ethereum DApp

This guide will walk you through deploying the Ethereum DApp on a VPS (Virtual Private Server).

## Prerequisites

- A VPS with Ubuntu 20.04 or later (DigitalOcean, AWS EC2, Linode, etc.)
- A domain name pointing to your VPS IP address
- SSH access to your VPS
- MetaMask wallet with testnet ETH

## Step 1: Initial VPS Setup

### 1.1 Connect to your VPS
```bash
ssh root@your-vps-ip
```

### 1.2 Update system packages
```bash
apt update && apt upgrade -y
```

### 1.3 Create a new user (recommended for security)
```bash
adduser dappuser
usermod -aG sudo dappuser
su - dappuser
```

## Step 2: Install Required Software

### 2.1 Install Node.js and npm
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should be v20.x or higher
npm --version
```

### 2.2 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.3 Install Certbot for SSL certificates
```bash
sudo apt install -y certbot python3-certbot-nginx
```

## Step 3: Deploy Smart Contract

### 3.1 Clone your repository on your local machine
```bash
git clone https://github.com/your-username/projek-ku.git
cd projek-ku
```

### 3.2 Install dependencies
```bash
npm install
```

### 3.3 Configure environment variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
nano .env
```

Add your private key and RPC URL:
```
PRIVATE_KEY=your_metamask_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

**WARNING**: Never commit your `.env` file to version control!

### 3.4 Get testnet ETH
- Visit [Sepolia Faucet](https://sepoliafaucet.com/) or [Goerli Faucet](https://goerlifaucet.com/)
- Request testnet ETH for your wallet address

### 3.5 Deploy the contract
```bash
npm run deploy:sepolia
```

Save the contract address from the output!

## Step 4: Build and Deploy Frontend

### 4.1 Configure frontend environment
```bash
cd frontend
cp .env.example .env
nano .env
```

Update with your deployed contract address:
```
REACT_APP_CONTRACT_ADDRESS=0xYourContractAddress
REACT_APP_CHAIN_ID=0xaa36a7
REACT_APP_CHAIN_NAME=Sepolia Test Network
```

### 4.2 Build the React app
```bash
npm install
npm run build
```

### 4.3 Copy build files to VPS
From your local machine:
```bash
scp -r frontend/build/* dappuser@your-vps-ip:/tmp/dapp-build/
```

On your VPS:
```bash
sudo mkdir -p /var/www/ethereum-dapp
sudo mv /tmp/dapp-build/* /var/www/ethereum-dapp/
sudo chown -R www-data:www-data /var/www/ethereum-dapp
```

## Step 5: Configure Nginx

### 5.1 Copy nginx configuration
On your VPS:
```bash
sudo nano /etc/nginx/sites-available/ethereum-dapp
```

Copy the content from `deployment/nginx.conf` and update:
- Replace `your-domain.com` with your actual domain
- Update paths if necessary

### 5.2 Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/ethereum-dapp /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## Step 6: Setup SSL with Let's Encrypt

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts to:
- Enter your email address
- Agree to terms of service
- Choose to redirect HTTP to HTTPS (option 2)

### 6.1 Setup automatic renewal
```bash
sudo certbot renew --dry-run
```

Certbot automatically sets up a cron job for renewal.

## Step 7: Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

## Step 8: Test Your DApp

1. Visit `https://your-domain.com` in your browser
2. You should see the Ethereum Message DApp interface
3. Click "Connect MetaMask"
4. Make sure MetaMask is connected to Sepolia (or your chosen testnet)
5. Try reading and updating the message

## Troubleshooting

### Check Nginx logs
```bash
sudo tail -f /var/log/nginx/ethereum-dapp-error.log
```

### Check Nginx status
```bash
sudo systemctl status nginx
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

### Common issues:

1. **MetaMask not connecting**: Ensure you're on the correct network (Sepolia)
2. **Transaction failing**: Check you have enough testnet ETH
3. **Contract not responding**: Verify the contract address in `.env`
4. **SSL certificate issues**: Run `sudo certbot renew --force-renewal`

## Updating Your DApp

### To update the frontend:
```bash
# On local machine
cd frontend
npm run build
scp -r build/* dappuser@your-vps-ip:/tmp/dapp-build/

# On VPS
sudo rm -rf /var/www/ethereum-dapp/*
sudo mv /tmp/dapp-build/* /var/www/ethereum-dapp/
sudo chown -R www-data:www-data /var/www/ethereum-dapp
```

### To update the smart contract:
You'll need to deploy a new contract and update the frontend configuration with the new address.

## Security Best Practices

1. Keep your system updated: `sudo apt update && sudo apt upgrade`
2. Use strong passwords
3. Enable SSH key authentication and disable password authentication
4. Regularly backup your data
5. Monitor logs for suspicious activity
6. Never expose your private keys
7. Use environment variables for sensitive data

## Additional Resources

- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [React Documentation](https://react.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

## Support

For issues related to:
- Smart contracts: Check Hardhat documentation
- Frontend: Check React and Ethers.js documentation
- Deployment: Check your VPS provider's documentation
