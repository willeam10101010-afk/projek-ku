#!/bin/bash

# Local deployment and testing script for Ethereum DApp
# This script helps you quickly deploy and test the DApp locally

set -e  # Exit on error

echo "🚀 Starting Ethereum DApp Local Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js is installed${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm is installed${NC}"

# Install root dependencies
echo -e "${YELLOW}📦 Installing Hardhat dependencies...${NC}"
npm install

# Compile contracts
echo -e "${YELLOW}🔨 Compiling smart contracts...${NC}"
npx hardhat compile

# Run tests
echo -e "${YELLOW}🧪 Running smart contract tests...${NC}"
npm test

# Start local Hardhat node in background
echo -e "${YELLOW}🌐 Starting local Hardhat network...${NC}"
npx hardhat node > /tmp/hardhat-node.log 2>&1 &
HARDHAT_PID=$!
echo "Hardhat node PID: $HARDHAT_PID"

# Wait for Hardhat node to start
sleep 3

# Deploy contract to local network
echo -e "${YELLOW}📝 Deploying contract to local network...${NC}"
npx hardhat run scripts/deploy.js --network localhost

# Check if deployment info exists
if [ ! -f "deployment/deployment-info.json" ]; then
    echo -e "${RED}❌ Deployment failed. deployment-info.json not found.${NC}"
    kill $HARDHAT_PID
    exit 1
fi

# Extract contract address
CONTRACT_ADDRESS=$(grep -o '"address": "[^"]*' deployment/deployment-info.json | grep -o '[^"]*$')
echo -e "${GREEN}✓ Contract deployed at: $CONTRACT_ADDRESS${NC}"

# Setup frontend
echo -e "${YELLOW}⚛️  Setting up frontend...${NC}"
cd frontend

# Install frontend dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Create .env file for frontend
echo -e "${YELLOW}📝 Creating frontend .env file...${NC}"
cat > .env << EOF
REACT_APP_CONTRACT_ADDRESS=$CONTRACT_ADDRESS
REACT_APP_CHAIN_ID=0x539
REACT_APP_CHAIN_NAME=Hardhat Local
REACT_APP_RPC_URL=http://localhost:8545
EOF

echo -e "${GREEN}✓ Frontend configured${NC}"

# Print instructions
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Local deployment complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "1. Keep this terminal open (Hardhat node is running)"
echo -e "2. Open a new terminal and run: ${GREEN}cd frontend && npm start${NC}"
echo -e "3. Open your browser at: ${GREEN}http://localhost:3000${NC}"
echo -e "4. Connect MetaMask to 'Localhost 8545'"
echo -e "5. Import an account using one of the private keys from Hardhat\n"

echo -e "${YELLOW}📝 Contract Address: ${GREEN}$CONTRACT_ADDRESS${NC}"
echo -e "${YELLOW}🌐 Network: ${GREEN}Hardhat Local (Chain ID: 31337)${NC}"
echo -e "${YELLOW}💰 RPC URL: ${GREEN}http://localhost:8545${NC}\n"

echo -e "${YELLOW}💡 Tip: Check /tmp/hardhat-node.log for Hardhat node logs${NC}"
echo -e "${YELLOW}🛑 To stop: Press Ctrl+C or run: kill $HARDHAT_PID${NC}\n"

# Wait for Ctrl+C
trap "echo -e '\n${YELLOW}Stopping Hardhat node...${NC}'; kill $HARDHAT_PID; exit 0" INT

echo -e "${YELLOW}Press Ctrl+C to stop the Hardhat node...${NC}"
wait $HARDHAT_PID
