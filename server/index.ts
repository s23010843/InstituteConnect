import express from 'express';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import apiRouter from './routes';
import { createServer } from './vite';

const app = express();
const SERVER_PORT = process.env.PORT || 5000;

// Configure CORS
const corsOptions: CorsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.PRODUCTION_DOMAIN || 'https://example.com'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
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

    server.listen(SERVER_PORT, 'localhost', () => {
      console.log(`✅ Excellence Institute server running on http://localhost:${SERVER_PORT}`);
      console.log(`📚 API endpoints available at http://localhost:${SERVER_PORT}/api`);
      console.log(`🌐 Frontend available at http://localhost:${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start Excellence Institute server:', error);
    process.exit(1);
  }
}

startExcellenceInstituteServer();