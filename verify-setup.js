const fs = require('fs');
const path = require('path');

console.log('\n🔍 OnCode E-Learning - Setup Verification\n');
console.log('='.repeat(60));

let allGood = true;

// Check 1: Directory Structure
console.log('\n📁 Checking directory structure...');
const requiredDirs = ['backend', 'frontend', 'backend/routes', 'frontend/src'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}/`);
  } else {
    console.log(`  ❌ ${dir}/ - MISSING`);
    allGood = false;
  }
});

// Check 2: Critical Files
console.log('\n📄 Checking critical files...');
const criticalFiles = {
  'package.json': 'Root package.json',
  'backend/package.json': 'Backend package.json',
  'frontend/package.json': 'Frontend package.json',
  'backend/index.js': 'Backend server',
  'frontend/src/App.js': 'Frontend app',
  'backend/vercel.json': 'Backend Vercel config',
  'vercel.json': 'Frontend Vercel config',
  'README.md': 'Documentation'
};

Object.entries(criticalFiles).forEach(([file, description]) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${description}`);
  } else {
    console.log(`  ❌ ${description} - MISSING`);
    allGood = false;
  }
});

// Check 3: Environment Files
console.log('\n🔐 Checking environment configuration...');
const envFiles = {
  'backend/.env.example': 'Backend env template',
  'frontend/.env.example': 'Frontend env template'
};

Object.entries(envFiles).forEach(([file, description]) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${description}`);
  } else {
    console.log(`  ⚠️  ${description} - Missing (recommended)`);
  }
});

// Check 4: Gitignore Files
console.log('\n🚫 Checking .gitignore files...');
const gitignoreFiles = ['.gitignore', 'backend/.gitignore', 'frontend/.gitignore'];
gitignoreFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasServiceKey = content.includes('serviceAccountKey.json');
    const hasEnv = content.includes('.env');
    const hasNodeModules = content.includes('node_modules');
    
    if (hasServiceKey && hasEnv && hasNodeModules) {
      console.log(`  ✅ ${file} - Properly configured`);
    } else {
      console.log(`  ⚠️  ${file} - May need updates`);
      if (!hasServiceKey) console.log(`      Missing: serviceAccountKey.json`);
      if (!hasEnv) console.log(`      Missing: .env`);
      if (!hasNodeModules) console.log(`      Missing: node_modules`);
    }
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check 5: Dependencies
console.log('\n📦 Checking dependencies...');
const packageFiles = ['backend/package.json', 'frontend/package.json'];
packageFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const nodeModulesPath = path.join(path.dirname(filePath), 'node_modules');
    
    if (fs.existsSync(nodeModulesPath)) {
      console.log(`  ✅ ${file.split('/')[0]} - Dependencies installed`);
    } else {
      console.log(`  ⚠️  ${file.split('/')[0]} - Dependencies NOT installed`);
      console.log(`      Run: cd ${file.split('/')[0]} && npm install`);
    }
  }
});

// Check 6: Deployment Guides
console.log('\n📚 Checking deployment guides...');
const guides = {
  'DEPLOY_NOW.md': 'Quick deployment guide',
  'DEPLOYMENT_CHECKLIST.md': 'Detailed deployment checklist',
  'PRE_PUSH_CHECKLIST.md': 'Pre-push checklist'
};

Object.entries(guides).forEach(([file, description]) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${description}`);
  } else {
    console.log(`  ⚠️  ${description} - Missing`);
  }
});

// Check 7: Sensitive Files (should NOT exist in git)
console.log('\n🔒 Checking for sensitive files (should be ignored)...');
const sensitiveFiles = {
  'backend/serviceAccountKey.json': 'Firebase credentials',
  'backend/.env': 'Backend environment',
  'frontend/.env': 'Frontend environment'
};

let hasSensitiveFiles = false;
Object.entries(sensitiveFiles).forEach(([file, description]) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ⚠️  ${description} exists - ENSURE IT'S IN .gitignore`);
    hasSensitiveFiles = true;
  } else {
    console.log(`  ✅ ${description} - Not in project (safe for git)`);
  }
});

// Summary
console.log('\n' + '='.repeat(60));
if (allGood && !hasSensitiveFiles) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('\n🎉 Your project is ready!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm run install:all');
  console.log('  2. Run: npm start');
  console.log('  3. Test locally');
  console.log('  4. Run: npm run test:deploy');
  console.log('  5. Follow: DEPLOY_NOW.md');
} else {
  console.log('⚠️  SOME ISSUES FOUND');
  console.log('\nPlease fix the issues above before deploying.');
  if (hasSensitiveFiles) {
    console.log('\n⚠️  IMPORTANT: Sensitive files detected!');
    console.log('Make sure they are in .gitignore before pushing to GitHub.');
  }
}
console.log('='.repeat(60) + '\n');

process.exit(allGood ? 0 : 1);
