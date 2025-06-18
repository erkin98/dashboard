import { NextResponse } from 'next/server';
import { 
  youtubeAPI, 
  kajabiAPI, 
  calcomAPI, 
  openaiAPI, 
  getAPIStatus 
} from '@/lib/api-clients';
import { generateMockDashboardData } from '@/data/mockData';
import { MonthlyMetrics, YouTubeVideo, DashboardData } from '@/types';

// Type definitions for API responses
interface YouTubeApiData {
  channelStats: {
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
  };
  videoStats: Array<{
    id: string;
    title: string;
    publishedAt: string;
    views: number;
  }>;
}

interface KajabiApiData {
  products: unknown[];
  revenue: {
    monthlyBreakdown?: Array<{
      month: string;
      revenue: number;
    }>;
  };
  emailStats: unknown;
}

interface CalComApiData {
  bookings: unknown[];
  stats: {
    monthlyBreakdown?: Array<{
      month: string;
      booked: number;
      accepted: number;
    }>;
  };
}

interface MonthBookings {
  booked: number;
  accepted: number;
}

export async function GET() {
  try {
    console.log('🔄 Fetching dashboard data...');
    
    // Get API connection status
    const apiStatus = getAPIStatus();
    console.log('API Status:', apiStatus);
    
    // Get real or mock data based on API availability
    const [youtubeData, kajabiData, calcomData] = await Promise.all([
      fetchYouTubeData(),
      fetchKajabiData(), 
      fetchCalComData(),
    ]);

    // Combine data into dashboard format
    const dashboardData = await buildDashboardData(youtubeData, kajabiData, calcomData);
    
    // Generate AI insights
    const aiInsights = await openaiAPI.generateInsights(dashboardData.monthlyMetrics);
    
    return NextResponse.json({
      ...dashboardData,
      aiInsights,
      apiStatus,
      lastUpdated: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Dashboard API error:', error);
    
    // Fallback to pure mock data on any error
    const mockData = generateMockDashboardData();
    return NextResponse.json({
      ...mockData,
      apiStatus: { youtube: 'error', kajabi: 'error', calcom: 'error', openai: 'error' },
      lastUpdated: new Date().toISOString(),
    });
  }
}

async function fetchYouTubeData(): Promise<YouTubeApiData> {
  try {
    // Replace with your actual YouTube channel ID
    const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UC_default_channel';
    
    const [channelStats, videoStats] = await Promise.all([
      youtubeAPI.getChannelStats(channelId),
      youtubeAPI.getVideoStats(['video_1', 'video_2', 'video_3']) // Replace with actual video IDs
    ]);
    
    return { channelStats, videoStats };
  } catch (error) {
    console.error('YouTube data fetch error:', error);
    throw error;
  }
}

async function fetchKajabiData(): Promise<KajabiApiData> {
  try {
    const [products, revenue, emailStats] = await Promise.all([
      kajabiAPI.getProducts(),
      kajabiAPI.getRevenue('2024-06-01', '2024-11-30'),
      kajabiAPI.getEmailStats(),
    ]);
    
    return { products, revenue, emailStats };
  } catch (error) {
    console.error('Kajabi data fetch error:', error);
    throw error;
  }
}

async function fetchCalComData(): Promise<CalComApiData> {
  try {
    const [bookings, stats] = await Promise.all([
      calcomAPI.getBookings('2024-06-01', '2024-11-30'),
      calcomAPI.getBookingStats(),
    ]);
    
    return { bookings, stats };
  } catch (error) {
    console.error('Cal.com data fetch error:', error);
    throw error;
  }
}

async function buildDashboardData(youtubeData: YouTubeApiData, kajabiData: KajabiApiData, calcomData: CalComApiData): Promise<DashboardData> {
  // Build monthly metrics from real data
  const monthlyMetrics: MonthlyMetrics[] = buildMonthlyMetrics(youtubeData, kajabiData, calcomData);
  
  // Build video performance data  
  const videos: YouTubeVideo[] = buildVideoPerformance(youtubeData);
  
  // Get mock data for other components that don't have real API yet
  const mockData = generateMockDashboardData();
  
  return {
    monthlyMetrics,
    videos,
    calls: mockData.calls,
    sales: mockData.sales,
    kajabiData: mockData.kajabiData,
    aiInsights: mockData.aiInsights,
    emailCampaigns: mockData.emailCampaigns,
    trafficSources: mockData.trafficSources, 
    realTimeAlerts: mockData.realTimeAlerts,
    performanceThresholds: mockData.performanceThresholds,
  };
}

function buildMonthlyMetrics(youtubeData: YouTubeApiData, kajabiData: KajabiApiData, calcomData: CalComApiData): MonthlyMetrics[] {
  // Build from real API data when available, otherwise use mock structure
  const months = ['2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11'];
  
  return months.map((month, index) => {
    // Use real revenue data if available
    const monthRevenue = kajabiData.revenue?.monthlyBreakdown?.find((m) => m.month === month)?.revenue || 
                        (45000 + index * 5000); // Fallback calculation
    
    // Use real booking data if available  
    const monthBookings: MonthBookings = calcomData.stats?.monthlyBreakdown?.find((m) => m.month === month) ||
                         { booked: 85 + index * 8, accepted: 68 + index * 6 };
    
    const youtubeViews = 25000 + index * 2000;
    const websiteVisitors = 8200 + index * 400;
    
    return {
      month,
      youtubeViews,
      youtubeUniqueViews: Math.floor(youtubeViews * 0.7), // 70% unique views
      websiteVisitors,
      callsBooked: monthBookings.booked,
      callsAccepted: monthBookings.accepted,
      showUpRate: (monthBookings.accepted / monthBookings.booked) * 100,
      newCashCollected: {
        total: monthRevenue,
        paidInFull: Math.floor(monthRevenue * 0.6),
        installments: Math.floor(monthRevenue * 0.4),
      },
      totalCashCollected: Math.floor(monthRevenue * 1.2), // 20% more total than new
      conversionRates: {
        viewToWebsite: (websiteVisitors / youtubeViews) * 100,
        websiteToCall: (monthBookings.booked / websiteVisitors) * 100,
        callToAccepted: (monthBookings.accepted / monthBookings.booked) * 100,
        acceptedToSale: 25.0,
      },
    };
  });
}

function buildVideoPerformance(youtubeData: YouTubeApiData): YouTubeVideo[] {
  const videos = youtubeData.videoStats || [];
  
  return videos.map((video) => ({
    id: video.id,
    title: video.title,
    publishedAt: video.publishedAt,
    views: video.views,
    uniqueViews: Math.floor(video.views * 0.7),
    leadsGenerated: Math.floor(video.views * 0.02), // 2% lead rate
    callsBooked: Math.floor(video.views * 0.005), // 0.5% booking rate
    callsAccepted: Math.floor(video.views * 0.0035), // 0.35% acceptance rate
    salesClosed: Math.floor(video.views * 0.00125), // 0.125% close rate
    revenue: Math.floor(video.views * 0.00125 * 3000), // Average $3000 per close
    conversionRate: (video.views * 0.00125 / video.views) * 100,
    revenuePerView: (video.views * 0.00125 * 3000) / video.views,
  }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { timeRange } = body;
    
    // Get mock data for filtering
    const mockDashboardData = generateMockDashboardData();
    
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