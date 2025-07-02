
# Excellence Institute - Deployment Guide

This guide covers how to deploy Excellence Institute on various platforms.

## Quick Start (Any Platform)

1. **Prerequisites**
   - Node.js 18+ 
   - PostgreSQL database
   - Google OAuth credentials

2. **Setup**
   ```bash
   # Clone and setup
   git clone <your-repo>
   cd excellence-institute
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure Environment**
   ```bash
   # Copy and edit environment variables
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Deploy**
   ```bash
   npm run build
   npm start
   ```

## Platform-Specific Deployments

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/public
```

### Railway
```bash
npm install -g @railway/cli
railway login
railway deploy
```

### Heroku
```bash
# Install Heroku CLI, then:
heroku create your-app-name
git push heroku main
```

### VPS/Cloud Server
```bash
# On your server:
git clone <your-repo>
cd excellence-institute
./scripts/setup.sh
pm2 start "npm start" --name excellence-institute
```

### Docker
```bash
# Build and run with Docker
docker-compose up -d
```

## Environment Variables

Required for all deployments:
- `DATABASE_URL` - PostgreSQL connection string
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

Optional:
- `PORT` - Server port (default: 5000)
- `HOST` - Server host (default: 0.0.0.0)
- `NODE_ENV` - Environment (development/production)

## Database Setup

### Neon (Recommended)
1. Create account at neon.tech
2. Create new project
3. Copy connection string to `DATABASE_URL`

### Local PostgreSQL
```bash
# Install PostgreSQL, then:
createdb excellence_institute
export DATABASE_URL="postgresql://user:pass@localhost:5432/excellence_institute"
```

### Railway PostgreSQL
```bash
railway add postgresql
# Copy provided DATABASE_URL
```

## OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy client ID to `VITE_GOOGLE_CLIENT_ID`

## Troubleshooting

### Build Issues
- Ensure Node.js 18+
- Clear `node_modules` and reinstall
- Check TypeScript errors: `npm run check`

### Database Issues
- Verify `DATABASE_URL` format
- Check database connectivity
- Run migrations: `npm run db:push`

### OAuth Issues
- Verify client ID is correct
- Check authorized domains in Google Console
- Ensure HTTPS in production

## Performance Tips

1. **Enable gzip compression** (most platforms do this automatically)
2. **Use CDN** for static assets
3. **Database connection pooling** (already configured)
4. **Environment-specific builds** (already configured)

The app is designed to work seamlessly across all hosting platforms!
