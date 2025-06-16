import { NextResponse } from 'next/server';
import { openaiAPI } from '@/lib/api-clients';

export async function POST(request: Request) {
  try {
    const { monthlyMetrics } = await request.json();
    
    if (!monthlyMetrics || !Array.isArray(monthlyMetrics)) {
      return NextResponse.json(
        { error: 'Invalid monthly metrics data' },
        { status: 400 }
      );
    }

    console.log('🤖 Generating AI insights...');
    
    // Use the OpenAI API client (with fallback to rule-based insights)
    const insights = await openaiAPI.generateInsights(monthlyMetrics);
    
    return NextResponse.json({
      insights,
      generatedAt: new Date().toISOString(),
      dataPoints: monthlyMetrics.length,
    });
    
  } catch (error) {
    console.error('AI Insights API error:', error);
    
    // Return basic fallback insights on error
    return NextResponse.json({
      insights: [
        {
          type: 'error',
          title: 'Analysis Unavailable',
          description: 'Unable to generate insights at this time. Please try again later.',
          impact: 'low',
          action: 'Check API configuration and try again',
        },
      ],
      generatedAt: new Date().toISOString(),
      error: 'AI analysis temporarily unavailable',
    });
  }
} 