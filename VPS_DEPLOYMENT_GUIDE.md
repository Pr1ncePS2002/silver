# VPS Deployment Guide for Silverline E-commerce

Complete step-by-step guide to deploy the Silverline e-commerce application on Hostinger VPS.

---

## Prerequisites Checklist

Before starting, ensure you have:
- ✅ Hostinger VPS subscription (Ubuntu 20.04/22.04 or Debian 11/12)
- ✅ Domain name registered and ready
- ✅ All credentials ready (see below)
- ✅ SSH client (PuTTY for Windows or terminal for Mac/Linux)

### Required Credentials

Prepare these credentials before deployment (keep them secure):

1. **VPS Access**
   - IP Address (from Hostinger dashboard)
   - SSH Username (usually `root`)
   - SSH Password (from Hostinger panel)

2. **Domain Name**
   - Your domain (e.g., `silverline.com`)

3. **Database Connection**
   - PostgreSQL connection URL (from Neon.tech dashboard)

4. **Razorpay Credentials**
   - Live Key ID
   - Live Key Secret
   - Webhook Secret

5. **Delhivery Credentials**
   - API Key
   - Client Name
   - Complete pickup/warehouse address details

6. **Email Credentials**
   - Gmail address
   - App-specific password

---

## Step-by-Step Deployment

### Step 1: Access Your Hostinger VPS

**1.1. Get VPS Details**
- Login to your Hostinger account
- Navigate to VPS dashboard
- Note down your VPS IP address
- Find SSH credentials (username: `root`, password in panel)

**1.2. Connect via SSH**

**On Windows (PowerShell or CMD):**
```bash
ssh root@your-vps-ip
```

**On Windows (using PuTTY):**
- Download PuTTY from: https://www.putty.org/
- Host Name: `your-vps-ip`
- Port: `22`
- Connection Type: SSH
- Click "Open"
- Login as: `root`
- Enter password when prompted

**On Mac/Linux:**
```bash
ssh root@your-vps-ip
```

Enter password when prompted. You should see a command prompt like: `root@vps-xxxxx:~#`

---

### Step 2: Point Domain to VPS

**2.1. Configure DNS Records**

Go to your domain registrar (GoDaddy, Namecheap, etc.) and update DNS:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | your-vps-ip | 3600 |
| A | www | your-vps-ip | 3600 |

**Example:**
- If VPS IP is `192.168.1.100`
- A record: `@` → `192.168.1.100`
- A record: `www` → `192.168.1.100`

**2.2. Wait for DNS Propagation**
- Usually takes 5-30 minutes
- Test with: `ping yourdomain.com`

---

### Step 3: Download Deployment Script

On your VPS (connected via SSH), run:

```bash
# Download the deployment script from GitHub
wget https://raw.githubusercontent.com/Pr1ncePS2002/silver/main/deploy-vps.sh

# Make it executable
chmod +x deploy-vps.sh
```

---

### Step 4: Configure Domain

Edit the deployment script to add your domain:

```bash
nano deploy-vps.sh
```

Find this line near the top:
```bash
DOMAIN="yourdomain.com"
```

Change it to your actual domain:
```bash
DOMAIN="silverline.com"  # Replace with YOUR domain
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

---

### Step 5: Run Deployment Script

Start the automated deployment:

```bash
bash deploy-vps.sh
```

**The script will prompt you for credentials. Enter them one by one:**

#### 5.1. Database URL
```
Database URL: 
```
Paste your PostgreSQL connection string (from Neon.tech):
```
postgresql://username:password@host:5432/database?sslmode=require
```

#### 5.2. NextAuth Secret
```
NextAuth Secret: 
```
Enter a secure random string (or use existing: `jewelery`)

#### 5.3. Razorpay Credentials
```
Razorpay Key ID: 
```
Enter your Razorpay live key ID (e.g., `rzp_live_xxxxx`)

```
Razorpay Key Secret: 
```
Enter your Razorpay key secret (input will be hidden)

```
Razorpay Webhook Secret: 
```
Enter your webhook secret (you set this yourself)

#### 5.4. Delhivery Credentials
```
Delhivery API Key: 
```
Enter your Delhivery API key

```
Delhivery Client Name: 
```
Enter your client name (e.g., `Your_Business_Name`)

#### 5.5. Pickup Location Details
```
Delhivery Pickup Name: 
```
Your store/warehouse name (e.g., `Silverline Store`)

```
Delhivery Pickup Address: 
```
Complete address (e.g., `A-604 blossom aura near moti canal`)

```
Delhivery Pickup City: 
```
City name (e.g., `nadiad`)

```
Delhivery Pickup State: 
```
State name (e.g., `Gujarat`)

```
Delhivery Pickup PIN: 
```
PIN code (e.g., `387001`)

```
Delhivery Pickup Phone: 
```
10-digit phone number (e.g., `9512765399`)

```
Delhivery Pickup Email: 
```
Email address (e.g., `store@silverline.com`)

#### 5.6. Email Credentials
```
Email User: 
```
Your Gmail address (e.g., `youremail@gmail.com`)

```
Email Password: 
```
Gmail app-specific password (input will be hidden)

**Note:** For Gmail app password:
1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate app-specific password
4. Use that password here

---

### Step 6: Wait for Deployment to Complete

The script will now:
- ✅ Update system packages
- ✅ Install Node.js, pnpm, PM2
- ✅ Install and configure Nginx
- ✅ Clone your application code
- ✅ Create environment file with your credentials
- ✅ Install dependencies
- ✅ Run database migrations
- ✅ Build the application
- ✅ Start application with PM2
- ✅ Configure Nginx reverse proxy
- ✅ Install SSL certificate (Let's Encrypt)
- ✅ Setup firewall rules
- ✅ Configure cron job for shipment tracking

**Total time:** Approximately 10-15 minutes

When you see:
```
======================================
✓ DEPLOYMENT COMPLETED SUCCESSFULLY!
======================================
```

Your application is live!

---

### Step 7: Verify Deployment

**7.1. Check Application Status**
```bash
pm2 status
```
You should see `silverline` status as `online`

**7.2. Test Website Access**

Open your browser and visit:
- `https://yourdomain.com`

You should see the Silverline website homepage!

**7.3. Test Admin Panel**
- URL: `https://yourdomain.com/admin`
- Login with admin credentials

**7.4. Check Logs**
```bash
pm2 logs silverline
```
Press `Ctrl+C` to exit logs

---

### Step 8: Configure Razorpay Webhook

**IMPORTANT:** Update webhook URL in Razorpay dashboard

**8.1. Login to Razorpay**
- Go to: https://dashboard.razorpay.com
- Login with your credentials

**8.2. Navigate to Webhooks**
- Click **Settings** (gear icon)
- Select **Webhooks** from left menu

**8.3. Create New Webhook**
- Click **Create New Webhook** or **+ Add Webhook**

**8.4. Configure Webhook**
```
URL: https://yourdomain.com/api/webhooks/razorpay
Secret: [your-webhook-secret]
Active Events: payment.captured
```

**8.5. Save and Activate**
- Click **Create Webhook**
- Ensure webhook is **Active**

**8.6. Test Webhook (Optional)**
- Click **Test Webhook**
- Should return `200 OK`

---

### Step 9: Setup Delhivery Warehouse

You have two options:

#### Option A: Manual Setup (Recommended)

1. Login to Delhivery: https://direct.delhivery.com
2. Navigate to **Warehouse Management**
3. Click **Add New Warehouse**
4. Enter your pickup location details:
   - Name, Address, City, State, PIN
   - Phone, Email
5. Submit for approval
6. Wait 24-48 hours for approval
7. Once approved, shipments will be created automatically

#### Option B: API Setup (After Wallet Recharge)

1. Login to Delhivery dashboard
2. Recharge wallet with minimum ₹500
3. Run the test script on VPS:
```bash
cd /var/www/silverline
npx tsx test-delhivery-pickup.ts
```
4. If successful, warehouse is registered
5. If error about wallet balance, use Option A

---

### Step 10: Test Complete Order Flow

**10.1. Place Test Order**
1. Visit your website: `https://yourdomain.com`
2. Browse products and add to cart
3. Proceed to checkout
4. Enter test shipping address
5. Complete payment (use Razorpay test mode first)

**10.2. Verify Order Processing**
1. Check if order confirmation email received
2. Login to admin panel
3. Verify order appears in **Orders** section
4. Check if shipment is created (after Delhivery warehouse approval)
5. Verify order status updates

**10.3. Enable Live Payments**
Once testing is successful:
1. Switch Razorpay to live mode (already configured)
2. Test with small real transaction
3. Verify money reflects in Razorpay dashboard

---

## What Happens Automatically?

After successful deployment:

✅ **Payment Capture**
- Customer completes Razorpay payment
- Webhook notifies your application
- Payment marked as captured
- Shipment creation triggered

✅ **Shipment Creation**
- Order details sent to Delhivery
- Waybill (tracking number) generated
- Stored in database
- Customer notified via email

✅ **Shipment Tracking**
- Cron job runs every 3 hours
- Checks shipment status with Delhivery
- Updates order status automatically
- Logs all status changes

✅ **Email Notifications**
- Order confirmation
- Shipment tracking details
- Status updates

---

## Daily Management & Operations

### Application Management

**View Application Status**
```bash
pm2 status
```

**View Live Logs**
```bash
pm2 logs silverline
# Press Ctrl+C to exit
```

**Restart Application**
```bash
pm2 restart silverline
```

**Stop Application**
```bash
pm2 stop silverline
```

**Start Application**
```bash
pm2 start silverline
```

---

### Updating Your Application

When you make code changes and push to GitHub:

**Manual Update Method:**
```bash
# Connect to VPS
ssh root@your-vps-ip

# Navigate to application directory
cd /var/www/silverline

# Pull latest code
git pull origin main

# Install new dependencies (if any)
pnpm install

# Rebuild application
pnpm build

# Restart
pm2 restart silverline

# Verify
pm2 logs silverline
```

**Create Auto-Update Script:**
```bash
# Create update script
nano /var/www/silverline/update.sh
```

Paste this content:
```bash
#!/bin/bash
echo "🔄 Updating Silverline application..."
cd /var/www/silverline
git pull origin main
pnpm install
pnpm prisma generate
pnpm build
pm2 restart silverline
echo "✅ Update completed!"
pm2 logs silverline --lines 50
```

Make it executable:
```bash
chmod +x /var/www/silverline/update.sh
```

Use it whenever you need to update:
```bash
bash /var/www/silverline/update.sh
```

--- Database Management

**Run migrations:**
```bash
cd /var/www/silverline
pnpm prisma migrate deploy
```

**Seed database:**
```bash
cd /var/www/silverline
pnpm prisma db seed
```

**Open Prisma Studio:**
```bash
cd /var/www/silverline
pnpm prisma studio
```

Access at: `http://your-vps-ip:5555`

### Nginx Management

**Check configuration:**
```bash
sudo nginx -t
```

**Reload Nginx:**
```bash
sudo systemctl reload nginx
```

**Restart Nginx:**
```bash
sudo systemctl restart nginx
```

**View error logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**View access logs:**
```bash
sudo tail -f /var/log/nginx/access.log
```

### SSL Certificate Renewal

Certificates auto-renew, but to test renewal:
```bash
sudo certbot renew --dry-run
```

Force renewal:
```bash
sudo certbot renew --force-renewal
```

## File Storage

Files are stored locally in: `/var/www/silverline/public/uploads/`

**Backup uploads:**
```bash
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /var/www/silverline/public/uploads/
```

**Restore uploads:**
```bash
tar -xzf uploads-backup-20250124.tar.gz -C /
```

## Monitoring & Logs

### Application Logs
```bash
pm2 logs silverline --lines 200
```

### Cron Job Logs (Shipment Tracking)
```bash
tail -f /var/www/silverline/logs/cron.log
```

### System Logs
```bash
# Nginx access
sudo tail -f /var/log/nginx/access.log

# Nginx errors
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## Backup Strategy

### 1. Database Backup

Create backup script:
```bash
nano /root/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Backup using Prisma
cd /var/www/silverline
pnpm prisma db pull > $BACKUP_DIR/schema-$DATE.prisma

echo "✓ Database schema backed up to $BACKUP_DIR/schema-$DATE.prisma"
```

### 2. Full Application Backup

```bash
tar -czf /root/backups/silverline-full-$(date +%Y%m%d).tar.gz \
  /var/www/silverline \
  --exclude=/var/www/silverline/node_modules \
  --exclude=/var/www/silverline/.next
```

### 3. Automated Backups (Cron)

```bash
crontab -e
```

Add:
```cron
# Daily database backup at 2 AM
0 2 * * * /root/backup-db.sh >> /root/backups/backup.log 2>&1

# Weekly full backup at 3 AM on Sunday
0 3 * * 0 tar -czf /root/backups/silverline-$(date +\%Y\%m\%d).tar.gz /var/www/silverline --exclude=node_modules --exclude=.next
```

## Troubleshooting

### Application won't start

**Check PM2 logs:**
```bash
pm2 logs silverline --err
```

**Check Node.js version:**
```bash
node -v  # Should be v18 or higher
```

**Rebuild:**
```bash
cd /var/www/silverline
rm -rf .next node_modules
pnpm install
pnpm build
pm2 restart silverline
```

### 502 Bad Gateway

**Check if app is running:**
```bash
pm2 status
curl http://localhost:3000
```

**Check Nginx config:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Database connection issues

**Test connection:**
```bash
cd /var/www/silverline
pnpm prisma db pull
```

**Check environment variables:**
```bash
cat /var/www/silverline/.env.production | grep DATABASE_URL
```

### SSL issues

**Check certificate status:**
```bash
sudo certbot certificates
```

**Renew if needed:**
```bash
sudo certbot renew
```

### Port already in use

**Find process:**
```bash
sudo lsof -i :3000
```

**Kill process:**
```bash
pm2 delete all
pm2 start silverline
```

## Security Best Practices

1. **Firewall configured** (ports 22, 80, 443 only)
2. **SSL enabled** with auto-renewal
3. **Security headers** added in Nginx
4. **Environment variables** in separate file (not committed to git)
5. **Database** uses connection pooling with SSL

### Additional Security Steps

**Change SSH port:**
```bash
sudo nano /etc/ssh/sshd_config
# Change Port 22 to Port 2222
sudo systemctl restart sshd
```

**Setup fail2ban:**
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

**Regular updates:**
```bash
sudo apt update && sudo apt upgrade -y
```

## Performance Optimization

### 1. Enable PM2 Cluster Mode

```bash
pm2 delete silverline
pm2 start npm --name silverline -i max -- start
pm2 save
```

### 2. Nginx Caching

Already configured in deployment script:
- Static files cached for 60 minutes
- `_next/static` cached with immutable flag
- Upload files cached for 1 year

### 3. Database Connection Pooling

Already configured in `DATABASE_URL` with connection pooling

## Support & Maintenance

**Contact:**
- Developer: silver.line9250@gmail.com
- Repository: https://github.com/Pr1ncePS2002/silver

**Important URLs:**
- Production: https://yourdomain.com
- Admin Panel: https://yourdomain.com/admin
- Razorpay Dashboard: https://dashboard.razorpay.com
- Delhivery Dashboard: https://direct.delhivery.com

---

**Deployment completed!** Your Silverline e-commerce application is now running on Hostinger VPS.
