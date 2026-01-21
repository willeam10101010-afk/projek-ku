// Contract addresses (update after deployment)
const MINING_CONTRACT_ADDRESS = "";  // Set after deployment
const USDT_CONTRACT_ADDRESS = "";     // Set after deployment

// Validate addresses on load
if (!MINING_CONTRACT_ADDRESS || !USDT_CONTRACT_ADDRESS) {
    console.warn('⚠️ Contract addresses not set. Please update frontend/app.js after deployment.');
}

// Contract ABIs (simplified for frontend)
const MINING_ABI = [
    "function mine(bytes32 nonce) external returns (bool)",
    "function getMinerStats(address miner) external view returns (uint256, uint256, uint256)",
    "function rewardAmount() external view returns (uint256)",
    "function miningDifficulty() external view returns (uint256)",
    "function checkDifficulty(bytes32 hash) external view returns (bool)",
    "event MiningSuccess(address indexed miner, uint256 reward, bytes32 nonce)"
];

const USDT_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];

// Global variables
let provider;
let signer;
let miningContract;
let usdtContract;
let userAddress;
let isMining = false;
let miningInterval;

// DOM elements
const connectWalletBtn = document.getElementById('connectWalletBtn');
const walletStatus = document.getElementById('walletStatus');
const miningSection = document.getElementById('miningSection');
const startMiningBtn = document.getElementById('startMiningBtn');
const stopMiningBtn = document.getElementById('stopMiningBtn');
const usdtBalanceEl = document.getElementById('usdtBalance');
const totalMinedEl = document.getElementById('totalMined');
const successfulMinesEl = document.getElementById('successfulMines');
const rewardAmountEl = document.getElementById('rewardAmount');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const statusText = document.getElementById('statusText');
const miningLog = document.getElementById('miningLog');

// Initialize
connectWalletBtn.addEventListener('click', connectWallet);
startMiningBtn.addEventListener('click', startMining);
stopMiningBtn.addEventListener('click', stopMining);

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask to use this DApp!');
            return;
        }

        // Check if contract addresses are set
        if (!MINING_CONTRACT_ADDRESS || !USDT_CONTRACT_ADDRESS) {
            alert('Contract addresses not configured. Please update frontend/app.js with deployed contract addresses.');
            return;
        }

        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        userAddress = accounts[0];
        
        // Initialize ethers (v6 syntax)
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        
        // Initialize contracts
        miningContract = new ethers.Contract(MINING_CONTRACT_ADDRESS, MINING_ABI, signer);
        usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, provider);
        
        // Update UI
        walletStatus.innerHTML = `
            <div class="wallet-address">
                <strong>Connected:</strong> ${userAddress.substring(0, 6)}...${userAddress.substring(38)}
            </div>
        `;
        connectWalletBtn.textContent = 'Connected';
        connectWalletBtn.disabled = true;
        miningSection.style.display = 'block';
        
        // Load stats
        await loadStats();
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        
        addLog('Wallet connected successfully!', 'success');
    } catch (error) {
        console.error('Error connecting wallet:', error);
        addLog('Error connecting wallet: ' + error.message, 'error');
    }
}

async function loadStats() {
    try {
        // Get USDT balance
        const balance = await usdtContract.balanceOf(userAddress);
        usdtBalanceEl.textContent = ethers.formatUnits(balance, 6);
        
        // Get miner stats
        const stats = await miningContract.getMinerStats(userAddress);
        totalMinedEl.textContent = ethers.formatUnits(stats[0], 6);
        successfulMinesEl.textContent = stats[2].toString();
        
        // Get reward amount
        const reward = await miningContract.rewardAmount();
        rewardAmountEl.textContent = ethers.formatUnits(reward, 6);
    } catch (error) {
        console.error('Error loading stats:', error);
        addLog('Error loading stats: ' + error.message, 'error');
    }
}

async function startMining() {
    if (isMining) return;
    
    isMining = true;
    startMiningBtn.style.display = 'none';
    stopMiningBtn.style.display = 'inline-block';
    
    addLog('Mining started...', 'info');
    statusText.textContent = 'Mining in progress...';
    
    // Start mining loop
    mine();
}

function stopMining() {
    isMining = false;
    startMiningBtn.style.display = 'inline-block';
    stopMiningBtn.style.display = 'none';
    
    if (miningInterval) {
        clearTimeout(miningInterval);
    }
    
    progressFill.style.width = '0%';
    progressText.textContent = 'Stopped';
    statusText.textContent = 'Mining stopped';
    addLog('Mining stopped by user', 'info');
}

async function mine() {
    if (!isMining) return;
    
    try {
        addLog('Searching for valid nonce...', 'info');
        progressFill.style.width = '30%';
        progressText.textContent = 'Searching...';
        
        // Get difficulty
        const difficulty = await miningContract.miningDifficulty();
        
        // Find valid nonce (client-side proof of work)
        let nonce;
        let hash;
        let attempts = 0;
        let isValid = false;
        
        while (!isValid && isMining && attempts < 100000) {
            nonce = ethers.randomBytes(32);
            const timestamp = Math.floor(Date.now() / 1000);
            
            // Calculate hash (same as contract - using abi.encode)
            hash = ethers.keccak256(
                ethers.AbiCoder.defaultAbiCoder().encode(
                    ['address', 'bytes32', 'uint256'],
                    [userAddress, nonce, timestamp]
                )
            );
            
            isValid = await miningContract.checkDifficulty(hash);
            attempts++;
            
            // Update progress every 1000 attempts
            if (attempts % 1000 === 0) {
                const progress = Math.min(30 + (attempts / 100000) * 40, 70);
                progressFill.style.width = progress + '%';
                progressText.textContent = `Attempts: ${attempts}`;
            }
        }
        
        if (!isValid) {
            addLog('No valid nonce found, retrying...', 'info');
            miningInterval = setTimeout(mine, 1000);
            return;
        }
        
        addLog(`Valid nonce found after ${attempts} attempts!`, 'success');
        progressFill.style.width = '80%';
        progressText.textContent = 'Submitting...';
        
        // Submit to blockchain
        const tx = await miningContract.mine(nonce);
        addLog('Transaction submitted, waiting for confirmation...', 'info');
        
        progressFill.style.width = '90%';
        progressText.textContent = 'Confirming...';
        
        const receipt = await tx.wait();
        
        progressFill.style.width = '100%';
        progressText.textContent = 'Success!';
        
        addLog('Mining successful! Reward received.', 'success');
        
        // Update stats
        await loadStats();
        
        // Reset and continue
        setTimeout(() => {
            progressFill.style.width = '0%';
            progressText.textContent = 'Ready';
            if (isMining) {
                miningInterval = setTimeout(mine, 2000);
            }
        }, 2000);
        
    } catch (error) {
        console.error('Mining error:', error);
        progressFill.style.width = '0%';
        progressText.textContent = 'Error';
        
        if (error.message.includes('Mining too fast')) {
            addLog('Mining too fast, waiting 30 seconds...', 'error');
            if (isMining) {
                miningInterval = setTimeout(mine, 30000);
            }
        } else if (error.message.includes('user rejected')) {
            addLog('Transaction rejected by user', 'error');
            stopMining();
        } else {
            addLog('Mining error: ' + error.message, 'error');
            if (isMining) {
                miningInterval = setTimeout(mine, 5000);
            }
        }
    }
}

function addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${timestamp}] ${message}`;
    miningLog.insertBefore(entry, miningLog.firstChild);
    
    // Keep only last 50 entries
    while (miningLog.children.length > 50) {
        miningLog.removeChild(miningLog.lastChild);
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected wallet
        location.reload();
    } else if (accounts[0] !== userAddress) {
        // User switched accounts
        location.reload();
    }
}

// Check if already connected
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ 
                method: 'eth_accounts' 
            });
            if (accounts.length > 0) {
                // Auto-connect if previously connected
                connectWallet();
            }
        } catch (error) {
            console.error('Error checking connection:', error);
        }
    }
});
