#!/usr/bin/env node

/**
 * Payment System Dependencies Installer
 * This script installs all required dependencies for the PhonePe payment integration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing Payment System Dependencies...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found. Please run this script from your backend directory.');
    process.exit(1);
}

// Required dependencies for payment system
const dependencies = [
    'axios',           // HTTP client for API calls
    'crypto',          // Built-in Node.js crypto module
    'mongoose-paginate-v2' // For pagination in payment history
];

// Check which dependencies are missing
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const existingDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
const missingDeps = dependencies.filter(dep => !existingDeps[dep]);

if (missingDeps.length === 0) {
    console.log('✅ All required dependencies are already installed!');
    process.exit(0);
}

console.log('📦 Installing missing dependencies...');
console.log('Missing:', missingDeps.join(', '));

try {
    // Install missing dependencies
    const installCommand = `npm install ${missingDeps.join(' ')}`;
    console.log(`\n🔧 Running: ${installCommand}`);
    
    execSync(installCommand, { stdio: 'inherit' });
    
    console.log('\n✅ Dependencies installed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your backend server: npm start');
    console.log('2. Test configuration: node test_phonepe_debug_enhanced.js');
    console.log('3. Test PG booking: Open test_pg_booking_payment.html');
    
} catch (error) {
    console.error('\n❌ Error installing dependencies:', error.message);
    console.log('\n💡 Try running manually:');
    console.log(`npm install ${missingDeps.join(' ')}`);
    process.exit(1);
}
