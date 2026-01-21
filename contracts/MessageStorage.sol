// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MessageStorage
 * @dev Store and retrieve a message on the blockchain
 */
contract MessageStorage {
    string private message;
    address public owner;
    
    event MessageUpdated(string newMessage, address updatedBy);
    
    constructor(string memory initialMessage) {
        message = initialMessage;
        owner = msg.sender;
    }
    
    /**
     * @dev Store a new message
     * @param newMessage The message to store
     */
    function setMessage(string memory newMessage) public {
        message = newMessage;
        emit MessageUpdated(newMessage, msg.sender);
    }
    
    /**
     * @dev Retrieve the stored message
     * @return The stored message
     */
    function getMessage() public view returns (string memory) {
        return message;
    }
}
