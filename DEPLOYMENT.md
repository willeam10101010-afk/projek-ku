# VPS Deployment Guide

This guide will help you deploy the Ethereum Message DApp to a VPS (Virtual Private Server).

## Prerequisites

- A VPS with Ubuntu 20.04 or later
- SSH access to your VPS
- A domain name (optional but recommended)
- Sudo privileges on the VPS

## Step 1: Update System and Install Dependencies

```bash
# Connect to your VPS
ssh user@your-vps-ip

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install Git
sudo apt install -y git

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally (process manager)
sudo npm install -g pm2
```

## Step 2: Clone and Build the Application

```bash
# Create directory for the application
sudo mkdir -p /var/www/ethereum-dapp
sudo chown -R $USER:$USER /var/www/ethereum-dapp

# Clone the repository
cd /var/www/ethereum-dapp
git clone https://github.com/willeam10101010-afk/projek-ku.git .

# Install dependencies and build
cd client
npm install
npm run build
```

## Step 3: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ethereum-dapp
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain
    
    root /var/www/ethereum-dapp/client/build;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable the site and restart Nginx:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/ethereum-dapp /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

## Step 4: Configure Firewall

```bash
# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Step 5: Set Up SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts to configure SSL
```

Certbot will automatically:
- Obtain a certificate
- Update your Nginx configuration
- Set up auto-renewal

## Step 6: Set Up Automatic Updates

Create a deployment script:

```bash
nano /var/www/ethereum-dapp/deploy.sh
```

Add the following:

```bash
#!/bin/bash

# Navigate to project directory
cd /var/www/ethereum-dapp

# Pull latest changes
git pull origin main

# Install dependencies and rebuild
cd client
npm install
npm run build

# Restart Nginx
sudo systemctl restart nginx

echo "Deployment completed successfully!"
```

Make it executable:

```bash
chmod +x /var/www/ethereum-dapp/deploy.sh
```

## Step 7: Alternative Deployment with PM2 and serve

If you prefer to use PM2 instead of static file serving:

```bash
# Install serve
sudo npm install -g serve

# Navigate to project directory
cd /var/www/ethereum-dapp/client

# Build the application
npm run build

# Start with PM2
pm2 serve build 3000 --name ethereum-dapp --spa

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup

# Follow the command that PM2 outputs
```

Update Nginx configuration to proxy to PM2:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Step 8: Monitoring and Maintenance

### View Nginx logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### PM2 monitoring (if using PM2)
```bash
# View PM2 logs
pm2 logs ethereum-dapp

# Monitor PM2 processes
pm2 monit

# View PM2 status
pm2 status
```

### Update the application
```bash
# Run the deployment script
/var/www/ethereum-dapp/deploy.sh
```

## Step 9: Domain Configuration

Point your domain to your VPS:

1. Log in to your domain registrar
2. Create an A record pointing to your VPS IP address:
   - Type: A
   - Name: @ (or your subdomain)
   - Value: your-vps-ip
   - TTL: 3600

3. Create a CNAME record for www (optional):
   - Type: CNAME
   - Name: www
   - Value: your-domain.com
   - TTL: 3600

Wait for DNS propagation (can take up to 48 hours, usually much faster).

## Troubleshooting

### Nginx won't start
```bash
# Check for syntax errors
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### Application not loading
```bash
# Check if files exist
ls -la /var/www/ethereum-dapp/client/build

# Check Nginx configuration
sudo nginx -t

# Check file permissions
sudo chown -R www-data:www-data /var/www/ethereum-dapp/client/build
```

### SSL certificate issues
```bash
# Renew certificate manually
sudo certbot renew

# Test certificate renewal
sudo certbot renew --dry-run
```

## Security Best Practices

1. **Keep system updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use strong SSH keys** instead of password authentication

3. **Configure fail2ban** to prevent brute force attacks:
   ```bash
   sudo apt install fail2ban
   ```

4. **Regular backups**:
   ```bash
   # Backup script
   tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/ethereum-dapp
   ```

5. **Monitor server resources**:
   ```bash
   sudo apt install htop
   htop
   ```

## Performance Optimization

1. **Enable Nginx caching** (already configured in the Nginx config above)

2. **Use a CDN** like Cloudflare for better performance and DDoS protection

3. **Optimize images** in the build before deployment

4. **Enable HTTP/2**:
   ```nginx
   listen 443 ssl http2;
   ```

## Accessing Your DApp

After deployment, your DApp will be accessible at:
- HTTP: `http://your-domain.com`
- HTTPS: `https://your-domain.com` (if SSL is configured)

## Support

For issues with deployment, check:
- Nginx error logs: `/var/log/nginx/error.log`
- System logs: `sudo journalctl -xe`
- Application logs: PM2 logs if using PM2

For application issues, refer to the main README.md file.
