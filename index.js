
const { spawn } = require('child_process');

console.log('🚀 Starting development servers...');

// Start backend server
const backend = spawn('npx', ['tsx', 'server/simpleServer.ts'], {
  cwd: process.cwd(),
  stdio: ['inherit', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'development' }
});

backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data}`);
});

// Start frontend server after a delay
setTimeout(() => {
  const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
    cwd: process.cwd(),
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env }
  });

  frontend.stdout.on('data', (data) => {
    console.log(`[Frontend] ${data}`);
  });

  frontend.stderr.on('data', (data) => {
    console.error(`[Frontend Error] ${data}`);
  });

  frontend.on('close', (code) => {
    console.log(`Frontend process exited with code ${code}`);
  });
}, 3000);

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill('SIGINT');
  process.exit(0);
});

console.log('✨ Both servers are starting...');
console.log('📍 Frontend will be available at: http://localhost:5173');
console.log('📍 Backend API available at: http://localhost:3000');
