# Common Issues and Solutions

## Installation Issues

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: Permission denied
**Solution:**
```bash
# Linux/Mac - use sudo
sudo npm install

# Or fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

## Compilation Issues

### Issue: Solidity compiler download fails
**Solution:**
```bash
# Option 1: Use different Solidity version
# Edit hardhat.config.js and change version

# Option 2: Download manually
npx hardhat compile --force
```

### Issue: Contract too large
**Solution:**
```javascript
// In hardhat.config.js, increase optimizer runs
settings: {
  optimizer: {
    enabled: true,
    runs: 1  // Lower number = smaller contract
  }
}
```

## Deployment Issues

### Issue: Insufficient funds for gas
**Solution:**
- Get more testnet ETH from faucets
- Reduce gas price in hardhat.config.js
- Wait for lower network congestion

### Issue: Nonce too low
**Solution:**
```bash
# Reset MetaMask account
# Settings > Advanced > Reset Account
```

### Issue: Transaction timeout
**Solution:**
```javascript
// Increase timeout in deployment script
const tx = await contract.deploy({
  timeout: 300000  // 5 minutes
});
```

## Frontend Issues

### Issue: MetaMask not connecting
**Solutions:**
1. Install MetaMask extension
2. Unlock MetaMask
3. Switch to correct network (Sepolia/Goerli)
4. Refresh the page

### Issue: Contract address not found
**Solution:**
```javascript
// Make sure contract addresses are updated in frontend/app.js
const MINING_CONTRACT_ADDRESS = "0x...";  // Your actual address
const USDT_CONTRACT_ADDRESS = "0x...";     // Your actual address
```

### Issue: Wrong network
**Solution:**
```javascript
// Add network switching to frontend
async function switchNetwork() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // Sepolia
    });
  } catch (error) {
    console.error('Failed to switch network:', error);
  }
}
```

## Mining Issues

### Issue: Invalid proof of work
**Causes:**
- Difficulty too high
- Wrong timestamp
- Contract address mismatch

**Solutions:**
```bash
# Check difficulty on contract
npx hardhat console --network sepolia
> const mining = await ethers.getContractAt("CryptoMining", "0x...")
> await mining.miningDifficulty()

# If too high (>6), lower it
> await mining.updateDifficulty(4)
```

### Issue: Mining too fast error
**Solution:**
- Wait 30 seconds between mining attempts
- This is a built-in protection mechanism

### Issue: Insufficient contract balance
**Solution:**
```javascript
// Fund the mining contract with more USDT
const usdt = await ethers.getContractAt("MockUSDT", "0x...");
const mining = await ethers.getContractAt("CryptoMining", "0x...");

const amount = ethers.parseUnits("10000", 6);
await usdt.approve(mining.address, amount);
await mining.depositRewards(amount);
```

### Issue: Transaction rejected
**Causes:**
- User rejected in MetaMask
- Insufficient gas
- Incorrect gas settings

**Solutions:**
- Accept transaction in MetaMask
- Increase gas limit
- Check gas price settings

## Backend Issues

### Issue: Port already in use
**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run start:backend
```

### Issue: Contract not initialized
**Solution:**
```bash
# Make sure .env has contract addresses
MINING_CONTRACT_ADDRESS=0x...
USDT_CONTRACT_ADDRESS=0x...
```

### Issue: RPC connection failed
**Solutions:**
1. Check RPC URL in .env
2. Try different RPC provider:
   - Infura: https://infura.io/
   - Alchemy: https://www.alchemy.com/
   - Public RPCs: https://chainlist.org/

## Testing Issues

### Issue: Tests fail
**Common causes:**
1. Hardhat network issue
2. Gas limit too low
3. Timing issues

**Solutions:**
```bash
# Clear cache
rm -rf cache artifacts

# Recompile
npm run compile

# Run tests with verbose output
npx hardhat test --verbose
```

### Issue: Timeout in tests
**Solution:**
```javascript
// Increase timeout in test file
describe("Mining", function () {
  this.timeout(60000); // 60 seconds
  
  it("should mine successfully", async function () {
    // test code
  });
});
```

## Gas Optimization

### Issue: High gas costs
**Solutions:**

1. **Optimize contract:**
```solidity
// Use uint256 instead of smaller uints where possible
// Pack variables efficiently
// Use events instead of storage where possible
```

2. **Batch operations:**
```javascript
// Instead of multiple transactions
// Group operations together
```

3. **Use lower gas price:**
```javascript
// In deployment or transaction
{
  gasPrice: ethers.parseUnits("20", "gwei")
}
```

## Network Issues

### Issue: Cannot connect to testnet
**Solutions:**

1. **Check network configuration:**
```javascript
// In MetaMask, add network manually:
Network Name: Sepolia
RPC URL: https://rpc.sepolia.org
Chain ID: 11155111
Currency Symbol: ETH
Block Explorer: https://sepolia.etherscan.io
```

2. **Try different RPC:**
```javascript
// Update hardhat.config.js
sepolia: {
  url: "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY",
  // or
  url: "https://sepolia.infura.io/v3/YOUR-API-KEY"
}
```

## Performance Issues

### Issue: Frontend slow
**Solutions:**
1. Reduce polling frequency
2. Cache results
3. Use WebSocket instead of HTTP
4. Optimize JavaScript code

### Issue: Mining takes too long
**Solutions:**
1. Lower difficulty
2. Use Web Workers for mining
3. Optimize nonce search algorithm

## Security Issues

### Issue: Private key exposed
**Solution:**
1. **NEVER** commit .env file
2. Generate new wallet immediately
3. Transfer funds to new wallet
4. Update all configurations

### Issue: Contract vulnerable
**Solutions:**
1. Run security audit
2. Use latest OpenZeppelin versions
3. Add pausable functionality
4. Implement timelock for admin functions

## Debugging Tips

### Enable debug mode
```javascript
// In frontend
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log(...args);
}
```

### Check contract events
```javascript
// Listen to events
miningContract.on("MiningSuccess", (miner, reward, nonce) => {
  console.log("Mining success:", { miner, reward, nonce });
});
```

### View transaction details
```javascript
// After transaction
const receipt = await tx.wait();
console.log("Transaction receipt:", receipt);
console.log("Gas used:", receipt.gasUsed.toString());
```

### Check contract state
```javascript
// In hardhat console
const balance = await miningContract.getContractBalance();
console.log("Contract balance:", ethers.formatUnits(balance, 6));

const difficulty = await miningContract.miningDifficulty();
console.log("Current difficulty:", difficulty.toString());
```

## Getting More Help

If you're still having issues:

1. **Check logs:**
   - Browser console (F12)
   - Backend server logs
   - Hardhat output

2. **Verify configuration:**
   - .env file
   - Contract addresses
   - Network settings

3. **Test components individually:**
   - Test contracts with hardhat console
   - Test frontend without backend
   - Test backend endpoints with curl

4. **Community resources:**
   - Hardhat documentation
   - OpenZeppelin forum
   - Ethereum Stack Exchange
   - GitHub issues

## Still Stuck?

Create an issue on GitHub with:
- Error message (full text)
- Steps to reproduce
- Your environment (OS, Node version)
- What you've already tried

---

**Remember:** Most issues are configuration-related. Double-check your settings!
