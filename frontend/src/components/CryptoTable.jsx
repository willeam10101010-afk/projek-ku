import React from 'react';
import './CryptoTable.css';

const CryptoTable = ({ cryptos, sortConfig, onSort }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      compactDisplay: 'short',
    }).format(marketCap);
  };

  const formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined) return 'N/A';
    return `${percentage.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  const getSortIndicator = (columnName) => {
    if (sortConfig.key !== columnName) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="crypto-table-container">
      <table className="crypto-table">
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => onSort('name')} className="sortable">
              Name {getSortIndicator('name')}
            </th>
            <th>Symbol</th>
            <th onClick={() => onSort('current_price')} className="sortable">
              Price {getSortIndicator('current_price')}
            </th>
            <th onClick={() => onSort('price_change_percentage_24h')} className="sortable">
              24h Change {getSortIndicator('price_change_percentage_24h')}
            </th>
            <th onClick={() => onSort('market_cap')} className="sortable">
              Market Cap {getSortIndicator('market_cap')}
            </th>
            <th onClick={() => onSort('total_volume')} className="sortable">
              24h Volume {getSortIndicator('total_volume')}
            </th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto, index) => (
            <tr key={crypto.id}>
              <td>{index + 1}</td>
              <td className="crypto-name">
                <img src={crypto.image} alt={crypto.name} className="crypto-icon" />
                <span>{crypto.name}</span>
              </td>
              <td className="crypto-symbol">{crypto.symbol.toUpperCase()}</td>
              <td className="crypto-price">{formatPrice(crypto.current_price)}</td>
              <td className={`crypto-change ${getChangeColor(crypto.price_change_percentage_24h)}`}>
                {formatPercentage(crypto.price_change_percentage_24h)}
              </td>
              <td className="crypto-marketcap">{formatMarketCap(crypto.market_cap)}</td>
              <td className="crypto-volume">{formatMarketCap(crypto.total_volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
