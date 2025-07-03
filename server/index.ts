import express from 'express';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import apiRouter from './routes';
import { createServer } from './vite';

const app = express();
const SERVER_PORT = process.env.PORT || 8080;

// Configure CORS
const corsOptions: CorsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.PRODUCTION_DOMAIN || 'https://example.com',
        'https://instituteconnect.up.railway.app',
        // Add your actual domain here
        'https://your-actual-domain.com'
      ] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRouter);

// Start the server
async function startExcellenceInstituteServer() {
  try {
    console.log('🚀 Starting Excellence Institute server...');

    const server = await createServer(app);

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${SERVER_PORT} is already in use. Please stop other processes or use a different port.`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    server.listen(Number(SERVER_PORT), host, () => {
      console.log(`✅ Excellence Institute server running on http://${host}:${SERVER_PORT}`);
      console.log(`📚 API endpoints available at http://${host}:${SERVER_PORT}/api`);
      console.log(`🌐 Frontend available at http://${host}:${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start Excellence Institute server:', error);
    process.exit(1);
  }
}

startExcellenceInstituteServer();