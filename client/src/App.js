import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletButton from './components/WalletButton';
import MessageBox from './components/MessageBox';
import Notification from './components/Notification';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './config/contract';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Initialize contract and check for existing connection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      checkWalletConnection();
      setupEventListeners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load message when contract is available
  useEffect(() => {
    if (contract) {
      loadMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const setupEventListeners = () => {
    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          handleDisconnect();
        } else {
          setAccount(accounts[0]);
          loadBalance(accounts[0]);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          await loadBalance(address);
          initializeContract(provider, signer);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const initializeContract = (provider, signer) => {
    try {
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      setContract(contractInstance);

      // Listen for MessageUpdated events
      contractInstance.on('MessageUpdated', (newMessage, updatedBy) => {
        console.log('Message updated:', newMessage, 'by:', updatedBy);
        setMessage(newMessage);
        showNotification('Message updated successfully!', 'success');
      });
    } catch (error) {
      console.error('Error initializing contract:', error);
      showNotification('Error initializing contract. Please check configuration.', 'error');
    }
  };

  const loadBalance = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const loadMessage = async () => {
    if (!contract) return;
    
    setIsLoading(true);
    try {
      const currentMessage = await contract.getMessage();
      setMessage(currentMessage);
    } catch (error) {
      console.error('Error loading message:', error);
      showNotification('Error loading message from contract', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!window.ethereum) {
      showNotification(
        'MetaMask not detected. Please install MetaMask to use this DApp.',
        'error'
      );
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      await loadBalance(address);
      initializeContract(provider, signer);
      
      showNotification('Wallet connected successfully!', 'success');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        showNotification('Connection request rejected by user', 'warning');
      } else {
        showNotification('Error connecting wallet: ' + error.message, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setBalance(null);
    setContract(null);
    setMessage('');
    showNotification('Wallet disconnected', 'info');
  };

  const handleUpdateMessage = async (newMessage) => {
    if (!contract) {
      showNotification('Contract not initialized', 'error');
      return;
    }

    if (!account) {
      showNotification('Please connect your wallet first', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      showNotification('Sending transaction... Please confirm in MetaMask', 'info');
      
      const tx = await contract.setMessage(newMessage);
      
      showNotification('Transaction sent! Waiting for confirmation...', 'info');
      
      await tx.wait();
      
      showNotification('Message updated successfully!', 'success');
      
      // Reload the message to reflect changes
      await loadMessage();
    } catch (error) {
      console.error('Error updating message:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        showNotification('Transaction rejected by user', 'warning');
      } else if (error.message.includes('Message cannot be empty')) {
        showNotification('Message cannot be empty', 'error');
      } else if (error.message.includes('Message too long')) {
        showNotification('Message is too long (max 280 characters)', 'error');
      } else {
        showNotification('Error updating message: ' + error.message, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg, type) => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000);
  };

  return (
    <div className="App">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />
      
      <header className="App-header">
        <h1>Ethereum Message DApp</h1>
        <p className="subtitle">Store and retrieve messages on the blockchain</p>
      </header>

      <WalletButton
        account={account}
        onConnect={handleConnect}
        balance={balance}
      />

      {account && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000" ? (
        <MessageBox
          message={message}
          onUpdate={handleUpdateMessage}
          isLoading={isLoading}
          account={account}
        />
      ) : account ? (
        <div className="contract-warning">
          <p>⚠️ Contract not deployed yet</p>
          <p className="small">
            Please deploy the MessageStorage contract and update the contract address
            in <code>src/config/contract.js</code>
          </p>
        </div>
      ) : (
        <div className="connect-prompt">
          <p>👆 Connect your wallet to get started</p>
        </div>
      )}

      <footer className="App-footer">
        <p>Built with React & Ethers.js</p>
      </footer>
    </div>
  );
}

export default App;
