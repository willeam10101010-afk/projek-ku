# API Documentation

## Backend API Endpoints

Base URL: `http://localhost:3000` (development)

### Health Check

Check if the API server is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T12:00:00.000Z",
  "contracts": {
    "mining": true,
    "usdt": true
  }
}
```

---

### Global Statistics

Get global mining statistics across all users.

**Endpoint:** `GET /api/stats/global`

**Response:**
```json
{
  "totalRewardsDistributed": "1000.0",
  "totalMiners": "50",
  "miningDifficulty": "4",
  "rewardPerMine": "10.0",
  "contractBalance": "99000.0"
}
```

**Fields:**
- `totalRewardsDistributed`: Total USDT distributed to all miners
- `totalMiners`: Number of unique miners
- `miningDifficulty`: Current mining difficulty (1-10)
- `rewardPerMine`: USDT reward per successful mine
- `contractBalance`: Remaining USDT in contract

---

### Miner Statistics

Get statistics for a specific miner address.

**Endpoint:** `GET /api/stats/miner/:address`

**Parameters:**
- `address` (path): Ethereum address (e.g., 0x742d35Cc6634C0532925a3b844Bc454e4438f44e)

**Example:**
```bash
GET /api/stats/miner/0x742d35Cc6634C0532925a3b844Bc454e4438f44e
```

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "totalMined": "100.0",
  "lastMiningTime": "2024-01-20T12:00:00.000Z",
  "successfulMines": "10"
}
```

**Fields:**
- `address`: Miner's Ethereum address
- `totalMined`: Total USDT earned by this miner
- `lastMiningTime`: Timestamp of last successful mine
- `successfulMines`: Number of successful mining attempts

**Error Response (400):**
```json
{
  "error": "Invalid Ethereum address"
}
```

---

### USDT Balance

Get USDT token balance for any address.

**Endpoint:** `GET /api/balance/:address`

**Parameters:**
- `address` (path): Ethereum address

**Example:**
```bash
GET /api/balance/0x742d35Cc6634C0532925a3b844Bc454e4438f44e
```

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "balance": "100.0"
}
```

**Fields:**
- `address`: Ethereum address
- `balance`: USDT balance (formatted with 6 decimals)

---

### Mining Information

Get current mining difficulty and reward settings.

**Endpoint:** `GET /api/mining/info`

**Response:**
```json
{
  "difficulty": "4",
  "rewardAmount": "10.0",
  "estimatedAttemptsNeeded": 4294967296
}
```

**Fields:**
- `difficulty`: Current difficulty level (1-10)
- `rewardAmount`: USDT reward per successful mine
- `estimatedAttemptsNeeded`: Approximate number of attempts needed to find valid nonce

---

### Gas Prices

Get current Ethereum gas prices.

**Endpoint:** `GET /api/gas`

**Response:**
```json
{
  "gasPrice": "20.5",
  "maxFeePerGas": "22.0",
  "maxPriorityFeePerGas": "1.5"
}
```

**Fields:**
- `gasPrice`: Current gas price in Gwei
- `maxFeePerGas`: Maximum fee per gas (EIP-1559)
- `maxPriorityFeePerGas`: Priority fee per gas (EIP-1559)

---

### Leaderboard

Get top miners (coming soon).

**Endpoint:** `GET /api/leaderboard`

**Response:**
```json
{
  "message": "Leaderboard feature coming soon",
  "note": "Implement with event logs or off-chain database"
}
```

---

## Smart Contract Functions

### CryptoMining Contract

#### mine(bytes32 nonce)

Submit a mining attempt with a valid nonce.

**Parameters:**
- `nonce`: Random 32-byte value that produces valid hash

**Returns:**
- `bool`: Success status

**Events:**
- `MiningSuccess(address indexed miner, uint256 reward, bytes32 nonce)`

**Errors:**
- "Mining too fast, please wait" - Minimum block time not elapsed
- "Nonce already used" - Nonce was previously submitted
- "Invalid proof of work" - Nonce doesn't satisfy difficulty
- "Insufficient contract balance" - Contract out of rewards

**Example (ethers.js):**
```javascript
const nonce = ethers.randomBytes(32);
const tx = await miningContract.mine(nonce);
const receipt = await tx.wait();
```

#### getMinerStats(address miner)

Get statistics for a miner.

**Parameters:**
- `miner`: Ethereum address

**Returns:**
- `totalMined`: Total USDT earned (uint256)
- `lastMiningTime`: Timestamp of last mine (uint256)
- `successfulMines`: Number of successful mines (uint256)

**Example:**
```javascript
const [totalMined, lastTime, count] = await miningContract.getMinerStats(address);
console.log("Total mined:", ethers.formatUnits(totalMined, 6));
```

#### checkDifficulty(bytes32 hash)

Check if a hash meets the current difficulty requirement.

**Parameters:**
- `hash`: Hash to validate

**Returns:**
- `bool`: Whether hash is valid

**Example:**
```javascript
const hash = ethers.keccak256(data);
const isValid = await miningContract.checkDifficulty(hash);
```

#### updateDifficulty(uint256 newDifficulty) [Owner Only]

Update mining difficulty.

**Parameters:**
- `newDifficulty`: New difficulty (1-10)

**Events:**
- `DifficultyUpdated(uint256 newDifficulty)`

#### updateReward(uint256 newReward) [Owner Only]

Update reward amount per successful mine.

**Parameters:**
- `newReward`: New reward in USDT (with 6 decimals)

**Events:**
- `RewardUpdated(uint256 newReward)`

#### depositRewards(uint256 amount)

Deposit USDT into mining contract for rewards.

**Parameters:**
- `amount`: Amount to deposit (with 6 decimals)

**Events:**
- `TokensDeposited(address indexed depositor, uint256 amount)`

**Note:** Requires prior approval of USDT tokens.

**Example:**
```javascript
// First approve
await usdtContract.approve(miningAddress, amount);

// Then deposit
await miningContract.depositRewards(amount);
```

#### getContractBalance()

Get current USDT balance of mining contract.

**Returns:**
- `uint256`: USDT balance (with 6 decimals)

---

### MockUSDT Contract

Standard ERC20 token with 6 decimals.

#### balanceOf(address account)

Get USDT balance of an address.

**Parameters:**
- `account`: Ethereum address

**Returns:**
- `uint256`: Token balance (with 6 decimals)

#### transfer(address to, uint256 amount)

Transfer USDT to another address.

**Parameters:**
- `to`: Recipient address
- `amount`: Amount to transfer (with 6 decimals)

**Returns:**
- `bool`: Success status

#### approve(address spender, uint256 amount)

Approve an address to spend your USDT.

**Parameters:**
- `spender`: Address to approve
- `amount`: Amount to approve (with 6 decimals)

**Returns:**
- `bool`: Success status

---

## Usage Examples

### Complete Mining Flow

```javascript
// 1. Connect wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// 2. Initialize contracts
const mining = new ethers.Contract(MINING_ADDRESS, MINING_ABI, signer);
const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);

// 3. Check current difficulty
const difficulty = await mining.miningDifficulty();
console.log("Difficulty:", difficulty);

// 4. Find valid nonce
let nonce, hash, isValid = false;
const address = await signer.getAddress();

while (!isValid) {
  nonce = ethers.randomBytes(32);
  const timestamp = Math.floor(Date.now() / 1000);
  
  hash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ['address', 'bytes32', 'uint256'],
      [address, nonce, timestamp]
    )
  );
  
  isValid = await mining.checkDifficulty(hash);
}

// 5. Submit mining attempt
const tx = await mining.mine(nonce);
const receipt = await tx.wait();

// 6. Check new balance
const balance = await usdt.balanceOf(address);
console.log("Balance:", ethers.formatUnits(balance, 6));
```

### Using Backend API

```javascript
// Get global stats
const response = await fetch('http://localhost:3000/api/stats/global');
const stats = await response.json();
console.log("Total miners:", stats.totalMiners);

// Get miner stats
const address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
const minerResponse = await fetch(`http://localhost:3000/api/stats/miner/${address}`);
const minerStats = await minerResponse.json();
console.log("Miner stats:", minerStats);

// Get gas prices
const gasResponse = await fetch('http://localhost:3000/api/gas');
const gasData = await gasResponse.json();
console.log("Gas price:", gasData.gasPrice, "Gwei");
```

---

## Error Handling

### Common Errors

#### 503 Service Unavailable
Contracts not initialized. Check that contract addresses are set in `.env` file.

```json
{
  "error": "Contracts not initialized. Please set contract addresses in .env"
}
```

#### 500 Internal Server Error
Server error. Check logs for details.

```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

#### 400 Bad Request
Invalid request parameters.

```json
{
  "error": "Invalid Ethereum address"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider:
- Rate limiting by IP
- API keys for authenticated requests
- Request throttling

---

## CORS

CORS is enabled for all origins in development. In production:
- Restrict to specific domains
- Use proper authentication
- Implement security headers

---

## WebSocket Support (Future)

Future versions may include WebSocket support for:
- Real-time mining updates
- Live statistics
- Event notifications

---

**Last Updated:** 2024-01-20
