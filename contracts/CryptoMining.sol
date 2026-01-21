// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CryptoMining
 * @dev Smart contract for cryptocurrency mining with USDT rewards
 * Implements a Proof-of-Work style mining mechanism
 */
contract CryptoMining is Ownable, ReentrancyGuard {
    IERC20 public usdtToken;
    
    // Mining parameters
    uint256 public miningDifficulty;
    uint256 public rewardAmount;
    uint256 public minBlockTime;
    
    // Mining statistics
    struct MinerStats {
        uint256 totalMined;
        uint256 lastMiningTime;
        uint256 successfulMines;
    }
    
    mapping(address => MinerStats) public minerStats;
    mapping(bytes32 => bool) public usedNonces;
    
    uint256 public totalRewardsDistributed;
    uint256 public totalMiners;
    
    // Events
    event MiningSuccess(address indexed miner, uint256 reward, bytes32 nonce);
    event DifficultyUpdated(uint256 newDifficulty);
    event RewardUpdated(uint256 newReward);
    event TokensDeposited(address indexed depositor, uint256 amount);
    
    /**
     * @dev Constructor
     * @param _usdtToken Address of USDT token contract
     * @param _miningDifficulty Initial mining difficulty (number of leading zeros)
     * @param _rewardAmount Reward amount in USDT (with decimals)
     * @param _minBlockTime Minimum time between mining attempts (seconds)
     */
    constructor(
        address _usdtToken,
        uint256 _miningDifficulty,
        uint256 _rewardAmount,
        uint256 _minBlockTime
    ) Ownable(msg.sender) {
        require(_usdtToken != address(0), "Invalid token address");
        require(_miningDifficulty > 0 && _miningDifficulty <= 10, "Invalid difficulty");
        require(_rewardAmount > 0, "Invalid reward amount");
        
        usdtToken = IERC20(_usdtToken);
        miningDifficulty = _miningDifficulty;
        rewardAmount = _rewardAmount;
        minBlockTime = _minBlockTime;
    }
    
    /**
     * @dev Mine cryptocurrency by providing a valid nonce
     * @param nonce Random value used for mining
     * @return success Whether mining was successful
     */
    function mine(bytes32 nonce) external nonReentrant returns (bool success) {
        MinerStats storage stats = minerStats[msg.sender];
        
        // Check minimum block time
        require(
            block.timestamp >= stats.lastMiningTime + minBlockTime,
            "Mining too fast, please wait"
        );
        
        // Check if nonce was already used
        require(!usedNonces[nonce], "Nonce already used");
        
        // Verify proof of work
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, nonce, block.timestamp));
        require(checkDifficulty(hash), "Invalid proof of work");
        
        // Mark nonce as used
        usedNonces[nonce] = true;
        
        // Update miner stats
        if (stats.successfulMines == 0) {
            totalMiners++;
        }
        stats.totalMined += rewardAmount;
        stats.lastMiningTime = block.timestamp;
        stats.successfulMines++;
        
        // Transfer reward
        require(
            usdtToken.balanceOf(address(this)) >= rewardAmount,
            "Insufficient contract balance"
        );
        require(
            usdtToken.transfer(msg.sender, rewardAmount),
            "Reward transfer failed"
        );
        
        totalRewardsDistributed += rewardAmount;
        
        emit MiningSuccess(msg.sender, rewardAmount, nonce);
        return true;
    }
    
    /**
     * @dev Check if hash meets difficulty requirements
     * @param hash Hash to check
     * @return valid Whether hash is valid
     */
    function checkDifficulty(bytes32 hash) public view returns (bool valid) {
        uint256 difficulty = miningDifficulty;
        uint256 target = 0;
        
        for (uint256 i = 0; i < difficulty; i++) {
            target = target | (uint256(0xFF) << (248 - i * 8));
        }
        
        return uint256(hash) < (type(uint256).max - target);
    }
    
    /**
     * @dev Get miner statistics
     * @param miner Address of miner
     * @return totalMined Total amount mined
     * @return lastMiningTime Last mining timestamp
     * @return successfulMines Number of successful mines
     */
    function getMinerStats(address miner) external view returns (
        uint256 totalMined,
        uint256 lastMiningTime,
        uint256 successfulMines
    ) {
        MinerStats memory stats = minerStats[miner];
        return (stats.totalMined, stats.lastMiningTime, stats.successfulMines);
    }
    
    /**
     * @dev Update mining difficulty (only owner)
     * @param _newDifficulty New difficulty level
     */
    function updateDifficulty(uint256 _newDifficulty) external onlyOwner {
        require(_newDifficulty > 0 && _newDifficulty <= 10, "Invalid difficulty");
        miningDifficulty = _newDifficulty;
        emit DifficultyUpdated(_newDifficulty);
    }
    
    /**
     * @dev Update reward amount (only owner)
     * @param _newReward New reward amount
     */
    function updateReward(uint256 _newReward) external onlyOwner {
        require(_newReward > 0, "Invalid reward amount");
        rewardAmount = _newReward;
        emit RewardUpdated(_newReward);
    }
    
    /**
     * @dev Update minimum block time (only owner)
     * @param _newMinBlockTime New minimum block time
     */
    function updateMinBlockTime(uint256 _newMinBlockTime) external onlyOwner {
        minBlockTime = _newMinBlockTime;
    }
    
    /**
     * @dev Deposit USDT tokens to contract for rewards
     * @param amount Amount to deposit
     */
    function depositRewards(uint256 amount) external {
        require(amount > 0, "Invalid amount");
        require(
            usdtToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        emit TokensDeposited(msg.sender, amount);
    }
    
    /**
     * @dev Withdraw USDT tokens from contract (only owner)
     * @param amount Amount to withdraw
     */
    function withdrawRewards(uint256 amount) external onlyOwner {
        require(amount > 0, "Invalid amount");
        require(
            usdtToken.transfer(owner(), amount),
            "Transfer failed"
        );
    }
    
    /**
     * @dev Get contract balance
     * @return balance Current USDT balance
     */
    function getContractBalance() external view returns (uint256 balance) {
        return usdtToken.balanceOf(address(this));
    }
}
