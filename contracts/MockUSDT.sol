// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDT
 * @dev Mock USDT token for testing purposes
 */
contract MockUSDT is ERC20, Ownable {
    constructor() ERC20("Mock USDT", "USDT") Ownable(msg.sender) {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to receive tokens
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Override decimals to match USDT (6 decimals)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
