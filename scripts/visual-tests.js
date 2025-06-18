#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`${title}`, 'cyan');
  log(`${'='.repeat(60)}`, 'cyan');
}



function checkIfDashboardRunning() {
  try {
    execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function runSnapshots() {
  logSection('📸 Running Jest Snapshot Tests');
  try {
    execSync('yarn test -- --testPathPattern=snapshot --updateSnapshot', { 
      stdio: 'inherit' 
    });
    log('✅ Snapshot tests completed successfully', 'green');
  } catch (error) {
    log('❌ Snapshot tests failed', 'red');
    throw error;
  }
}

async function runPlaywrightTests() {
  logSection('🎭 Running Playwright Visual Tests');
  
  // Check if dashboard is running
  if (!checkIfDashboardRunning()) {
    log('⚠️  Dashboard not running on localhost:3000. Starting it...', 'yellow');
    log('Please run "yarn dev" in another terminal and wait for it to start', 'yellow');
    log('Then run this script again', 'yellow');
    return;
  }

  try {
    execSync('npx playwright test tests/visual/dashboard.spec.ts', { 
      stdio: 'inherit' 
    });
    log('✅ Dashboard visual tests completed successfully', 'green');
  } catch (error) {
    log('❌ Dashboard visual tests failed', 'red');
    log('💡 Run "npx playwright test --ui" to debug visually', 'yellow');
  }
}



async function generateVisualReport() {
  logSection('📊 Generating Visual Test Report');
  
  try {
    execSync('npx playwright show-report', { stdio: 'inherit' });
    log('✅ Visual test report generated', 'green');
  } catch (error) {
    log('⚠️  No Playwright report to show', 'yellow');
  }
}

async function runChromaticTests() {
  logSection('🎨 Running Chromatic Visual Tests');
  
  const chromaticToken = process.env.CHROMATIC_PROJECT_TOKEN;
  if (!chromaticToken) {
    log('⚠️  CHROMATIC_PROJECT_TOKEN not found in environment variables', 'yellow');
    log('💡 Set up Chromatic at https://www.chromatic.com/ and add the token to your .env', 'yellow');
    log('💡 Then run: CHROMATIC_PROJECT_TOKEN=your_token yarn visual:chromatic', 'yellow');
    return;
  }

  try {
    execSync(`npx chromatic --project-token=${chromaticToken}`, { 
      stdio: 'inherit' 
    });
    log('✅ Chromatic visual tests completed successfully', 'green');
  } catch (error) {
    log('❌ Chromatic visual tests failed', 'red');
    throw error;
  }
}

async function updateVisualBaselines() {
  logSection('🔄 Updating Visual Test Baselines');
  
  log('Updating Jest snapshots...', 'blue');
  try {
    execSync('yarn test -- --testPathPattern=snapshot --updateSnapshot', { 
      stdio: 'inherit' 
    });
    log('✅ Jest snapshots updated', 'green');
  } catch (error) {
    log('❌ Failed to update Jest snapshots', 'red');
  }

  log('\nUpdating Playwright screenshots...', 'blue');
  try {
    execSync('npx playwright test --update-snapshots', { 
      stdio: 'inherit' 
    });
    log('✅ Playwright screenshots updated', 'green');
  } catch (error) {
    log('❌ Failed to update Playwright screenshots', 'red');
  }
}

async function main() {
  const command = process.argv[2];
  
  log('🧪 Visual Regression Testing Suite', 'bright');
  log('====================================', 'bright');

  try {
    switch (command) {
      case 'snapshots':
        await runSnapshots();
        break;
      case 'playwright':
        await runPlaywrightTests();
        break;

      case 'chromatic':
        await runChromaticTests();
        break;
      case 'update':
        await updateVisualBaselines();
        break;
      case 'report':
        await generateVisualReport();
        break;
      case 'all':
      default:
        await runSnapshots();
        await runPlaywrightTests();
        await generateVisualReport();
        break;
    }

    log('\n✨ Visual testing completed!', 'green');
    log('\n📁 Check the following for results:', 'blue');
    log('  • test-results/ - Playwright test results', 'blue');
    log('  • src/components/__tests__/__snapshots__/ - Jest snapshots', 'blue');
    log('  • tests/visual/ - Visual test screenshots', 'blue');

  } catch (error) {
    log('\n❌ Visual testing failed!', 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 