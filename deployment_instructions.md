# Bridgetunes MTN Admin Portal Deployment Instructions

This document provides comprehensive instructions for deploying the Bridgetunes MTN Admin Portal, which includes the authentication system with JWT, dashboard with analytics visualization, draw management with animations, user management interface, notification management system, and CSV upload functionality.

## Prerequisites

Before deploying the Bridgetunes MTN Admin Portal, ensure you have the following:

- A server with at least 2GB RAM and 1 CPU core
- Ubuntu 20.04 LTS or newer
- Node.js 16.x or newer
- MongoDB 4.4 or newer
- Nginx web server
- SSL certificate for your domain
- Access to your domain's DNS settings for CNAME configuration

## Environment Setup

### 1. Update Server and Install Dependencies

```bash
# Update package lists
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory of both the frontend and backend applications:

#### Backend `.env` file:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://localhost:27017/bridgetunes
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_SERVICE=your_email_service
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=your_email_address
```

#### Frontend `.env` file:

```
REACT_APP_API_URL=https://api.yourdomain.com
```

Replace placeholders with your actual values.

## Backend Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/bridgetunes-admin-backend.git
cd bridgetunes-admin-backend
```

### 2. Install Dependencies and Build

```bash
npm install
npm run build
```

### 3. Configure PM2 for Backend

Create a PM2 ecosystem file:

```bash
touch ecosystem.config.js
```

Add the following content to the file:

```javascript
module.exports = {
  apps: [
    {
      name: "bridgetunes-backend",
      script: "dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

### 4. Start the Backend with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Frontend Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/bridgetunes-admin-frontend.git
cd bridgetunes-admin-frontend
```

### 2. Install Dependencies and Build

```bash
npm install
npm run build
```

### 3. Configure Nginx

Create a new Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/bridgetunes-admin
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        root /path/to/bridgetunes-admin-frontend/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/bridgetunes-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Set Up SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d admin.yourdomain.com
```

Follow the prompts to complete the SSL setup.

## Database Configuration

### 1. Secure MongoDB

```bash
sudo nano /etc/mongod.conf
```

Add or modify the following sections:

```yaml
security:
  authorization: enabled

net:
  bindIp: 127.0.0.1
```

Restart MongoDB:

```bash
sudo systemctl restart mongod
```

### 2. Create Admin User

```bash
mongo
```

In the MongoDB shell:

```javascript
use admin
db.createUser({
  user: "adminUser",
  pwd: "securePassword",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
})
exit
```

### 3. Create Database and User for Bridgetunes

```bash
mongo -u adminUser -p securePassword --authenticationDatabase admin
```

In the MongoDB shell:

```javascript
use bridgetunes
db.createUser({
  user: "bridgetunesUser",
  pwd: "bridgetunesPassword",
  roles: [{ role: "readWrite", db: "bridgetunes" }]
})
exit
```

Update the `.env` file with the new MongoDB URI:

```
MONGO_URI=mongodb://bridgetunesUser:bridgetunesPassword@localhost:27017/bridgetunes
```

## CNAME Configuration

To set up a custom domain with CNAME records:

1. Log in to your domain registrar's DNS management panel
2. Create a new CNAME record:
   - Name/Host: `admin` (for admin.yourdomain.com)
   - Value/Target: Your server's hostname or IP address
   - TTL: 3600 (or as recommended by your registrar)

## Post-Deployment Verification

### 1. Test the Backend API

```bash
curl -X GET https://admin.yourdomain.com/api/health
```

Expected response: `{"status":"success","message":"API is running"}`

### 2. Test the Frontend

Open a web browser and navigate to `https://admin.yourdomain.com`. You should see the login page of the Bridgetunes MTN Admin Portal.

### 3. Monitor Logs

```bash
# Backend logs
pm2 logs bridgetunes-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

## Maintenance Procedures

### Updating the Application

#### Backend Update:

```bash
cd /path/to/bridgetunes-admin-backend
git pull
npm install
npm run build
pm2 restart bridgetunes-backend
```

#### Frontend Update:

```bash
cd /path/to/bridgetunes-admin-frontend
git pull
npm install
npm run build
```

### Database Backup

Set up a daily backup cron job:

```bash
sudo nano /etc/cron.daily/mongodb-backup
```

Add the following content:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="/var/backups/mongodb"
mkdir -p $BACKUP_DIR
mongodump --uri="mongodb://bridgetunesUser:bridgetunesPassword@localhost:27017/bridgetunes" --out="$BACKUP_DIR/bridgetunes-$TIMESTAMP"
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

Make the script executable:

```bash
sudo chmod +x /etc/cron.daily/mongodb-backup
```

## Troubleshooting

### Common Issues and Solutions

1. **Backend service not starting:**
   - Check logs: `pm2 logs bridgetunes-backend`
   - Verify environment variables: `cat .env`
   - Check MongoDB connection: `mongo mongodb://bridgetunesUser:bridgetunesPassword@localhost:27017/bridgetunes`

2. **Frontend not loading:**
   - Check Nginx configuration: `sudo nginx -t`
   - Verify build files: `ls -la /path/to/bridgetunes-admin-frontend/build`
   - Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

3. **Database connection issues:**
   - Check MongoDB status: `sudo systemctl status mongod`
   - Verify network configuration: `cat /etc/mongod.conf`
   - Test connection: `mongo --host localhost --port 27017`

4. **SSL certificate issues:**
   - Renew certificate: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

## Security Considerations

1. **Firewall Configuration:**
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

2. **Regular Updates:**
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

3. **Fail2Ban Installation:**
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

## Contact and Support

For any deployment issues or questions, please contact:
- Technical Support: support@bridgetunes.com
- System Administrator: sysadmin@bridgetunes.com

---

This deployment guide was prepared for Bridgetunes MTN Admin Portal deployment.
Last updated: April 27, 2025
