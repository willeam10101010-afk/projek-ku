import React, { useState, useEffect } from 'react';
import { getTopCryptocurrencies } from '../services/coinGeckoAPI';
import CryptoTable from './CryptoTable';
import './CryptoMonitor.css';

const CryptoMonitor = () => {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'market_cap',
    direction: 'desc'
  });

  const REFRESH_INTERVAL = 30000; // 30 seconds

  // Fetch cryptocurrency data
  const fetchCryptoData = async () => {
    try {
      setError(null);
      const data = await getTopCryptocurrencies(10);
      setCryptos(data);
      setFilteredCryptos(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch {
      setError('Failed to fetch cryptocurrency data. Please try again later.');
      setLoading(false);
    }
  };

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Handle search/filter
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCryptos(cryptos);
    } else {
      const filtered = cryptos.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCryptos(filtered);
    }
  }, [searchQuery, cryptos]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredCryptos].sort((a, b) => {
      if (a[key] === null || a[key] === undefined) return 1;
      if (b[key] === null || b[key] === undefined) return -1;

      if (typeof a[key] === 'string') {
        return direction === 'asc'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }

      return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
    });

    setFilteredCryptos(sorted);
  };

  // Format last update time
  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    return lastUpdate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="crypto-monitor">
      <div className="crypto-header">
        <div className="header-content">
          <h1>🚀 Real-Time Cryptocurrency Monitor</h1>
          <p className="subtitle">Track the top 10 cryptocurrencies by market cap</p>
        </div>
        {lastUpdate && (
          <div className="update-info">
            <span className="update-indicator">●</span>
            <span>Last updated: {formatLastUpdate()}</span>
          </div>
        )}
      </div>

      <div className="crypto-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search by name or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button 
          onClick={fetchCryptoData} 
          className="refresh-button"
          disabled={loading}
        >
          {loading ? '⏳ Refreshing...' : '🔄 Refresh Now'}
        </button>
      </div>

      {loading && cryptos.length === 0 ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading cryptocurrency data...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchCryptoData} className="retry-button">
            Try Again
          </button>
        </div>
      ) : filteredCryptos.length === 0 ? (
        <div className="no-results">
          <p>No cryptocurrencies found matching "{searchQuery}"</p>
        </div>
      ) : (
        <CryptoTable 
          cryptos={filteredCryptos} 
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      )}

      <div className="crypto-footer">
        <p>Data provided by CoinGecko API • Updates every 30 seconds</p>
      </div>
    </div>
  );
};

export default CryptoMonitor;
