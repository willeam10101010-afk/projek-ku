# Deployment Guide

This guide covers deploying the Cryptocurrency Monitoring DApp to a VPS server.

## Prerequisites

- A VPS with Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access
- Domain name (optional but recommended)
- Node.js 16+ installed on the server

## Quick Start Deployment

### 1. Server Setup

SSH into your VPS:

```bash
ssh user@your-server-ip
```

Install Node.js and npm (if not already installed):

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Install PM2 for process management:

```bash
sudo npm install -g pm2
```

### 2. Clone the Repository

```bash
git clone https://github.com/willeam10101010-afk/projek-ku.git
cd projek-ku
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Create a production start script:

```bash
pm2 start server.js --name crypto-backend
pm2 save
pm2 startup
```

### 4. Setup Frontend

```bash
cd ../frontend
npm install
npm run build
```

### 5. Install and Configure Nginx

Install Nginx:

```bash
sudo apt-get update
sudo apt-get install nginx
```

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/crypto-monitor
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    # Frontend
    location / {
        root /path/to/projek-ku/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/crypto-monitor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## SSL/HTTPS Setup (Recommended)

Install Certbot:

```bash
sudo apt-get install certbot python3-certbot-nginx
```

Get SSL certificate:

```bash
sudo certbot --nginx -d your-domain.com
```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```bash
cd /path/to/projek-ku/backend
nano .env
```

Add:

```env
PORT=3001
NODE_ENV=production
```

### Frontend Environment Variables

Update the API URL in the frontend build:

```bash
cd /path/to/projek-ku/frontend
nano .env.production
```

Add:

```env
VITE_API_URL=https://your-domain.com
```

Rebuild the frontend:

```bash
npm run build
```

## Monitoring and Maintenance

### View Backend Logs

```bash
pm2 logs crypto-backend
```

### Restart Backend

```bash
pm2 restart crypto-backend
```

### Check Status

```bash
pm2 status
```

### Update Application

```bash
cd /path/to/projek-ku
git pull
cd backend && npm install
pm2 restart crypto-backend
cd ../frontend && npm install && npm run build
```

## Performance Optimization

### Enable Nginx Caching

Add to your Nginx configuration:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Enable Gzip Compression

Add to Nginx configuration:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

## Security Best Practices

1. **Keep Software Updated**
   ```bash
   sudo apt-get update
   sudo apt-get upgrade
   ```

2. **Use HTTPS Only**
   - Always use SSL certificates
   - Redirect HTTP to HTTPS

3. **Implement Rate Limiting**
   - Add rate limiting in Nginx or backend

4. **Regular Backups**
   - Backup your application code
   - Backup configuration files

5. **Monitor Server Resources**
   ```bash
   pm2 install pm2-server-monit
   ```

## Troubleshooting

### Backend Not Starting

Check logs:
```bash
pm2 logs crypto-backend
```

Restart:
```bash
pm2 restart crypto-backend
```

### Frontend Not Loading

Check Nginx configuration:
```bash
sudo nginx -t
```

Check Nginx error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

### API Requests Failing

Verify backend is running:
```bash
pm2 status
```

Check if port 3001 is accessible:
```bash
netstat -tulpn | grep 3001
```

## Scaling Considerations

For high-traffic scenarios:

1. **Use a CDN** for static assets
2. **Implement caching** for API responses
3. **Use load balancing** with multiple backend instances
4. **Database caching** with Redis
5. **Horizontal scaling** with multiple servers

## Support

For deployment issues, check:
- Server logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -xe`

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt SSL](https://letsencrypt.org/)
