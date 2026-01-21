import axios from 'axios';

// Use backend proxy server to avoid CORS issues
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Fetch top cryptocurrencies by market cap
export const getTopCryptocurrencies = async (limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/crypto/markets`,
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    throw error;
  }
};

// Search cryptocurrencies by name or symbol
export const searchCryptocurrencies = async (query) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/crypto/search`,
      {
        params: {
          query: query
        }
      }
    );
    return response.data.coins;
  } catch (error) {
    console.error('Error searching cryptocurrency:', error);
    throw error;
  }
};

