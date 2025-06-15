import { NextResponse } from 'next/server';
import { mockDashboardData } from '@/data/mockData';

export async function GET() {
  try {
    // In a real implementation, this would fetch from multiple APIs:
    // - YouTube API for video data
    // - Kajabi API for sales/contact data  
    // - Cal.com API for booking data
    // - Database for stored metrics
    
    return NextResponse.json(mockDashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { timeRange } = body;
    
    // Filter data based on time range
    const filteredData = { ...mockDashboardData };
    
    if (timeRange && timeRange !== 'all') {
      const monthsToShow = timeRange === 'last3' ? 3 : 1;
      filteredData.monthlyMetrics = mockDashboardData.monthlyMetrics.slice(-monthsToShow);
    }
    
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error filtering dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to filter dashboard data' },
      { status: 500 }
    );
  }
} 