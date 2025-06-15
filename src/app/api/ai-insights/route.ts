import { NextResponse } from 'next/server';
import { mockDashboardData } from '@/data/mockData';
import { MonthlyMetrics } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { metrics } = body;
    
    // In a real implementation, this would use OpenAI API
    // For now, we'll generate insights based on the data patterns
    
    const insights = generateInsights(metrics || mockDashboardData.monthlyMetrics);
    
    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
  }
  
  function generateInsights(metrics: MonthlyMetrics[]) {
  const insights = [];
  
  if (metrics.length >= 2) {
    const current = metrics[metrics.length - 1];
    const previous = metrics[metrics.length - 2];
    
    // Revenue trend analysis
    const revenueGrowth = ((current.newCashCollected.total - previous.newCashCollected.total) / previous.newCashCollected.total) * 100;
    
    if (revenueGrowth > 20) {
      insights.push({
        type: 'trend',
        title: 'Strong Revenue Growth',
        description: `Revenue increased by ${revenueGrowth.toFixed(1)}% this month. Excellent momentum!`,
        impact: 'high',
        action: 'Scale successful strategies and maintain current content production pace'
      });
    } else if (revenueGrowth < -10) {
      insights.push({
        type: 'alert',
        title: 'Revenue Decline Alert',
        description: `Revenue decreased by ${Math.abs(revenueGrowth).toFixed(1)}% this month.`,
        impact: 'high',
        action: 'Review recent changes in marketing strategy and video content themes'
      });
    }
    
    // Conversion rate analysis
    if (current.conversionRates.acceptedToSale < 25) {
      insights.push({
        type: 'recommendation',
        title: 'Improve Sales Conversion',
        description: `Call-to-sale conversion is ${current.conversionRates.acceptedToSale.toFixed(1)}%, below optimal range.`,
        impact: 'medium',
        action: 'Review sales scripts and provide additional training for closing techniques'
      });
    }
    
    // Show-up rate insights
    if (current.showUpRate < 80) {
      insights.push({
        type: 'alert',
        title: 'Low Call Show-up Rate',
        description: `Show-up rate is ${current.showUpRate.toFixed(1)}%, which may indicate lead quality issues.`,
        impact: 'high',
        action: 'Implement better pre-call qualification and reminder sequences'
      });
    }
  }
  
  return insights;
} 