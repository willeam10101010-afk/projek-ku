// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MessageStorage
 * @dev Store and retrieve a message on the blockchain
 */
contract MessageStorage {
    string private message;
    address public owner;
    
    event MessageUpdated(string newMessage, address indexed updatedBy);
    
    constructor(string memory initialMessage) {
        message = initialMessage;
        owner = msg.sender;
    }
    
    /**
     * @dev Store a new message
     * @param newMessage The message to store
     */
    function setMessage(string memory newMessage) public {
        require(bytes(newMessage).length > 0, "Message cannot be empty");
        require(bytes(newMessage).length <= 280, "Message too long (max 280 characters)");
        message = newMessage;
        emit MessageUpdated(newMessage, msg.sender);
    }
    
    /**
     * @dev Retrieve the stored message
     * @return The current message
     */
    function getMessage() public view returns (string memory) {
        return message;
    }
}
