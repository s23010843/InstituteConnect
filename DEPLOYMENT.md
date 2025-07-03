# 🚀 Deployment Guide for InstituteConnect

## Pre-Deployment Checklist

### 1. Environment Variables
Update these environment variables for production:

```bash
# Required - Update with your actual domain
PRODUCTION_DOMAIN=https://yourdomain.com

# Required - Your production database URL
DATABASE_URL=postgresql://user:password@host:port/database

# Required - Generate secure secrets (64+ characters)
JWT_SECRET=your_super_secure_jwt_secret_64_chars_minimum
SESSION_SECRET=your_super_secure_session_secret_64_chars_minimum

# Required - Your production Google OAuth credentials
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Optional - Production email configuration
SMTP_USER=your_production_email@domain.com
SMTP_PASSWORD=your_app_password
```

### 2. CORS Configuration
In `server/index.ts`, update the CORS origins with your actual domain:

```typescript
origin: process.env.NODE_ENV === 'production' 
  ? [
      process.env.PRODUCTION_DOMAIN,
      'https://youractualdomai.com', // Add your domain here
    ] 
```

## Deployment Platforms

### Railway.app
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Docker Deployment
```bash
# Build Docker image
docker build -t instituteconnect .

# Run container
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e PRODUCTION_DOMAIN=https://yourdomain.com \
  -e DATABASE_URL=your_db_url \
  instituteconnect
```

### Manual VPS Deployment
1. Install Node.js 18+
2. Clone repository
3. Install dependencies: `npm ci`
4. Build application: `npm run build:prod`
5. Start with PM2: `pm2 start npm --name "instituteconnect" -- start`

## Post-Deployment

### 1. Test Endpoints
- Health check: `https://yourdomain.com/api/health`
- Frontend: `https://yourdomain.com`

### 2. Common Issues
- **CORS errors**: Update PRODUCTION_DOMAIN environment variable
- **Database connection**: Verify DATABASE_URL
- **Build failures**: Check all dependencies are installed

### 3. Monitoring
Set up monitoring for:
- Server uptime
- Database connections
- API response times
- Error logs
