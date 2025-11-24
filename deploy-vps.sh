#!/bin/bash

###############################################################################
# Silverline E-commerce VPS Deployment Script
# For Hostinger VPS (Ubuntu/Debian)
# 
# Usage: bash deploy-vps.sh
###############################################################################

set -e  # Exit on error

echo "======================================"
echo "Silverline VPS Deployment Script"
echo "======================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="silverline"
APP_DIR="/var/www/silverline"
DOMAIN="yourdomain.com"  # Replace with actual domain
NODE_VERSION="20"
GIT_REPO="https://github.com/Pr1ncePS2002/silver.git"
GIT_BRANCH="main"

echo -e "${YELLOW}Step 1: System Update${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${GREEN}✓ System updated${NC}"
echo ""

echo -e "${YELLOW}Step 2: Installing Node.js ${NODE_VERSION}${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}✓ Node.js installed${NC}"
else
    echo -e "${GREEN}✓ Node.js already installed ($(node -v))${NC}"
fi
echo ""

echo -e "${YELLOW}Step 3: Installing pnpm and PM2${NC}"
if ! command -v pnpm &> /dev/null; then
    sudo npm install -g pnpm
    echo -e "${GREEN}✓ pnpm installed${NC}"
else
    echo -e "${GREEN}✓ pnpm already installed${NC}"
fi

if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo -e "${GREEN}✓ PM2 installed${NC}"
else
    echo -e "${GREEN}✓ PM2 already installed${NC}"
fi
echo ""

echo -e "${YELLOW}Step 4: Installing Nginx${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    echo -e "${GREEN}✓ Nginx installed${NC}"
else
    echo -e "${GREEN}✓ Nginx already installed${NC}"
fi
echo ""

echo -e "${YELLOW}Step 5: Creating application directory${NC}"
if [ ! -d "$APP_DIR" ]; then
    sudo mkdir -p $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
    echo -e "${GREEN}✓ Directory created: $APP_DIR${NC}"
else
    echo -e "${GREEN}✓ Directory already exists: $APP_DIR${NC}"
fi
echo ""

echo -e "${YELLOW}Step 6: Cloning repository${NC}"
if [ ! -d "$APP_DIR/.git" ]; then
    git clone -b $GIT_BRANCH $GIT_REPO $APP_DIR
    echo -e "${GREEN}✓ Repository cloned${NC}"
else
    echo -e "${YELLOW}Repository already exists, pulling latest changes...${NC}"
    cd $APP_DIR
    git fetch origin
    git checkout $GIT_BRANCH
    git pull origin $GIT_BRANCH
    echo -e "${GREEN}✓ Repository updated${NC}"
fi
cd $APP_DIR
echo ""

echo -e "${YELLOW}Step 7: Setting up environment variables${NC}"
if [ ! -f "$APP_DIR/.env.production" ]; then
    echo -e "${YELLOW}Please provide the following credentials:${NC}"
    echo ""
    
    read -p "Database URL: " DATABASE_URL
    read -p "NextAuth Secret: " NEXTAUTH_SECRET
    read -p "Razorpay Key ID: " RAZORPAY_KEY_ID
    read -sp "Razorpay Key Secret: " RAZORPAY_KEY_SECRET
    echo ""
    read -p "Razorpay Webhook Secret: " RAZORPAY_WEBHOOK_SECRET
    read -p "Delhivery API Key: " DELHIVERY_API_KEY
    read -p "Delhivery Client Name: " DELHIVERY_CLIENT_NAME
    read -p "Delhivery Pickup Name: " DELHIVERY_PICKUP_NAME
    read -p "Delhivery Pickup Address: " DELHIVERY_PICKUP_ADDRESS
    read -p "Delhivery Pickup City: " DELHIVERY_PICKUP_CITY
    read -p "Delhivery Pickup State: " DELHIVERY_PICKUP_STATE
    read -p "Delhivery Pickup PIN: " DELHIVERY_PICKUP_PIN
    read -p "Delhivery Pickup Phone: " DELHIVERY_PICKUP_PHONE
    read -p "Delhivery Pickup Email: " DELHIVERY_PICKUP_EMAIL
    read -p "Email User: " EMAIL_USER
    read -sp "Email Password: " EMAIL_PASS
    echo ""
    echo ""
    
    cat > $APP_DIR/.env.production << EOF
# Database
DATABASE_URL=${DATABASE_URL}

# NextAuth
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=https://${DOMAIN}
NEXT_PUBLIC_API_URL=https://${DOMAIN}

# Storage - Changed to local for VPS
STORAGE_PROVIDER=local

# Razorpay Configuration
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
RAZORPAY_WEBHOOK_SECRET=${RAZORPAY_WEBHOOK_SECRET}
NEXT_PUBLIC_RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}

# Delhivery Configuration
DELHIVERY_BASE_URL=https://api.delhivery.com
DELHIVERY_API_KEY=${DELHIVERY_API_KEY}
DELHIVERY_CLIENT_NAME=${DELHIVERY_CLIENT_NAME}
USE_DELHIVERY_MOCK=false
DELHIVERY_PICKUP_NAME=${DELHIVERY_PICKUP_NAME}
DELHIVERY_PICKUP_ADDRESS=${DELHIVERY_PICKUP_ADDRESS}
DELHIVERY_PICKUP_CITY=${DELHIVERY_PICKUP_CITY}
DELHIVERY_PICKUP_STATE=${DELHIVERY_PICKUP_STATE}
DELHIVERY_PICKUP_PIN=${DELHIVERY_PICKUP_PIN}
DELHIVERY_PICKUP_COUNTRY=India
DELHIVERY_PICKUP_PHONE=${DELHIVERY_PICKUP_PHONE}
DELHIVERY_PICKUP_EMAIL=${DELHIVERY_PICKUP_EMAIL}

# Email Configuration
EMAIL_USER=${EMAIL_USER}
EMAIL_PASS=${EMAIL_PASS}
EOF
    echo -e "${GREEN}✓ Environment file created with your credentials${NC}"
else
    echo -e "${GREEN}✓ Environment file already exists${NC}"
fi
echo ""

echo -e "${YELLOW}Step 8: Creating uploads directory${NC}"
mkdir -p $APP_DIR/public/uploads
chmod 755 $APP_DIR/public/uploads
echo -e "${GREEN}✓ Uploads directory created${NC}"
echo ""

echo -e "${YELLOW}Step 9: Installing dependencies${NC}"
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 10: Generating Prisma Client${NC}"
pnpm prisma generate
echo -e "${GREEN}✓ Prisma client generated${NC}"
echo ""

echo -e "${YELLOW}Step 11: Running database migrations${NC}"
pnpm prisma migrate deploy
echo -e "${GREEN}✓ Database migrations completed${NC}"
echo ""

echo -e "${YELLOW}Step 12: Building Next.js application${NC}"
pnpm build
echo -e "${GREEN}✓ Application built successfully${NC}"
echo ""

echo -e "${YELLOW}Step 13: Configuring PM2${NC}"
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save
pm2 startup | tail -n 1 | sudo bash
echo -e "${GREEN}✓ PM2 configured and application started${NC}"
echo ""

echo -e "${YELLOW}Step 14: Configuring Nginx${NC}"
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client body size (for file uploads)
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    location /uploads {
        alias $APP_DIR/public/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx configured${NC}"
echo ""

echo -e "${YELLOW}Step 15: Setting up SSL with Let's Encrypt${NC}"
if ! command -v certbot &> /dev/null; then
    sudo apt install -y certbot python3-certbot-nginx
fi

echo -e "${YELLOW}Running certbot for SSL certificate...${NC}"
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email silver.line9250@gmail.com --redirect

echo -e "${GREEN}✓ SSL certificate installed${NC}"
echo ""

echo -e "${YELLOW}Step 16: Setting up cron job for shipment tracking${NC}"
CRON_CMD="0 */3 * * * cd $APP_DIR && /usr/bin/pnpm tsx scripts/track-shipments.ts >> $APP_DIR/logs/cron.log 2>&1"
(crontab -l 2>/dev/null | grep -v "track-shipments.ts"; echo "$CRON_CMD") | crontab -
mkdir -p $APP_DIR/logs
echo -e "${GREEN}✓ Cron job configured (runs every 3 hours)${NC}"
echo ""

echo -e "${YELLOW}Step 17: Setting up firewall${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    echo -e "${GREEN}✓ Firewall configured${NC}"
else
    echo -e "${YELLOW}⚠ UFW not installed, skipping firewall setup${NC}"
fi
echo ""

echo "======================================"
echo -e "${GREEN}✓ DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo "======================================"
echo ""
echo "Application Status:"
pm2 status
echo ""
echo "Next Steps:"
echo "1. Update .env.production with your actual domain"
echo "2. Verify the site is accessible at: https://$DOMAIN"
echo "3. Register Razorpay webhook: https://$DOMAIN/api/webhooks/razorpay"
echo "4. Test a complete order flow"
echo ""
echo "Useful Commands:"
echo "  - View logs: pm2 logs $APP_NAME"
echo "  - Restart app: pm2 restart $APP_NAME"
echo "  - Update app: cd $APP_DIR && git pull && pnpm install && pnpm build && pm2 restart $APP_NAME"
echo "  - View nginx logs: sudo tail -f /var/log/nginx/error.log"
echo ""
echo -e "${YELLOW}⚠ REMEMBER: Update the webhook URL in Razorpay dashboard!${NC}"
echo "======================================"
