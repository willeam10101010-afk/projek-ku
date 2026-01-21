# Testing the Ethereum Wallet DApp

This guide will help you test all features of the DApp with MetaMask.

## Prerequisites

1. Install MetaMask browser extension from [metamask.io](https://metamask.io/)
2. Set up MetaMask with a test account
3. Get test ETH from a faucet (for testnets like Sepolia or Goerli)

## Test Scenarios

### 1. Wallet Detection
- **Expected**: On page load, the DApp should detect if MetaMask is installed
- **Without MetaMask**: Shows error "No Ethereum wallet detected"
- **With MetaMask**: Shows "Connect Wallet" button

### 2. Wallet Connection
1. Click "Connect Wallet" button
2. MetaMask popup should appear
3. Click "Next" and "Connect" in MetaMask
4. **Expected Results**:
   - Button changes to "Disconnect"
   - Wallet information section appears
   - Shows connection status: "Connected" (green badge)
   - Displays your Ethereum address
   - Shows current network name and chain ID
   - Displays your ETH balance

### 3. Connection Status Detection
- The DApp continuously monitors wallet connection
- **Test**: Lock MetaMask or switch accounts
- **Expected**: DApp automatically disconnects and prompts to reconnect

### 4. Network Change Detection
- **Test**: Switch networks in MetaMask (e.g., from Ethereum Mainnet to Sepolia)
- **Expected**: Page automatically reloads and updates network information

### 5. Send Test Transaction

**Important**: Use a testnet (Sepolia, Goerli) for testing to avoid losing real ETH!

1. Make sure you're connected to a testnet
2. Get test ETH from a faucet:
   - Sepolia: https://sepoliafaucet.com/
   - Goerli: https://goerlifaucet.com/
3. In the "Send Test Transaction" section:
   - Enter a valid recipient address (can use your own address for testing)
   - Enter a small amount (e.g., 0.001 ETH)
4. Click "Send Transaction"
5. **Expected Results**:
   - MetaMask popup appears with transaction details
   - Shows gas fees
   - After confirmation, status shows "Transaction sent! Hash: 0x..."
   - After mining, status shows "Transaction confirmed! Block: ..."
   - Balance updates automatically

### 6. Error Handling Tests

**Invalid Address**:
- Enter an invalid address (e.g., "0x123")
- **Expected**: Error message "Invalid recipient address"

**Insufficient Funds**:
- Try to send more ETH than you have
- **Expected**: Error message "Insufficient funds for transaction"

**Transaction Rejection**:
- Click "Send Transaction" then reject in MetaMask
- **Expected**: Error message "Transaction rejected by user"

**Zero/Negative Amount**:
- Enter 0 or negative amount
- **Expected**: Form validation prevents submission

### 7. Disconnect Wallet
1. Click "Disconnect" button
2. **Expected Results**:
   - Wallet information section hides
   - Transaction section hides
   - Shows "Connect Wallet" button again
   - Status shows "Disconnected"

## Tips for Testing

1. **Use Testnets**: Always test on testnets (Sepolia, Goerli) to avoid losing real funds
2. **Check Console**: Open browser DevTools (F12) to see detailed logs
3. **Test Different Browsers**: Try Chrome, Firefox, Edge to ensure compatibility
4. **Mobile Testing**: Test on mobile browsers with MetaMask mobile app
5. **Clear Cache**: If issues occur, try clearing browser cache and reloading

## Common Issues

**MetaMask not detected after installation**:
- Refresh the page
- Make sure MetaMask is enabled and unlocked

**Transaction taking too long**:
- Check network congestion
- Ensure you have enough ETH for gas fees
- Try increasing gas price in MetaMask settings

**Connection keeps dropping**:
- Check MetaMask is not locked
- Ensure you haven't revoked permissions in MetaMask

## Security Reminders

- ⚠️ Never share your private key or seed phrase
- ⚠️ Always verify transaction details before confirming
- ⚠️ Start with small amounts when testing
- ⚠️ Use testnets for practice before using mainnet
- ⚠️ This is a demo application - review code before using with significant funds
