#!/bin/bash

# Local Development Helper Script
# This script helps run the DApp locally for development

set -e  # Exit on error

echo "🚀 Crypto Mining DApp - Development Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js v16 or higher from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and add your configuration${NC}"
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

# Function to compile contracts
compile_contracts() {
    echo ""
    echo "🔨 Compiling smart contracts..."
    npm run compile
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Contracts compiled successfully${NC}"
    else
        echo -e "${RED}❌ Contract compilation failed${NC}"
        echo "This may be due to network restrictions. Contracts are already written."
        return 1
    fi
}

# Function to run tests
run_tests() {
    echo ""
    echo "🧪 Running tests..."
    npm test
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ All tests passed${NC}"
    else
        echo -e "${RED}❌ Some tests failed${NC}"
        return 1
    fi
}

# Main menu
echo ""
echo "What would you like to do?"
echo "1) Compile contracts"
echo "2) Run tests"
echo "3) Start frontend (port 8080)"
echo "4) Start backend (port 3000)"
echo "5) Start both (frontend + backend)"
echo "6) Deploy to testnet"
echo "7) Full setup (compile + test + start)"
echo "8) Exit"
echo ""
read -p "Enter your choice (1-8): " choice

case $choice in
    1)
        compile_contracts
        ;;
    2)
        run_tests
        ;;
    3)
        echo ""
        echo "🌐 Starting frontend on http://localhost:8080"
        echo "Press Ctrl+C to stop"
        cd frontend && python3 -m http.server 8080
        ;;
    4)
        echo ""
        echo "🖥️  Starting backend on http://localhost:3000"
        echo "Press Ctrl+C to stop"
        node backend/server.js
        ;;
    5)
        echo ""
        echo "🚀 Starting both frontend and backend..."
        echo ""
        echo "Frontend: http://localhost:8080"
        echo "Backend:  http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop both servers"
        echo ""
        
        # Start backend in background
        node backend/server.js &
        BACKEND_PID=$!
        
        # Wait a moment for backend to start
        sleep 2
        
        # Start frontend
        cd frontend && python3 -m http.server 8080
        
        # When frontend is stopped, stop backend too
        kill $BACKEND_PID
        ;;
    6)
        echo ""
        echo "🚀 Deploying to testnet..."
        compile_contracts
        if [ $? -eq 0 ]; then
            npm run deploy:testnet
            echo ""
            echo -e "${YELLOW}⚠️  Remember to update contract addresses in:${NC}"
            echo "  - .env"
            echo "  - frontend/app.js"
        fi
        ;;
    7)
        echo ""
        echo "🔄 Running full setup..."
        compile_contracts && run_tests
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Setup complete!${NC}"
            echo ""
            echo "Starting servers in 3 seconds..."
            sleep 3
            
            # Start backend in background
            node backend/server.js &
            BACKEND_PID=$!
            
            sleep 2
            
            # Start frontend
            cd frontend && python3 -m http.server 8080
            
            kill $BACKEND_PID
        fi
        ;;
    8)
        echo "Goodbye! 👋"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Done!${NC}"
