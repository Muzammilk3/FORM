const fs = require('fs');
const path = require('path');

// Check if index.html exists
const indexPath = path.join(__dirname, 'public', 'index.html');
if (fs.existsSync(indexPath)) {
  console.log('✅ index.html found at:', indexPath);
} else {
  console.log('❌ index.html not found at:', indexPath);
  console.log('Current directory:', __dirname);
  console.log('Public directory contents:', fs.readdirSync('public'));
}

// Run the actual build
const { execSync } = require('child_process');
try {
  execSync('npx react-scripts build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
