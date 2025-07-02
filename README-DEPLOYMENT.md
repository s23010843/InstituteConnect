# Excellence Institute - Deployment Guide

This guide covers how to deploy Excellence Institute on various platforms.

## Quick Start (Standard Deployment)

1. **Prerequisites**
   - Node.js 18+ 
   - PostgreSQL database
   - Google OAuth credentials

2. **Setup**
   ```bash
   # Clone and setup
   git clone <your-repo>
   cd excellence-institute
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Edit .env file with your actual values
   cp .env.example .env
   nano .env  # or use your preferred editor
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb excellence_institute

   # Run migrations
   npm run db:push
   ```

5. **Build and Deploy**
   ```bash
   npm run build
   npm start
   ```

## Platform-Specific Deployments

### VPS/Cloud Server (Ubuntu/Debian)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Setup database
sudo -u postgres createuser --interactive
sudo -u postgres createdb excellence_institute

# Clone and setup application
git clone <your-repo>
cd excellence-institute
npm install
npm run build

# Install PM2 for process management
npm install -g pm2
pm2 start "npm start" --name excellence-institute
pm2 startup
pm2 save
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Add these environment variables in Vercel dashboard:
- `DATABASE_URL`
- `VITE_GOOGLE_CLIENT_ID`
- `JWT_SECRET`

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist/public
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### Heroku
```bash
# Install Heroku CLI
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### DigitalOcean App Platform
```yaml
# app.yaml
name: excellence-institute
services:
- name: web
  source_dir: /
  github:
    repo: your-username/excellence-institute
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  - key: VITE_GOOGLE_CLIENT_ID
    value: your_google_client_id
databases:
- engine: PG
  name: db
  num_nodes: 1
  size: db-s-dev-database
```

## Environment Variables Setup

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com

# Security
JWT_SECRET=your_long_secure_jwt_secret
SESSION_SECRET=your_session_secret

# Server
PORT=5000
NODE_ENV=production
```

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy client ID to `VITE_GOOGLE_CLIENT_ID`

## Database Setup Options

### Local PostgreSQL
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb excellence_institute
sudo -u postgres createuser your_username
sudo -u postgres psql -c "ALTER USER your_username WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE excellence_institute TO your_username;"

# Update .env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/excellence_institute
```

### Neon (Serverless PostgreSQL)
1. Create account at neon.tech
2. Create new project
3. Copy connection string to `DATABASE_URL`

### Railway PostgreSQL
```bash
railway add postgresql
# Copy provided DATABASE_URL from dashboard
```

## Nginx Configuration (for VPS)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Troubleshooting

### Build Issues
- Ensure Node.js 18+
- Clear `node_modules`: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run check`

### Database Issues
- Verify `DATABASE_URL` format
- Test connection: `psql $DATABASE_URL`
- Run migrations: `npm run db:push`

### OAuth Issues
- Verify client ID is correct
- Check authorized domains in Google Console
- Ensure HTTPS in production

## Performance Tips

1. **Enable gzip compression** in Nginx or your hosting platform
2. **Use CDN** for static assets
3. **Database connection pooling** (already configured)
4. **Environment-specific builds** (already configured)
5. **Process management** with PM2 for VPS deployments

## Monitoring and Logs

### PM2 Monitoring
```bash
pm2 status
pm2 logs excellence-institute
pm2 monit
```

### Log Rotation
```bash
pm2 install pm2-logrotate
```

The application is designed to work seamlessly across all hosting platforms with minimal configuration changes!