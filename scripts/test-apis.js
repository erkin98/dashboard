#!/usr/bin/env node

/**
 * Test script for API clients
 * Run with: node scripts/test-apis.js
 */

// Simulate environment for testing
process.env.NODE_ENV = 'development';

async function testAPIClients() {
  console.log('🧪 Testing API Clients...\n');
  
  try {
    // Test dashboard API endpoint
    console.log('📊 Testing Dashboard API...');
    const response = await fetch('http://localhost:3000/api/dashboard');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Dashboard API working');
      console.log(`📈 Data points: ${data.monthlyMetrics?.length || 0} months`);
      console.log(`🎥 Videos: ${data.videos?.length || 0}`);
      console.log(`📧 Email campaigns: ${data.emailCampaigns?.length || 0}`);
      console.log(`🔔 Alerts: ${data.realTimeAlerts?.length || 0}`);
      
      if (data.apiStatus) {
        console.log('\n🔌 API Status:');
        Object.entries(data.apiStatus).forEach(([service, status]) => {
          const icon = status === 'connected' ? '🟢' : status === 'mock' ? '🟡' : '🔴';
          console.log(`  ${icon} ${service.charAt(0).toUpperCase() + service.slice(1)}: ${status}`);
        });
      }
      
      if (data.lastUpdated) {
        console.log(`\n⏰ Last updated: ${new Date(data.lastUpdated).toLocaleString()}`);
      }
    } else {
      console.error('❌ Dashboard API failed:', response.status);
    }
    
    // Test AI insights API
    console.log('\n🤖 Testing AI Insights API...');
    const aiResponse = await fetch('http://localhost:3000/api/ai-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        monthlyMetrics: [
          { month: '2024-10', newCashCollected: { total: 50000 }, showUpRate: 75, conversionRates: { acceptedToSale: 25 } },
          { month: '2024-11', newCashCollected: { total: 60000 }, showUpRate: 80, conversionRates: { acceptedToSale: 30 } }
        ]
      })
    });
    
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      console.log('✅ AI Insights API working');
      console.log(`💡 Generated insights: ${aiData.insights?.length || 0}`);
      
      if (aiData.insights && aiData.insights.length > 0) {
        console.log('\n🔍 Sample insight:');
        const sample = aiData.insights[0];
        console.log(`  📋 ${sample.title}`);
        console.log(`  📝 ${sample.description}`);
        console.log(`  ⚡ Impact: ${sample.impact}`);
      }
    } else {
      console.error('❌ AI Insights API failed:', aiResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the development server is running with: npm run dev');
  }
}

// Show environment status
console.log('🌍 Environment Check:');
console.log(`  📂 Node.js: ${process.version}`);
console.log(`  🔧 NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  🔑 API Keys:`);
console.log(`    🎥 YouTube: ${process.env.YOUTUBE_API_KEY ? '✅ Set' : '❌ Not set (will use mock data)'}`);
console.log(`    💰 Kajabi: ${process.env.KAJABI_API_KEY ? '✅ Set' : '❌ Not set (will use mock data)'}`);
console.log(`    📅 Cal.com: ${process.env.CALCOM_API_KEY ? '✅ Set' : '❌ Not set (will use mock data)'}`);
console.log(`    🤖 OpenAI: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set (will use rule-based insights)'}`);
console.log('');

testAPIClients().catch(console.error); 