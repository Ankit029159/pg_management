const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting PG Management Backend in Production Mode...');
console.log('📍 Frontend URL: https://pg.gradezy.in');
console.log('📍 Backend URL: https://api.pg.gradezy.in');
console.log('📍 Environment: Production');

// Start the server
const server = spawn('node', ['index.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || 5001
  }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`\n🔄 Server process exited with code ${code}`);
  if (code !== 0) {
    console.log('⚠️  Server crashed, restarting in 5 seconds...');
    setTimeout(() => {
      console.log('🔄 Restarting server...');
      require('./index.js');
    }, 5000);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});
