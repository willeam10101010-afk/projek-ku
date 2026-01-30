# Cryptocurrency Real-Time Monitoring DApp

A modern, real-time cryptocurrency monitoring dashboard that tracks the top 10 cryptocurrencies by market cap. Built with React, Vite, and Express.

![Crypto Monitor Screenshot](https://github.com/user-attachments/assets/67ccbd8a-eb8b-4cdb-af77-9f31f84e4f2e)

## Features

✅ **Real-Time Data Updates**
- Automatically refreshes cryptocurrency data every 30 seconds
- Live price tracking for top 10 cryptocurrencies
- Real-time market cap and 24-hour volume data

✅ **Interactive UI**
- Search/filter cryptocurrencies by name or symbol
- Sortable columns (Name, Price, 24h Change, Market Cap, Volume)
- Responsive design for mobile and desktop
- Color-coded price changes (green for positive, red for negative)

✅ **Comprehensive Data Display**
- Cryptocurrency name and symbol
- Current price in USD
- 24-hour price change percentage
- Market capitalization
- 24-hour trading volume
- Cryptocurrency logos

✅ **Modern Tech Stack**
- React 19 with Hooks
- Vite for fast development and building
- Express backend proxy server
- Axios for API requests
- Modern CSS with gradients and animations

## Project Structure

```
projek-ku/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── CryptoMonitor.jsx
│   │   │   ├── CryptoMonitor.css
│   │   │   ├── CryptoTable.jsx
│   │   │   └── CryptoTable.css
│   │   ├── services/      # API service layer
│   │   │   └── coinGeckoAPI.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/               # Express backend proxy server
│   ├── server.js
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/willeam10101010-afk/projek-ku.git
cd projek-ku
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running Locally

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:3001`

### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port shown in the terminal)

## Building for Production

### Build the Frontend

```bash
cd frontend
npm run build
```

The production-ready files will be in the `frontend/dist` directory.

### Production Deployment

For production deployment, you'll need to:

1. Build the frontend: `cd frontend && npm run build`
2. Serve the built files using a static file server
3. Run the backend server: `cd backend && npm start`
4. Configure environment variables for API endpoints

## Environment Variables

### Frontend

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3001
```

For production, update this to your backend server URL.

## API Integration

The application uses a backend proxy server to fetch cryptocurrency data. The backend currently uses mock data for demonstration purposes. To connect to the real CoinGecko API:

1. Update `backend/server.js` to use the real API implementation
2. Optionally, add API rate limiting and caching
3. Consider using CoinGecko API key for higher rate limits

## Features Implemented

### ✅ Requirements from Problem Statement

1. **API Integration**
   - ✅ Mock data API (can be easily switched to CoinGecko API)
   - ✅ Fetches top 10 cryptocurrencies by market cap
   - ✅ Auto-refresh every 30 seconds

2. **Frontend Design**
   - ✅ Clean, modern UI with table display
   - ✅ Shows: Coin Name, Symbol, Current Price, 24h Change %, Market Cap, 24h Volume
   - ✅ Cryptocurrency icons
   - ✅ Responsive design

3. **Real-time Updates**
   - ✅ Auto-refresh functionality (30-second intervals)
   - ✅ Live update timestamp display
   - ✅ Manual refresh button

4. **User Experience**
   - ✅ Search bar for filtering coins
   - ✅ Sortable columns (click column headers)
   - ✅ Clean error handling and loading states
   - ✅ Responsive design for all screen sizes

## Technologies Used

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

### Backend
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client (for external API calls)

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Price alerts and notifications
- [ ] Historical data charts
- [ ] Additional cryptocurrencies beyond top 10
- [ ] Dark/light theme toggle
- [ ] User preferences persistence
- [ ] Advanced filtering options
- [ ] Export data functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgments

- Data structure based on CoinGecko API
- UI inspired by modern cryptocurrency tracking platforms

## Support

For issues and questions, please open an issue on GitHub.
