import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AuthorizationContract from './artifacts/contracts/Authorization.sol/Authorization.json';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [authorizedList, setAuthorizedList] = useState([]);
  const [newAuthorizedAddress, setNewAuthorizedAddress] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (account && contract) {
      loadAuthorizedList();
    }
  }, [account, contract]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        showNotification('Please install MetaMask!', 'error');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length > 0) {
        const account = accounts[0];
        setAccount(account);
        await setupContract();
        showNotification('Wallet connected successfully!', 'success');
      }
    } catch (error) {
      console.error(error);
      showNotification('Error checking wallet connection', 'error');
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        showNotification('Please install MetaMask!', 'error');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      await setupContract();
      showNotification('Wallet connected successfully!', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Error connecting wallet', 'error');
    }
  };

  const setupContract = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const authorizationContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        AuthorizationContract.abi,
        signer
      );
      setContract(authorizationContract);
    } catch (error) {
      console.error(error);
      showNotification('Error setting up contract', 'error');
    }
  };

  const loadAuthorizedList = async () => {
    try {
      setLoading(true);
      const list = await contract.getAuthorizedList(account);
      const activeList = [];
      
      for (let i = 0; i < list.length; i++) {
        const isAuth = await contract.isAuthorized(account, list[i]);
        if (isAuth) {
          activeList.push(list[i]);
        }
      }
      
      setAuthorizedList(activeList);
    } catch (error) {
      console.error(error);
      showNotification('Error loading authorized list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const authorizeAddress = async (e) => {
    e.preventDefault();
    
    if (!ethers.utils.isAddress(newAuthorizedAddress)) {
      showNotification('Invalid Ethereum address', 'error');
      return;
    }

    if (newAuthorizedAddress.toLowerCase() === account.toLowerCase()) {
      showNotification('Cannot authorize your own address', 'error');
      return;
    }

    try {
      setLoading(true);
      showNotification('Transaction pending...', 'info');
      
      const tx = await contract.authorize(newAuthorizedAddress);
      await tx.wait();
      
      showNotification('Authorization granted successfully!', 'success');
      setNewAuthorizedAddress('');
      await loadAuthorizedList();
    } catch (error) {
      console.error(error);
      if (error.message.includes('Already authorized')) {
        showNotification('Address is already authorized', 'error');
      } else if (error.message.includes('user rejected')) {
        showNotification('Transaction cancelled', 'info');
      } else {
        showNotification('Error authorizing address', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const revokeAuthorization = async (address) => {
    try {
      setLoading(true);
      showNotification('Transaction pending...', 'info');
      
      const tx = await contract.revokeAuthorization(address);
      await tx.wait();
      
      showNotification('Authorization revoked successfully!', 'success');
      await loadAuthorizedList();
    } catch (error) {
      console.error(error);
      if (error.message.includes('user rejected')) {
        showNotification('Transaction cancelled', 'info');
      } else {
        showNotification('Error revoking authorization', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>🔐 Authorization DApp</h1>
        <p>Manage third-party authorization for your Ethereum account</p>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="wallet-info">
        {!account ? (
          <div>
            <h3>Connect Your Wallet</h3>
            <p>Connect your MetaMask wallet to manage authorizations</p>
            <button onClick={connectWallet} className="connect-button">
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <h3>Connected Wallet</h3>
            <div className="wallet-address">{account}</div>
          </div>
        )}
      </div>

      {account && contract && (
        <>
          <div className="authorization-panel">
            <h2>Authorize Third Party</h2>
            <form onSubmit={authorizeAddress} className="authorization-form">
              <input
                type="text"
                placeholder="Enter Ethereum address (0x...)"
                value={newAuthorizedAddress}
                onChange={(e) => setNewAuthorizedAddress(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !newAuthorizedAddress}
              >
                Authorize
              </button>
            </form>
          </div>

          <div className="authorization-panel">
            <h2>Authorized Third Parties ({authorizedList.length})</h2>
            {loading ? (
              <div className="loading">Loading authorized addresses</div>
            ) : authorizedList.length === 0 ? (
              <div className="empty-state">
                <p>No authorized third parties yet.</p>
                <p>Add an address above to grant authorization.</p>
              </div>
            ) : (
              <ul className="authorized-list">
                {authorizedList.map((address, index) => (
                  <li key={index} className="authorized-item">
                    <span className="authorized-address">{address}</span>
                    <button
                      onClick={() => revokeAuthorization(address)}
                      className="btn-danger"
                      disabled={loading}
                    >
                      Revoke
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {!window.ethereum && (
        <div className="authorization-panel">
          <h2>⚠️ MetaMask Not Detected</h2>
          <p>
            Please install{' '}
            <a
              href="https://metamask.io/download.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask
            </a>{' '}
            to use this DApp.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
