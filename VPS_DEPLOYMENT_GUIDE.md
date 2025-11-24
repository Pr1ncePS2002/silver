# VPS Deployment Guide for Silverline E-commerce

## Prerequisites
- Hostinger VPS with Ubuntu 20.04/22.04 or Debian 11/12
- Domain name pointed to VPS IP address
- SSH access to VPS
- Git repository access

## Quick Start

### 1. Upload Deployment Script

Upload `deploy-vps.sh` to your VPS:

```bash
# From your local machine
scp deploy-vps.sh root@your-vps-ip:/root/
```

Or create it directly on VPS:
```bash
ssh root@your-vps-ip
nano deploy-vps.sh
# Paste the script content and save (Ctrl+X, Y, Enter)
```

### 2. Update Domain Configuration

Edit the script before running:
```bash
nano deploy-vps.sh
```

Change line:
```bash
DOMAIN="yourdomain.com"  # Replace with your actual domain
```

### 3. Make Script Executable

```bash
chmod +x deploy-vps.sh
```

### 4. Run Deployment

```bash
bash deploy-vps.sh
```

The script will automatically:
- ✅ Install Node.js, pnpm, PM2, Nginx
- ✅ Clone your repository
- ✅ Setup environment variables
- ✅ Build the application
- ✅ Configure process manager (PM2)
- ✅ Setup Nginx reverse proxy
- ✅ Install SSL certificate (Let's Encrypt)
- ✅ Configure firewall
- ✅ Setup cron job for shipment tracking

## Post-Deployment Steps

### 1. Update Environment Variables

Edit production environment file:
```bash
nano /var/www/silverline/.env.production
```

**Critical updates needed:**
```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

Restart after changes:
```bash
pm2 restart silverline
```

### 2. Register Razorpay Webhook

1. Login to Razorpay Dashboard: https://dashboard.razorpay.com/
2. Navigate to: Settings → Webhooks
3. Add new webhook:
   - **URL**: `https://yourdomain.com/api/webhooks/razorpay`
   - **Secret**: `dhruvkabra1442`
   - **Events**: Select `payment.captured`
4. Save and activate

### 3. Verify Deployment

Check application status:
```bash
pm2 status
pm2 logs silverline
```

Test the website:
```bash
curl https://yourdomain.com
```

Visit in browser: `https://yourdomain.com`

### 4. Delhivery Warehouse Setup

**Option A: Manual (Recommended)**
1. Login to Delhivery dashboard: https://direct.delhivery.com
2. Add warehouse manually with pickup address from `.env`

**Option B: API (After wallet recharge)**
- Recharge Delhivery wallet with minimum ₹500
- Warehouse registration will work automatically via API

## Management Commands

### Application Management

**View logs:**
```bash
pm2 logs silverline
pm2 logs silverline --lines 100
```

**Restart application:**
```bash
pm2 restart silverline
```

**Stop application:**
```bash
pm2 stop silverline
```

**Start application:**
```bash
pm2 start silverline
```

**View process status:**
```bash
pm2 status
```

### Update Application

When you push new code:

```bash
cd /var/www/silverline
git pull origin main
pnpm install
pnpm prisma generate
pnpm build
pm2 restart silverline
```

Or create update script:
```bash
nano /var/www/silverline/update.sh
```

```bash
#!/bin/bash
cd /var/www/silverline
git pull origin main
pnpm install
pnpm prisma generate
pnpm build
pm2 restart silverline
echo "✓ Application updated successfully!"
```

```bash
chmod +x /var/www/silverline/update.sh
# Run when needed:
bash /var/www/silverline/update.sh
```

### Database Management

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
