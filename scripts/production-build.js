#!/usr/bin/env node

/**
 * Production build script for the dashboard
 * Handles environment setup, build optimization, and deployment preparation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production build process...');

// Environment check
const requiredEnvVars = [
  'YOUTUBE_API_KEY',
  'OPENAI_API_KEY', 
  'KAJABI_API_KEY',
  'CALCOM_API_KEY'
];

console.log('🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('⚠️  Missing environment variables:', missingVars.join(', '));
  console.warn('The app will use mock data for missing API integrations.');
} else {
  console.log('✅ All required environment variables are set.');
}

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('yarn install --frozen-lockfile', { stdio: 'inherit' });

  // Run type checking
  console.log('🔍 Running type checks...');
  execSync('yarn tsc --noEmit', { stdio: 'inherit' });

  // Run linting
  console.log('🔍 Running linter...');
  execSync('yarn lint', { stdio: 'inherit' });

  // Run tests
  console.log('🧪 Running tests...');
  execSync('yarn test --passWithNoTests', { stdio: 'inherit' });

  // Build the application
  console.log('🏗️  Building Next.js application...');
  execSync('yarn build', { stdio: 'inherit' });

  // Generate build info
  const buildInfo = {
    buildTime: new Date().toISOString(),
    version: require('../package.json').version,
    nodeVersion: process.version,
    environment: 'production',
    hasApiKeys: {
      youtube: !!process.env.YOUTUBE_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      kajabi: !!process.env.KAJABI_API_KEY,
      calcom: !!process.env.CALCOM_API_KEY,
    }
  };

  fs.writeFileSync(
    path.join(__dirname, '../public/build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );

  console.log('✅ Production build completed successfully!');
  console.log('📊 Build info saved to public/build-info.json');

} catch (error) {
  console.error('❌ Production build failed:', error.message);
  process.exit(1);
} 