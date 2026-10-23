const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('----------------------------------------------------');
console.log('  🚀 Starting TripEasy (Backend & Frontend)...     ');
console.log('----------------------------------------------------\n');

// 1. Backend Server (Express on port 5000)
console.log('📦 Starting Backend Server (port 5000)...');
const server = spawn(npmCmd, ['start'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

// 2. Frontend Client (React on port 3000)
console.log('🌐 Starting Frontend Client (port 3000)...');
const client = spawn(npmCmd, ['start'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BROWSER: 'none' }
});

function handleExit() {
  console.log('\n🛑 Stopping servers...');
  if (isWindows) {
    if (server.pid) spawn('taskkill', ['/pid', String(server.pid), '/f', '/t']);
    if (client.pid) spawn('taskkill', ['/pid', String(client.pid), '/f', '/t']);
  } else {
    server.kill();
    client.kill();
  }
  process.exit();
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
