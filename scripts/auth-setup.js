#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const authDir = path.join(__dirname, '..', 'playwright', '.auth');
const authFile = path.join(authDir, 'user.json');

function cleanupAuth() {
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
    console.log('🧹 Removed stored authentication state');
  }
  
  if (fs.existsSync(authDir) && fs.readdirSync(authDir).length === 0) {
    fs.rmdirSync(authDir);
    console.log('🧹 Removed empty auth directory');
  }
}

function checkAuth() {
  if (fs.existsSync(authFile)) {
    const stats = fs.statSync(authFile);
    const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
    
    if (ageInHours > 24) {
      console.log('⚠️  Authentication state is older than 24 hours, consider refreshing');
      return false;
    }
    
    console.log('✅ Authentication state exists and is recent');
    return true;
  }
  
  console.log('❌ No authentication state found');
  return false;
}

const command = process.argv[2];

switch (command) {
  case 'cleanup':
    cleanupAuth();
    break;
  case 'check':
    checkAuth();
    break;
  default:
    console.log('Usage: node scripts/auth-setup.js [cleanup|check]');
    console.log('  cleanup - Remove stored authentication state');
    console.log('  check   - Check if authentication state exists and is recent');
    break;
}
