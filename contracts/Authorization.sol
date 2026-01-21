// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Authorization
 * @dev Smart contract for managing third-party authorization for user accounts
 * @notice This contract allows users to authorize third parties to perform actions on their behalf
 */
contract Authorization {
    // Mapping from user address to authorized third-party addresses
    mapping(address => mapping(address => bool)) private authorizations;
    
    // Mapping to track all authorized addresses for a user (for listing purposes)
    mapping(address => address[]) private authorizedList;
    
    // Events
    event AuthorizationGranted(address indexed user, address indexed thirdParty, uint256 timestamp);
    event AuthorizationRevoked(address indexed user, address indexed thirdParty, uint256 timestamp);
    
    /**
     * @dev Authorize a third-party to act on behalf of the caller
     * @param thirdParty The address to authorize
     */
    function authorize(address thirdParty) external {
        require(thirdParty != address(0), "Authorization: Cannot authorize zero address");
        require(thirdParty != msg.sender, "Authorization: Cannot authorize self");
        require(!authorizations[msg.sender][thirdParty], "Authorization: Already authorized");
        
        authorizations[msg.sender][thirdParty] = true;
        authorizedList[msg.sender].push(thirdParty);
        
        emit AuthorizationGranted(msg.sender, thirdParty, block.timestamp);
    }
    
    /**
     * @dev Revoke authorization from a third-party
     * @param thirdParty The address to revoke authorization from
     */
    function revokeAuthorization(address thirdParty) external {
        require(thirdParty != address(0), "Authorization: Cannot revoke zero address");
        require(authorizations[msg.sender][thirdParty], "Authorization: Not authorized");
        
        authorizations[msg.sender][thirdParty] = false;
        _removeFromAuthorizedList(msg.sender, thirdParty);
        
        emit AuthorizationRevoked(msg.sender, thirdParty, block.timestamp);
    }
    
    /**
     * @dev Check if a third-party is authorized by a user
     * @param user The user address
     * @param thirdParty The third-party address to check
     * @return bool True if authorized, false otherwise
     */
    function isAuthorized(address user, address thirdParty) external view returns (bool) {
        return authorizations[user][thirdParty];
    }
    
    /**
     * @dev Get list of all authorized third parties for a user
     * @param user The user address
     * @return address[] Array of authorized addresses
     */
    function getAuthorizedList(address user) external view returns (address[] memory) {
        return authorizedList[user];
    }
    
    /**
     * @dev Get the number of authorized third parties for a user
     * @param user The user address
     * @return uint256 Number of authorized addresses
     */
    function getAuthorizedCount(address user) external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < authorizedList[user].length; i++) {
            if (authorizations[user][authorizedList[user][i]]) {
                count++;
            }
        }
        return count;
    }
    
    /**
     * @dev Internal function to remove an address from the authorized list
     * @param user The user address
     * @param thirdParty The third-party address to remove
     */
    function _removeFromAuthorizedList(address user, address thirdParty) private {
        address[] storage list = authorizedList[user];
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == thirdParty) {
                // Move the last element to the position being removed
                list[i] = list[list.length - 1];
                // Remove the last element
                list.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Modifier to check if caller is authorized to act on behalf of a user
     * @param user The user address
     */
    modifier onlyAuthorized(address user) {
        require(
            msg.sender == user || authorizations[user][msg.sender],
            "Authorization: Not authorized to act on behalf of this user"
        );
        _;
    }
    
    /**
     * @dev Example function demonstrating the use of authorization
     * In a real application, this would be replaced with actual business logic
     * @param user The user on whose behalf the action is performed
     */
    function performAuthorizedAction(address user) external onlyAuthorized(user) returns (string memory) {
        return "Action performed successfully";
    }
}
