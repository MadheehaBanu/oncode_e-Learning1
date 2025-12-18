const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const startProject = async () => {
  console.log('🚀 OnCode E-Learning Platform - Full Stack Startup');
  console.log('==================================================\n');
  
  // Check if we're in the right directory
  const backendPath = path.join(__dirname, 'backend');
  const frontendPath = path.join(__dirname, 'frontend');
  
  if (!fs.existsSync(backendPath) || !fs.existsSync(frontendPath)) {
    console.error('❌ Backend or Frontend directory not found!');
    console.log('Make sure you\'re running this from the project root directory.');
    process.exit(1);
  }
  
  console.log('📁 Project structure verified');
  console.log(`   Backend: ${backendPath}`);
  console.log(`   Frontend: ${frontendPath}\n`);
  
  // Start backend server
  console.log('🔧 Starting backend server...');
  const backendProcess = spawn('npm', ['run', 'dev'], {
    cwd: backendPath,
    stdio: 'inherit',
    shell: true
  });
  
  // Wait a bit for backend to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Start frontend server
  console.log('\n🎨 Starting frontend server...');
  const frontendProcess = spawn('npm', ['start'], {
    cwd: frontendPath,
    stdio: 'inherit',
    shell: true
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backendProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  });
  
  console.log('\n✅ Both servers are starting up!');
  console.log('📊 Backend will be available at: http://localhost:5000');
  console.log('🌐 Frontend will be available at: http://localhost:3000');
  console.log('\n💡 Press Ctrl+C to stop both servers');
};

startProject().catch(error => {
  console.error('❌ Failed to start project:', error);
  process.exit(1);
});