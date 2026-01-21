// Import ethers from CDN
import { ethers } from 'https://cdn.ethers.io/lib/ethers-5.7.esm.min.js';

class WalletConnection {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.address = null;
        this.isConnected = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkWalletConnection();
        this.setupAccountChangeListener();
    }

    setupEventListeners() {
        document.getElementById('connectButton').addEventListener('click', () => this.connectWallet());
        document.getElementById('disconnectButton').addEventListener('click', () => this.disconnectWallet());
        document.getElementById('transactionForm').addEventListener('submit', (e) => this.sendTransaction(e));
    }

    async checkWalletConnection() {
        if (typeof window.ethereum !== 'undefined') {
            console.log('Ethereum wallet detected!');
            
            // Check if already connected
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await this.connectWallet();
                }
            } catch (error) {
                console.error('Error checking wallet connection:', error);
            }
        } else {
            this.showStatus('connectionStatus', 'No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.', 'error');
        }
    }

    setupAccountChangeListener() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnectWallet();
                } else {
                    this.connectWallet();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }

    async connectWallet() {
        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error('No Ethereum wallet found. Please install MetaMask.');
            }

            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });

            // Create provider and signer
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            this.address = accounts[0];
            this.isConnected = true;

            // Update UI
            await this.updateWalletInfo();
            this.showStatus('connectionStatus', 'Wallet connected successfully!', 'success');
            
            // Show/hide buttons
            document.getElementById('connectButton').style.display = 'none';
            document.getElementById('disconnectButton').style.display = 'inline-block';
            document.getElementById('walletInfo').style.display = 'block';
            document.getElementById('transactionSection').style.display = 'block';

        } catch (error) {
            console.error('Error connecting wallet:', error);
            this.showStatus('connectionStatus', `Error: ${error.message}`, 'error');
        }
    }

    disconnectWallet() {
        this.provider = null;
        this.signer = null;
        this.address = null;
        this.isConnected = false;

        // Update UI
        document.getElementById('connectButton').style.display = 'inline-block';
        document.getElementById('disconnectButton').style.display = 'none';
        document.getElementById('walletInfo').style.display = 'none';
        document.getElementById('transactionSection').style.display = 'none';
        document.getElementById('status').textContent = 'Disconnected';
        document.getElementById('status').className = 'badge disconnected';
        document.getElementById('address').textContent = '-';
        document.getElementById('network').textContent = '-';
        document.getElementById('balance').textContent = '-';
        
        this.showStatus('connectionStatus', 'Wallet disconnected', 'info');
    }

    async updateWalletInfo() {
        try {
            // Update connection status
            const statusElement = document.getElementById('status');
            statusElement.textContent = 'Connected';
            statusElement.className = 'badge connected';

            // Update address
            document.getElementById('address').textContent = this.address;

            // Get network
            const network = await this.provider.getNetwork();
            document.getElementById('network').textContent = `${network.name} (Chain ID: ${network.chainId})`;

            // Get balance
            const balance = await this.provider.getBalance(this.address);
            const balanceInEth = ethers.utils.formatEther(balance);
            document.getElementById('balance').textContent = `${parseFloat(balanceInEth).toFixed(6)} ETH`;

        } catch (error) {
            console.error('Error updating wallet info:', error);
        }
    }

    async sendTransaction(event) {
        event.preventDefault();

        const recipientAddress = document.getElementById('recipientAddress').value;
        const amount = document.getElementById('amount').value;

        try {
            // Validate recipient address
            if (!ethers.utils.isAddress(recipientAddress)) {
                throw new Error('Invalid recipient address');
            }

            // Validate amount
            if (parseFloat(amount) <= 0) {
                throw new Error('Amount must be greater than 0');
            }

            this.showStatus('transactionStatus', 'Sending transaction...', 'info');

            // Create transaction
            const tx = await this.signer.sendTransaction({
                to: recipientAddress,
                value: ethers.utils.parseEther(amount)
            });

            this.showStatus('transactionStatus', `Transaction sent! Hash: ${tx.hash}. Waiting for confirmation...`, 'info');

            // Wait for transaction to be mined
            const receipt = await tx.wait();

            this.showStatus('transactionStatus', 
                `Transaction confirmed! Block: ${receipt.blockNumber}, Hash: ${receipt.transactionHash}`, 
                'success'
            );

            // Update balance
            await this.updateWalletInfo();

            // Clear form
            document.getElementById('transactionForm').reset();

        } catch (error) {
            console.error('Transaction error:', error);
            let errorMessage = error.message;
            
            // Handle common errors
            if (error.code === 4001) {
                errorMessage = 'Transaction rejected by user';
            } else if (error.code === 'INSUFFICIENT_FUNDS') {
                errorMessage = 'Insufficient funds for transaction';
            }
            
            this.showStatus('transactionStatus', `Error: ${errorMessage}`, 'error');
        }
    }

    showStatus(elementId, message, type) {
        const statusElement = document.getElementById(elementId);
        statusElement.textContent = message;
        statusElement.className = `status ${type}`;
        statusElement.style.display = 'block';
    }

    // Utility method to get connection status
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            address: this.address,
            provider: this.provider !== null,
            signer: this.signer !== null
        };
    }
}

// Initialize the wallet connection
const wallet = new WalletConnection();

// Make it available globally for debugging
window.wallet = wallet;
