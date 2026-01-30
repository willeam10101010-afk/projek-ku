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
    function _utf8CharLength(string memory s) internal pure returns (uint256) {
        bytes memory b = bytes(s);
        uint256 length = 0;
        uint256 i = 0;
        while (i < b.length) {
            uint8 c = uint8(b[i]);
            if (c < 0x80) {
                i += 1;
            } else if (c < 0xE0) {
                i += 2;
            } else if (c < 0xF0) {
                i += 3;
            } else {
                i += 4;
            }
            length++;
        }
        return length;
    }
    
    function setMessage(string memory newMessage) public {
        require(bytes(newMessage).length > 0, "Message cannot be empty");
        require(_utf8CharLength(newMessage) <= 280, "Message too long (max 280 characters)");
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
