import axios from 'axios';

const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Fetch top cryptocurrencies by market cap
export const getTopCryptocurrencies = async (limit = 10) => {
  try {
    const response = await axios.get(
      `${COINGECKO_API_BASE_URL}/coins/markets`,
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
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
      `${COINGECKO_API_BASE_URL}/search`,
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
