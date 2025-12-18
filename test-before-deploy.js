const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🧪 Pre-Deployment Test Suite');
console.log('=' .repeat(50));

const tests = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Test 1: Check sensitive files are not in git
console.log('\n📁 Test 1: Checking for sensitive files...');
const sensitiveFiles = [
  'backend/serviceAccountKey.json',
  'backend/.env',
  'frontend/.env'
];

sensitiveFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  WARNING: ${file} exists - make sure it's in .gitignore`);
    tests.warnings++;
  } else {
    console.log(`✅ ${file} not found (good for git)`);
  }
});

// Test 2: Check .gitignore exists
console.log('\n📝 Test 2: Checking .gitignore files...');
const gitignoreFiles = [
  '.gitignore',
  'backend/.gitignore',
  'frontend/.gitignore'
];

gitignoreFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    tests.passed++;
  } else {
    console.log(`❌ ${file} missing`);
    tests.failed++;
  }
});

// Test 3: Check package.json files
console.log('\n📦 Test 3: Checking package.json files...');
const packageFiles = [
  'package.json',
  'backend/package.json',
  'frontend/package.json'
];

packageFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`✅ ${file} is valid JSON`);
      tests.passed++;
    } catch (error) {
      console.log(`❌ ${file} has invalid JSON`);
      tests.failed++;
    }
  } else {
    console.log(`❌ ${file} missing`);
    tests.failed++;
  }
});

// Test 4: Check vercel.json files
console.log('\n🚀 Test 4: Checking Vercel configuration...');
const vercelFiles = [
  'vercel.json',
  'backend/vercel.json'
];

vercelFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`✅ ${file} is valid`);
      tests.passed++;
    } catch (error) {
      console.log(`❌ ${file} has invalid JSON`);
      tests.failed++;
    }
  } else {
    console.log(`⚠️  ${file} missing`);
    tests.warnings++;
  }
});

// Test 5: Check environment templates
console.log('\n🔐 Test 5: Checking environment templates...');
const envTemplates = [
  'backend/.env.example',
  'frontend/.env.example'
];

envTemplates.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    tests.passed++;
  } else {
    console.log(`⚠️  ${file} missing (recommended)`);
    tests.warnings++;
  }
});

// Test 6: Check critical files
console.log('\n📄 Test 6: Checking critical files...');
const criticalFiles = [
  'README.md',
  'backend/index.js',
  'frontend/src/App.js',
  'frontend/public/index.html'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    tests.passed++;
  } else {
    console.log(`❌ ${file} missing`);
    tests.failed++;
  }
});

// Test 7: Check for common issues in code
console.log('\n🔍 Test 7: Checking for common issues...');
const backendIndex = path.join(__dirname, 'backend/index.js');
if (fs.existsSync(backendIndex)) {
  const content = fs.readFileSync(backendIndex, 'utf8');
  
  if (content.includes('cors')) {
    console.log('✅ CORS configured');
    tests.passed++;
  } else {
    console.log('❌ CORS not configured');
    tests.failed++;
  }
  
  if (content.includes('process.env')) {
    console.log('✅ Environment variables used');
    tests.passed++;
  } else {
    console.log('⚠️  No environment variables detected');
    tests.warnings++;
  }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Test Summary:');
console.log(`✅ Passed: ${tests.passed}`);
console.log(`❌ Failed: ${tests.failed}`);
console.log(`⚠️  Warnings: ${tests.warnings}`);
console.log('='.repeat(50));

if (tests.failed === 0) {
  console.log('\n🎉 All critical tests passed!');
  console.log('✅ Project is ready for deployment');
  console.log('\nNext steps:');
  console.log('1. Review PRE_PUSH_CHECKLIST.md');
  console.log('2. Push to GitHub');
  console.log('3. Follow DEPLOYMENT_CHECKLIST.md');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues before deploying.');
  process.exit(1);
}
