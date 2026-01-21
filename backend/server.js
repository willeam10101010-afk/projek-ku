import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Mock cryptocurrency data generator
const generateMockCryptoData = () => {
  const cryptos = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', basePrice: 97000, baseMarketCap: 1900000000000 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', basePrice: 3600, baseMarketCap: 432000000000 },
    { id: 'tether', name: 'Tether', symbol: 'usdt', image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', basePrice: 1.00, baseMarketCap: 138000000000 },
    { id: 'binancecoin', name: 'BNB', symbol: 'bnb', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', basePrice: 690, baseMarketCap: 98000000000 },
    { id: 'solana', name: 'Solana', symbol: 'sol', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', basePrice: 245, baseMarketCap: 122000000000 },
    { id: 'ripple', name: 'XRP', symbol: 'xrp', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', basePrice: 3.20, baseMarketCap: 183000000000 },
    { id: 'usd-coin', name: 'USDC', symbol: 'usdc', image: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png', basePrice: 1.00, baseMarketCap: 42000000000 },
    { id: 'cardano', name: 'Cardano', symbol: 'ada', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', basePrice: 1.05, baseMarketCap: 38000000000 },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', basePrice: 0.38, baseMarketCap: 56000000000 },
    { id: 'polkadot', name: 'Polkadot', symbol: 'dot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', basePrice: 7.20, baseMarketCap: 11000000000 }
  ];

  return cryptos.map((crypto, index) => {
    // Add some random variation to simulate real-time price changes
    const priceVariation = (Math.random() - 0.5) * 0.02; // ±1% variation
    const current_price = crypto.basePrice * (1 + priceVariation);
    const price_change_24h = (Math.random() - 0.5) * 15; // Random change between -7.5% and +7.5%
    const market_cap = crypto.baseMarketCap * (1 + priceVariation);
    const volume_variation = Math.random() * 0.5 + 0.75; // 75% to 125% of base
    const total_volume = market_cap * 0.15 * volume_variation;

    return {
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      image: crypto.image,
      current_price: current_price,
      market_cap: market_cap,
      market_cap_rank: index + 1,
      total_volume: total_volume,
      high_24h: current_price * 1.05,
      low_24h: current_price * 0.95,
      price_change_24h: current_price * (price_change_24h / 100),
      price_change_percentage_24h: price_change_24h,
      market_cap_change_24h: market_cap * (price_change_24h / 100),
      market_cap_change_percentage_24h: price_change_24h,
      circulating_supply: market_cap / current_price,
      last_updated: new Date().toISOString()
    };
  });
};

// Endpoint for fetching top cryptocurrencies
app.get('/api/crypto/markets', async (req, res) => {
  try {
    const { per_page = 10 } = req.query;
    const data = generateMockCryptoData().slice(0, parseInt(per_page));
    res.json(data);
  } catch (error) {
    console.error('Error generating crypto data:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch cryptocurrency data',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Crypto API Proxy Server running on http://localhost:${PORT}`);
  console.log(`📊 Using mock data for demonstration purposes`);
});

