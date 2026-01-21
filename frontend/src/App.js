import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { CONTRACT_ABI, CONTRACT_ADDRESS, NETWORK_CONFIG } from './config';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed. Please install MetaMask to use this DApp.');
        return;
      }

      setLoading(true);
      setError('');

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAccount(accounts[0]);

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get contract instance
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setContract(contractInstance);
      
      // Load current message
      await loadMessage(contractInstance);

      setLoading(false);
    } catch (err) {
      console.error('Error connecting to wallet:', err);
      setError('Failed to connect to wallet: ' + err.message);
      setLoading(false);
    }
  };

  // Load message from contract
  const loadMessage = async (contractInstance = contract) => {
    try {
      if (!contractInstance) return;
      
      const currentMessage = await contractInstance.getMessage();
      setMessage(currentMessage);
    } catch (err) {
      console.error('Error loading message:', err);
      setError('Failed to load message: ' + err.message);
    }
  };

  // Update message on blockchain
  const updateMessage = async () => {
    try {
      if (!contract) {
        setError('Please connect your wallet first');
        return;
      }

      if (!newMessage.trim()) {
        setError('Please enter a message');
        return;
      }

      setLoading(true);
      setError('');

      // Send transaction
      const tx = await contract.setMessage(newMessage);
      
      // Wait for transaction to be mined
      await tx.wait();

      // Reload message
      await loadMessage();
      
      setNewMessage('');
      setLoading(false);
      alert('Message updated successfully!');
    } catch (err) {
      console.error('Error updating message:', err);
      setError('Failed to update message: ' + err.message);
      setLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setContract(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ethereum Message DApp</h1>
        <p className="subtitle">Store and retrieve messages on the blockchain</p>

        {error && <div className="error-message">{error}</div>}

        {!account ? (
          <div className="connect-section">
            <button 
              onClick={connectWallet} 
              disabled={loading}
              className="connect-button"
            >
              {loading ? 'Connecting...' : 'Connect MetaMask'}
            </button>
            <p className="info-text">Connect your MetaMask wallet to interact with the DApp</p>
          </div>
        ) : (
          <div className="connected-section">
            <div className="account-info">
              <p>Connected: {account.substring(0, 6)}...{account.substring(38)}</p>
            </div>

            <div className="message-display">
              <h2>Current Message</h2>
              <div className="message-box">
                {message || 'No message set yet'}
              </div>
              <button 
                onClick={() => loadMessage()} 
                disabled={loading}
                className="refresh-button"
              >
                Refresh
              </button>
            </div>

            <div className="message-input">
              <h2>Update Message</h2>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter your new message..."
                disabled={loading}
                rows="4"
              />
              <button 
                onClick={updateMessage} 
                disabled={loading || !newMessage.trim()}
                className="update-button"
              >
                {loading ? 'Updating...' : 'Update Message'}
              </button>
            </div>
          </div>
        )}

        <div className="footer">
          <p>Contract Address: {CONTRACT_ADDRESS}</p>
          <p className="info-text">Make sure you're connected to the correct network</p>
        </div>
      </header>
    </div>
  );
}

export default App;
