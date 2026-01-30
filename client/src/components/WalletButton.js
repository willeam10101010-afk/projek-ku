import React from 'react';
import './WalletButton.css';

const WalletButton = ({ account, onConnect, balance }) => {
  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatBalance = (bal) => {
    if (bal === null || bal === undefined) {
      return '0.0000';
    }

    const num = Number(bal);
    if (!Number.isFinite(num)) {
      return '0.0000';
    }

    return num.toFixed(4);
  };

  return (
    <div className="wallet-button-container">
      {!account ? (
        <button className="wallet-button connect-button" onClick={onConnect}>
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <div className="wallet-address">
            <span className="label">Address:</span>
            <span className="address">{formatAddress(account)}</span>
          </div>
          {balance && (
            <div className="wallet-balance">
              <span className="label">Balance:</span>
              <span className="balance">{formatBalance(balance)} ETH</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletButton;
