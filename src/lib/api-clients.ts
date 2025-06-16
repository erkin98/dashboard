// API Clients for Real Data Integration
// Falls back to realistic mock data when API keys are not available

import { YouTubeVideo, MonthlyMetrics, KajabiData, AIInsight } from '@/types';

// Environment variables check
const hasYouTubeAPI = !!process.env.YOUTUBE_API_KEY;
const hasKajabiAPI = !!process.env.KAJABI_API_KEY;
const hasCalComAPI = !!process.env.CALCOM_API_KEY;
const hasOpenAIAPI = !!process.env.OPENAI_API_KEY;

// YouTube API Client
export class YouTubeAPIClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
  }

  async getChannelStats(channelId: string) {
    if (!hasYouTubeAPI) {
      console.log('🎥 YouTube API: Using mock data (add YOUTUBE_API_KEY to use real data)');
      return this.getMockChannelStats();
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${this.apiKey}`
      );
      
      if (!response.ok) throw new Error('YouTube API error');
      
      const data = await response.json();
      return {
        subscriberCount: parseInt(data.items[0].statistics.subscriberCount),
        viewCount: parseInt(data.items[0].statistics.viewCount),
        videoCount: parseInt(data.items[0].statistics.videoCount),
      };
    } catch (error) {
      console.error('YouTube API error:', error);
      return this.getMockChannelStats();
    }
  }

  async getVideoStats(videoIds: string[]) {
    if (!hasYouTubeAPI) {
      return this.getMockVideoStats();
    }

    try {
      const ids = videoIds.join(',');
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${ids}&key=${this.apiKey}`
      );
      
      if (!response.ok) throw new Error('YouTube API error');
      
      const data = await response.json();
      return data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        views: parseInt(item.statistics.viewCount),
        likes: parseInt(item.statistics.likeCount || 0),
        comments: parseInt(item.statistics.commentCount || 0),
      }));
    } catch (error) {
      console.error('YouTube API error:', error);
      return this.getMockVideoStats();
    }
  }

  private getMockChannelStats() {
    return {
      subscriberCount: 45200,
      viewCount: 2400000,
      videoCount: 156,
    };
  }

  private getMockVideoStats() {
    return [
      {
        id: 'video_1',
        title: 'How I Built a 7-Figure Coaching Business in 12 Months',
        publishedAt: '2024-11-01T10:00:00Z',
        views: 45230,
        likes: 2100,
        comments: 340,
      },
      {
        id: 'video_2',
        title: 'The Secret Sales Framework That Changed Everything',
        publishedAt: '2024-11-15T14:30:00Z',
        views: 32100,
        likes: 1800,
        comments: 280,
      },
    ];
  }
}

// Kajabi API Client
export class KajabiAPIClient {
  private apiKey: string;
  private baseUrl = 'https://api.kajabi.com';

  constructor() {
    this.apiKey = process.env.KAJABI_API_KEY || '';
  }

  async getProducts() {
    if (!hasKajabiAPI) {
      console.log('💰 Kajabi API: Using mock data (add KAJABI_API_KEY to use real data)');
      return this.getMockProducts();
    }

    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Kajabi API error');
      
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Kajabi API error:', error);
      return this.getMockProducts();
    }
  }

  async getRevenue(startDate: string, endDate: string) {
    if (!hasKajabiAPI) {
      return this.getMockRevenue();
    }

    try {
      const response = await fetch(`${this.baseUrl}/sales?start_date=${startDate}&end_date=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Kajabi API error');
      
      const data = await response.json();
      return data.sales || [];
    } catch (error) {
      console.error('Kajabi API error:', error);
      return this.getMockRevenue();
    }
  }

  async getEmailStats() {
    if (!hasKajabiAPI) {
      return this.getMockEmailStats();
    }

    try {
      const response = await fetch(`${this.baseUrl}/email_campaigns/stats`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Kajabi API error');
      
      const data = await response.json();
      return data.stats || {};
    } catch (error) {
      console.error('Kajabi API error:', error);
      return this.getMockEmailStats();
    }
  }

  private getMockProducts() {
    return [
      { id: 'prod_1', name: 'High-Ticket Coaching Mastermind', price: 3000, sales: 45, revenue: 135000 },
      { id: 'prod_2', name: 'Business Accelerator Program', price: 1500, sales: 60, revenue: 90000 },
      { id: 'prod_3', name: 'Elite Mentorship Package', price: 5000, sales: 20, revenue: 100000 },
    ];
  }

  private getMockRevenue() {
    return {
      totalRevenue: 325000,
      paidInFull: 195000,
      installments: 130000,
      monthlyBreakdown: [
        { month: '2024-06', revenue: 45000 },
        { month: '2024-07', revenue: 52000 },
        { month: '2024-08', revenue: 58000 },
        { month: '2024-09', revenue: 61000 },
        { month: '2024-10', revenue: 67000 },
        { month: '2024-11', revenue: 72000 },
      ],
    };
  }

  private getMockEmailStats() {
    return {
      opens: 8500,
      clicks: 1200,
      openRate: 55.2,
      clickRate: 14.1,
      campaigns: [
        {
          id: 'camp_1',
          name: 'Welcome Series',
          sent: 2400,
          opens: 1320,
          clicks: 180,
          conversions: 12,
        },
      ],
    };
  }
}

// Cal.com API Client  
export class CalComAPIClient {
  private apiKey: string;
  private baseUrl = 'https://api.cal.com/v1';

  constructor() {
    this.apiKey = process.env.CALCOM_API_KEY || '';
  }

  async getBookings(startDate: string, endDate: string) {
    if (!hasCalComAPI) {
      console.log('📅 Cal.com API: Using mock data (add CALCOM_API_KEY to use real data)');
      return this.getMockBookings();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/bookings?startTime=${startDate}&endTime=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Cal.com API error');
      
      const data = await response.json();
      return data.bookings || [];
    } catch (error) {
      console.error('Cal.com API error:', error);
      return this.getMockBookings();
    }
  }

  async getBookingStats() {
    if (!hasCalComAPI) {
      return this.getMockBookingStats();
    }

    try {
      const response = await fetch(`${this.baseUrl}/booking-stats`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Cal.com API error');
      
      const data = await response.json();
      return data.stats || {};
    } catch (error) {
      console.error('Cal.com API error:', error);
      return this.getMockBookingStats();
    }
  }

  private getMockBookings() {
    return [
      {
        id: 'booking_1',
        title: 'Strategy Call',
        startTime: '2024-11-20T14:00:00Z',
        endTime: '2024-11-20T15:00:00Z',
        status: 'confirmed',
        attendees: [{ email: 'client@example.com' }],
        metadata: { video: 'video_1', source: 'youtube' },
      },
      {
        id: 'booking_2', 
        title: 'Discovery Call',
        startTime: '2024-11-21T10:00:00Z',
        endTime: '2024-11-21T11:00:00Z',
        status: 'confirmed',
        attendees: [{ email: 'prospect@example.com' }],
        metadata: { video: 'video_2', source: 'youtube' },
      },
    ];
  }

  private getMockBookingStats() {
    return {
      totalBooked: 127,
      totalAccepted: 98,
      showUpRate: 77.2,
      averageDuration: 45,
      monthlyBreakdown: [
        { month: '2024-06', booked: 85, accepted: 68 },
        { month: '2024-07', booked: 92, accepted: 75 },
        { month: '2024-08', booked: 105, accepted: 86 },
        { month: '2024-09', booked: 118, accepted: 94 },
        { month: '2024-10', booked: 127, accepted: 98 },
        { month: '2024-11', booked: 140, accepted: 108 },
      ],
    };
  }
}

// OpenAI API Client
export class OpenAIAPIClient {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async generateInsights(data: MonthlyMetrics[]) {
    if (!hasOpenAIAPI) {
      console.log('🤖 OpenAI API: Using rule-based insights (add OPENAI_API_KEY to use AI)');
      return this.getRuleBasedInsights(data);
    }

    try {
      const prompt = this.buildInsightsPrompt(data);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a business analytics expert specializing in coaching businesses. Provide actionable insights based on funnel data.',
            },
            {
              role: 'user', 
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('OpenAI API error');

      const data_response = await response.json();
      return this.parseAIInsights(data_response.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.getRuleBasedInsights(data);
    }
  }

  private buildInsightsPrompt(data: MonthlyMetrics[]) {
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    
    return `
Analyze this coaching business funnel data and provide 3-4 actionable insights:

Current Month: ${JSON.stringify(latest, null, 2)}
Previous Month: ${JSON.stringify(previous, null, 2)}

Focus on:
1. Revenue trends and opportunities
2. Conversion rate optimization
3. Funnel bottlenecks
4. Specific action items

Format as JSON array with: type, title, description, impact, action
`;
  }

  private parseAIInsights(content: string): AIInsight[] {
    try {
      return JSON.parse(content);
    } catch {
      // Fallback to rule-based if AI response isn't parseable
      return this.getRuleBasedInsights([]);
    }
  }

  private getRuleBasedInsights(data: MonthlyMetrics[]): AIInsight[] {
    if (data.length < 2) {
      return [
        {
          type: 'recommendation',
          title: 'Need More Data',
          description: 'Collect more monthly data to generate meaningful insights.',
          impact: 'medium',
          action: 'Continue tracking metrics for trend analysis',
        },
      ];
    }

    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    const insights: AIInsight[] = [];

    // Revenue analysis
    const revenueGrowth = ((current.newCashCollected.total - previous.newCashCollected.total) / previous.newCashCollected.total) * 100;
    
    if (revenueGrowth > 20) {
      insights.push({
        type: 'trend',
        title: 'Strong Revenue Growth',
        description: `Revenue increased by ${revenueGrowth.toFixed(1)}% this month. Excellent momentum!`,
        impact: 'high',
        action: 'Scale successful strategies and maintain current content production pace',
      });
    } else if (revenueGrowth < -10) {
      insights.push({
        type: 'alert',
        title: 'Revenue Decline Alert',
        description: `Revenue decreased by ${Math.abs(revenueGrowth).toFixed(1)}% this month.`,
        impact: 'high',
        action: 'Review recent changes in marketing strategy and video content themes',
      });
    }

    // Show-up rate analysis
    if (current.showUpRate < 80) {
      insights.push({
        type: 'recommendation',
        title: 'Improve Call Show-up Rate',
        description: `Show-up rate is ${current.showUpRate.toFixed(1)}%, below optimal 80%+.`,
        impact: 'medium',
        action: 'Implement SMS reminders and improve pre-call qualification process',
      });
    }

    // Conversion analysis
    if (current.conversionRates.acceptedToSale < 25) {
      insights.push({
        type: 'recommendation',
        title: 'Optimize Sales Conversion',
        description: `Call-to-sale conversion is ${current.conversionRates.acceptedToSale.toFixed(1)}%, room for improvement.`,
        impact: 'high',
        action: 'Review sales scripts and provide additional closing training',
      });
    }

    return insights;
  }
}

// API Status Check
export function getAPIStatus() {
  return {
    youtube: hasYouTubeAPI ? 'connected' : 'mock',
    kajabi: hasKajabiAPI ? 'connected' : 'mock', 
    calcom: hasCalComAPI ? 'connected' : 'mock',
    openai: hasOpenAIAPI ? 'connected' : 'mock',
  };
}

// Initialize API clients
export const youtubeAPI = new YouTubeAPIClient();
export const kajabiAPI = new KajabiAPIClient();
export const calcomAPI = new CalComAPIClient();
export const openaiAPI = new OpenAIAPIClient(); 