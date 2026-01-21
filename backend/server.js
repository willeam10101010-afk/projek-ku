const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') || []
        : '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Contract ABIs
const MINING_ABI = [
    "function getMinerStats(address miner) external view returns (uint256, uint256, uint256)",
    "function totalRewardsDistributed() external view returns (uint256)",
    "function totalMiners() external view returns (uint256)",
    "function miningDifficulty() external view returns (uint256)",
    "function rewardAmount() external view returns (uint256)",
    "function getContractBalance() external view returns (uint256)"
];

const USDT_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function totalSupply() external view returns (uint256)"
];

// Initialize provider
let provider;
let miningContract;
let usdtContract;

try {
    const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';
    provider = new ethers.JsonRpcProvider(rpcUrl);
    
    if (process.env.MINING_CONTRACT_ADDRESS) {
        miningContract = new ethers.Contract(
            process.env.MINING_CONTRACT_ADDRESS,
            MINING_ABI,
            provider
        );
    }
    
    if (process.env.USDT_CONTRACT_ADDRESS) {
        usdtContract = new ethers.Contract(
            process.env.USDT_CONTRACT_ADDRESS,
            USDT_ABI,
            provider
        );
    }
} catch (error) {
    console.error('Error initializing contracts:', error);
}

// Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        contracts: {
            mining: !!miningContract,
            usdt: !!usdtContract
        }
    });
});

/**
 * Get global mining statistics
 */
app.get('/api/stats/global', async (req, res) => {
    try {
        if (!miningContract || !usdtContract) {
            return res.status(503).json({ 
                error: 'Contracts not initialized. Please set contract addresses in .env' 
            });
        }

        const [
            totalRewards,
            totalMiners,
            difficulty,
            rewardAmount,
            contractBalance
        ] = await Promise.all([
            miningContract.totalRewardsDistributed(),
            miningContract.totalMiners(),
            miningContract.miningDifficulty(),
            miningContract.rewardAmount(),
            miningContract.getContractBalance()
        ]);

        res.json({
            totalRewardsDistributed: ethers.formatUnits(totalRewards, 6),
            totalMiners: totalMiners.toString(),
            miningDifficulty: difficulty.toString(),
            rewardPerMine: ethers.formatUnits(rewardAmount, 6),
            contractBalance: ethers.formatUnits(contractBalance, 6)
        });
    } catch (error) {
        console.error('Error fetching global stats:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get miner statistics for a specific address
 */
app.get('/api/stats/miner/:address', async (req, res) => {
    try {
        if (!miningContract) {
            return res.status(503).json({ 
                error: 'Mining contract not initialized' 
            });
        }

        const address = req.params.address;
        
        // Validate address
        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid Ethereum address' });
        }

        const [totalMined, lastMiningTime, successfulMines] = 
            await miningContract.getMinerStats(address);

        res.json({
            address,
            totalMined: ethers.formatUnits(totalMined, 6),
            lastMiningTime: new Date(Number(lastMiningTime) * 1000).toISOString(),
            successfulMines: successfulMines.toString()
        });
    } catch (error) {
        console.error('Error fetching miner stats:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get USDT balance for an address
 */
app.get('/api/balance/:address', async (req, res) => {
    try {
        if (!usdtContract) {
            return res.status(503).json({ 
                error: 'USDT contract not initialized' 
            });
        }

        const address = req.params.address;
        
        // Validate address
        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid Ethereum address' });
        }

        const balance = await usdtContract.balanceOf(address);

        res.json({
            address,
            balance: ethers.formatUnits(balance, 6)
        });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get mining difficulty and reward info
 */
app.get('/api/mining/info', async (req, res) => {
    try {
        if (!miningContract) {
            return res.status(503).json({ 
                error: 'Mining contract not initialized' 
            });
        }

        const [difficulty, rewardAmount] = await Promise.all([
            miningContract.miningDifficulty(),
            miningContract.rewardAmount()
        ]);

        res.json({
            difficulty: difficulty.toString(),
            rewardAmount: ethers.formatUnits(rewardAmount, 6),
            estimatedAttemptsNeeded: Math.pow(2, Number(difficulty) * 8)
        });
    } catch (error) {
        console.error('Error fetching mining info:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get current gas prices
 */
app.get('/api/gas', async (req, res) => {
    try {
        const feeData = await provider.getFeeData();
        
        res.json({
            gasPrice: ethers.formatUnits(feeData.gasPrice || 0n, 'gwei'),
            maxFeePerGas: ethers.formatUnits(feeData.maxFeePerGas || 0n, 'gwei'),
            maxPriorityFeePerGas: ethers.formatUnits(feeData.maxPriorityFeePerGas || 0n, 'gwei')
        });
    } catch (error) {
        console.error('Error fetching gas prices:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get leaderboard (top miners)
 */
app.get('/api/leaderboard', async (req, res) => {
    try {
        // Note: This is a simplified version
        // In production, you'd store miner data in a database
        res.json({
            message: 'Leaderboard feature coming soon',
            note: 'Implement with event logs or off-chain database'
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Mining contract: ${process.env.MINING_CONTRACT_ADDRESS || 'Not set'}`);
    console.log(`USDT contract: ${process.env.USDT_CONTRACT_ADDRESS || 'Not set'}`);
});

module.exports = app;
