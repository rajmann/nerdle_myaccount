#!/usr/bin/env node

// Set environment variables
process.env.PORT = process.env.PORT || '5000';
process.env.NODE_ENV = 'development';

// Start the React development server
const { spawn } = require('child_process');

const child = spawn('npm', ['start'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});

child.on('error', (error) => {
  console.error(`Error starting React app: ${error.message}`);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code);
});