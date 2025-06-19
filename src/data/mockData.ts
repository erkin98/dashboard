import { 
  DashboardData, 
  MonthlyMetrics, 
  YouTubeVideo, 
  CallBooking, 
  Sale, 
  KajabiData, 
  AIInsight,
  EmailCampaign,
  TrafficSourceAttribution,
  RealTimeAlert,
  PerformanceThreshold,
  DetailedLeadSource
} from '@/types';

// New types to match the spec
interface MockKajabiMonthlyRevenue {
  month: string;
  new_cash_collected: {
    pif: number;
    installments: number;
  };
  total_cash_collected: number;
  high_ticket_closes: {
    pif: number;
    installments: number;
  };
  discount_closes: {
    pif: number;
    installments: number;
  };
}

interface MockCalComMonthlyCalls {
  month: string;
  total_booked: number;
  accepted: number;
  show_ups: number;
  cancelled: number;
  video_sources: Array<{
    video_id: string;
    calls_booked: number;
    accepted: number;
    show_ups: number;
  }>;
}


// --- REFACTORED MOCK DATA GENERATION ---

// Generate mock data for a single month for Kajabi
export const getMockKajabiMonthlyRevenue = (month: string, growth: number): MockKajabiMonthlyRevenue => {
  const highTicketPif = Math.floor(15 * growth);
  const highTicketInstall = Math.floor(10 * growth);
  const discountPif = Math.floor(5 * growth);
  const discountInstall = Math.floor(5 * growth);
  
  const newCashPif = highTicketPif * 3000 + discountPif * 1500;
  const newCashInstall = highTicketInstall * 500 + discountInstall * 250; // Assuming smaller first installment

  return {
    month,
    new_cash_collected: {
      pif: newCashPif,
      installments: newCashInstall,
    },
    total_cash_collected: newCashPif + newCashInstall + Math.floor(20000 * growth), // Includes recurring
    high_ticket_closes: {
      pif: highTicketPif,
      installments: highTicketInstall,
    },
    discount_closes: {
      pif: discountPif,
      installments: discountInstall,
    },
  };
};

// Generate mock data for a single month for Cal.com
export const getMockCalComMonthlyCalls = (month: string, growth: number, allVideos: YouTubeVideo[]): MockCalComMonthlyCalls => {
  const totalBooked = Math.floor(120 * growth);
  const accepted = Math.floor(totalBooked * (0.8 + Math.random() * 0.1)); // 80-90% accepted
  const showUps = Math.floor(accepted * (0.9 + Math.random() * 0.05)); // 90-95% show-up from accepted
  const cancelled = totalBooked - accepted;

  // Distribute calls among random videos
  let remainingCalls = totalBooked;
  const videoSources = allVideos.slice(0, 5).map(video => {
      const callsForVideo = Math.floor(remainingCalls * (Math.random() * 0.4 + 0.1));
      remainingCalls -= callsForVideo;
      const acceptedForVideo = Math.floor(callsForVideo * 0.85);
      const showUpsForVideo = Math.floor(acceptedForVideo * 0.92);
      return {
        video_id: video.id,
        calls_booked: callsForVideo,
        accepted: acceptedForVideo,
        show_ups: showUpsForVideo
      }
  });
  // Assign remaining to the first video
  if(videoSources.length > 0) {
    videoSources[0].calls_booked += remainingCalls;
  }


  return {
    month,
    total_booked: totalBooked,
    accepted: accepted,
    show_ups: showUps,
    cancelled: cancelled,
    video_sources: videoSources,
  };
};


// Generate realistic monthly metrics for last 6 months
const generateMonthlyMetrics = (videos: YouTubeVideo[]): MonthlyMetrics[] => {
  const months = ['2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11'];
  
  return months.map((month, index) => {
    const growth = 1 + (index * 0.15); // 15% monthly growth trend
    const kajabiData = getMockKajabiMonthlyRevenue(month, growth);
    const calcomData = getMockCalComMonthlyCalls(month, growth, videos);
    
    const newCashCollected = {
      paidInFull: kajabiData.new_cash_collected.pif,
      installments: kajabiData.new_cash_collected.installments,
      total: kajabiData.new_cash_collected.pif + kajabiData.new_cash_collected.installments,
    };
    
    return {
      month,
      youtubeViews: Math.floor(50000 * growth),
      youtubeUniqueViews: Math.floor(35000 * growth),
      websiteVisitors: Math.floor(8000 * growth),
      callsBooked: calcomData.total_booked,
      callsAccepted: calcomData.accepted,
      showUpRate: (calcomData.show_ups / calcomData.accepted) * 100,
      newCashCollected,
      totalCashCollected: kajabiData.total_cash_collected,
      conversionRates: {
        viewToWebsite: (8000 * growth) / (50000 * growth) * 100,
        websiteToCall: (calcomData.total_booked / (8000 * growth)) * 100,
        callToAccepted: (calcomData.accepted / calcomData.total_booked) * 100,
        acceptedToSale: (kajabiData.high_ticket_closes.pif + kajabiData.high_ticket_closes.installments) / calcomData.accepted * 100,
      },
    };
  });
};

// Generate YouTube video performance data
export const generateVideoData = (): YouTubeVideo[] => {
  const videoTitles = [
    "How I Built a 7-Figure Coaching Business in 12 Months",
    "The Secret Sales Framework That Changed Everything",
    "5 Mistakes That Kill Your Coaching Business",
    "Why Most Coaches Fail (And How to Avoid It)",
    "From Broke to 6-Figures: My Complete Journey",
    "The Psychology of High-Ticket Sales",
    "Building Systems That Scale Your Coaching",
    "Client Transformation Stories That Sell",
    "Overcoming Imposter Syndrome as a Coach",
    "The Future of Online Coaching in 2024"
  ];
  
  return videoTitles.map((title, index) => {
    const views = Math.floor(15000 + Math.random() * 35000);
    const uniqueViews = Math.floor(views * 0.7);
    const callsBooked = Math.floor(views * 0.002); // 0.2% conversion
    const callsAccepted = Math.floor(callsBooked * 0.8);
    const salesClosed = Math.floor(callsAccepted * 0.3);
    const revenue = salesClosed * (Math.random() > 0.5 ? 3000 : 1500); // High ticket vs discount
    
    return {
      id: `video_${index + 1}`,
      title,
      publishedAt: new Date(2024, 5 + index, Math.floor(Math.random() * 28) + 1).toISOString(),
      views,
      uniqueViews,
      leadsGenerated: Math.floor(views * 0.003),
      callsBooked,
      callsAccepted,
      salesClosed,
      revenue,
      conversionRate: (salesClosed / views) * 100,
      revenuePerView: revenue / views,
    };
  }).sort((a, b) => b.revenue - a.revenue);
};

// Generate call booking data
const generateCallData = (): CallBooking[] => {
  const countries = ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL', 'SG'];
  const statuses: CallBooking['status'][] = ['accepted', 'accepted', 'accepted', 'no-show', 'cancelled'];
  const platforms: DetailedLeadSource['platform'][] = ['youtube', 'google', 'facebook', 'linkedin', 'direct'];
  const mediums: DetailedLeadSource['medium'][] = ['organic', 'paid', 'social', 'email'];
  
  return Array.from({ length: 500 }, (_, index) => ({
    id: `call_${index + 1}`,
    videoId: `video_${Math.floor(Math.random() * 10) + 1}`,
    bookedAt: new Date(2024, Math.floor(Math.random() * 6) + 5, Math.floor(Math.random() * 28) + 1).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    leadSource: {
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      medium: mediums[Math.floor(Math.random() * mediums.length)],
      campaign: `Campaign ${index % 10 + 1}`,
      source: platforms[Math.floor(Math.random() * platforms.length)],
      timestamp: new Date(2024, Math.floor(Math.random() * 6) + 5, Math.floor(Math.random() * 28) + 1).toISOString(),
      landingPage: '/coaching-application',
      sessionId: `session_${index + 1}`,
    },
  }));
};

// Generate sales data
const generateSalesData = (): Sale[] => {
  const products = [
    'High-Ticket Coaching Mastermind',
    'Business Accelerator Program',
    'Elite Mentorship Package',
    'VIP Done-For-You Service'
  ];
  
  return Array.from({ length: 150 }, (_, index) => ({
    id: `sale_${index + 1}`,
    callId: `call_${index + 1}`,
    amount: Math.random() > 0.6 ? 3000 : 1500, // 60% high ticket, 40% discount
    type: Math.random() > 0.3 ? 'paid-in-full' : 'installment' as const,
    product: products[Math.floor(Math.random() * products.length)],
    closedAt: new Date(2024, Math.floor(Math.random() * 6) + 5, Math.floor(Math.random() * 28) + 1).toISOString(),
    country: ['US', 'CA', 'UK', 'AU'][Math.floor(Math.random() * 4)],
  }));
};

// Generate email campaign data
const generateEmailCampaigns = (): EmailCampaign[] => {
  const campaigns = [
    {
      name: 'Welcome Series - New Subscribers',
      type: 'welcome' as const,
      subject: 'Welcome! Your coaching journey starts here...',
      linkedVideoId: 'video_1',
    },
    {
      name: 'Webinar Follow-up Sequence',
      type: 'follow-up' as const,
      subject: 'Did you catch our masterclass? Here\'s what you missed',
      linkedVideoId: 'video_2',
    },
    {
      name: 'Black Friday 2024 Promotion',
      type: 'promotional' as const,
      subject: 'LAST CHANCE: 50% off coaching programs (ends tonight)',
    },
    {
      name: 'Monthly Newsletter - Success Stories',
      type: 'nurture' as const,
      subject: 'Amazing transformations from our coaching community',
    },
    {
      name: 'Cart Abandonment Recovery',
      type: 'abandoned-cart' as const,
      subject: 'Complete your enrollment - your spot is waiting',
    },
    {
      name: 'Free Training Announcement',
      type: 'webinar' as const,
      subject: 'LIVE: How to scale your business to 7-figures',
      linkedVideoId: 'video_3',
    },
  ];

  return campaigns.map((campaign, index) => ({
    id: `campaign_${index + 1}`,
    name: campaign.name,
    type: campaign.type,
    status: Math.random() > 0.3 ? 'sent' : 'scheduled' as const,
    sentAt: Math.random() > 0.3 ? new Date(2024, 10, Math.floor(Math.random() * 30) + 1).toISOString() : undefined,
    scheduledFor: Math.random() > 0.7 ? new Date(2024, 11, Math.floor(Math.random() * 30) + 1).toISOString() : undefined,
    recipients: {
      total: Math.floor(2000 + Math.random() * 8000),
      sent: Math.floor(1800 + Math.random() * 7500),
      delivered: Math.floor(1700 + Math.random() * 7000),
      bounced: Math.floor(20 + Math.random() * 80),
      failed: Math.floor(5 + Math.random() * 20),
    },
    engagement: {
      opens: Math.floor(800 + Math.random() * 4000),
      uniqueOpens: Math.floor(600 + Math.random() * 3000),
      clicks: Math.floor(120 + Math.random() * 600),
      uniqueClicks: Math.floor(80 + Math.random() * 400),
      unsubscribes: Math.floor(5 + Math.random() * 25),
      spam: Math.floor(2 + Math.random() * 10),
    },
    conversions: {
      callsBooked: Math.floor(15 + Math.random() * 45),
      sales: Math.floor(3 + Math.random() * 12),
      revenue: Math.floor(9000 + Math.random() * 36000),
    },
    subject: campaign.subject,
    previewText: 'Preview text for better open rates...',
    tags: ['coaching', 'business', campaign.type],
    linkedVideoId: campaign.linkedVideoId,
    followUpSequence: Math.floor(1 + Math.random() * 5),
  }));
};

// Kajabi mock data
const mockKajabiData: KajabiData = {
  products: [
    { id: 'prod_1', name: 'High-Ticket Coaching Mastermind', price: 3000, sales: 45, revenue: 135000 },
    { id: 'prod_2', name: 'Business Accelerator Program', price: 1500, sales: 60, revenue: 90000 },
    { id: 'prod_3', name: 'Elite Mentorship Package', price: 5000, sales: 20, revenue: 100000 },
    { id: 'prod_4', name: 'VIP Done-For-You Service', price: 10000, sales: 8, revenue: 80000 },
  ],
  contacts: 15420,
  emailStats: {
    opens: 8500,
    clicks: 1200,
    openRate: 55.2,
    clickRate: 14.1,
  },
  emailCampaigns: generateEmailCampaigns(),
};

// Generate traffic source attribution data
const generateTrafficSources = (): TrafficSourceAttribution[] => {
  const sources: Array<{
    platform: DetailedLeadSource['platform'];
    medium: DetailedLeadSource['medium'];
    campaign?: string;
    costPerAcquisition?: number;
  }> = [
    { platform: 'youtube', medium: 'organic', campaign: 'Organic YouTube Growth' },
    { platform: 'youtube', medium: 'paid', campaign: 'YouTube Ads Campaign', costPerAcquisition: 25.50 },
    { platform: 'google', medium: 'organic', campaign: 'SEO Content Marketing' },
    { platform: 'google', medium: 'paid', campaign: 'Google Ads - Coaching Keywords', costPerAcquisition: 45.20 },
    { platform: 'facebook', medium: 'paid', campaign: 'Facebook Lead Gen', costPerAcquisition: 38.75 },
    { platform: 'linkedin', medium: 'organic', campaign: 'LinkedIn Thought Leadership' },
    { platform: 'direct', medium: 'direct', campaign: 'Direct Traffic' },
    { platform: 'referral', medium: 'affiliate', campaign: 'Affiliate Partners', costPerAcquisition: 85.00 },
  ];

  return sources.map((source, index) => {
    const visitors = Math.floor(500 + Math.random() * 5000);
    const callsBooked = Math.floor(visitors * (0.008 + Math.random() * 0.012));
    const salesClosed = Math.floor(callsBooked * (0.15 + Math.random() * 0.25));
    const revenue = salesClosed * (2000 + Math.random() * 3000);

    return {
      source: {
        platform: source.platform,
        medium: source.medium,
        campaign: source.campaign,
        source: source.platform,
        timestamp: new Date().toISOString(),
        landingPage: '/coaching-application',
        sessionId: `session_${index + 1}`,
      },
      visitors,
      callsBooked,
      salesClosed,
      revenue,
      conversionRate: (salesClosed / visitors) * 100,
      costPerAcquisition: source.costPerAcquisition,
      lifetime: {
        firstSeen: new Date(2024, 5, 1).toISOString(),
        lastSeen: new Date().toISOString(),
        totalVisits: visitors + Math.floor(Math.random() * 2000),
        totalRevenue: revenue + Math.floor(Math.random() * 50000),
      },
    };
  });
};

// Generate real-time alerts
const generateRealTimeAlerts = (): RealTimeAlert[] => {
  const alerts = [
    {
      type: 'performance' as const,
      severity: 'critical' as const,
      title: 'Call Show-up Rate Declined',
      message: 'Show-up rate dropped to 65% today, down from 80% average. This may impact revenue targets.',
      suggestedActions: [
        'Send additional reminder emails 2 hours before calls',
        'Implement SMS reminder system',
        'Review call booking confirmation process',
        'Add calendar booking with automatic reminders',
      ],
      relatedVideoId: 'video_3',
    },
    {
      type: 'conversion' as const,
      severity: 'warning' as const,
      title: 'YouTube Traffic Spike',
      message: 'Video "7-Figure Business" gained 15K views in the last 4 hours. Monitor conversion rates.',
      suggestedActions: [
        'Scale up ad spend on similar content',
        'Create follow-up videos while momentum is high',
        'Monitor landing page capacity',
      ],
      relatedVideoId: 'video_1',
    },
    {
      type: 'revenue' as const,
      severity: 'success' as const,
      title: 'Daily Revenue Target Exceeded',
      message: 'Today\'s revenue of $18,500 is 150% of daily target. Great performance!',
      suggestedActions: [
        'Analyze successful strategies for replication',
        'Document winning sales approach',
        'Schedule team celebration call',
      ],
    },
    {
      type: 'engagement' as const,
      severity: 'info' as const,
      title: 'Email Campaign High Performance',
      message: 'Welcome series email achieved 68% open rate, well above 55% average.',
      suggestedActions: [
        'Use similar subject line patterns in future campaigns',
        'A/B test send time optimization',
        'Create similar content for other sequences',
      ],
      relatedCampaignId: 'campaign_1',
    },
    {
      type: 'system' as const,
      severity: 'warning' as const,
      title: 'API Rate Limit Approaching',
      message: 'YouTube API usage at 85% of daily limit. Consider optimization.',
      suggestedActions: [
        'Implement data caching to reduce API calls',
        'Upgrade to higher tier plan if needed',
        'Optimize data fetching intervals',
      ],
    },
  ];

  return alerts.map((alert, index) => ({
    id: `alert_${index + 1}`,
    ...alert,
    data: {},
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Random time in last 24h
    isRead: Math.random() > 0.7, // 30% chance of being read
    actionRequired: alert.severity === 'critical',
    threshold: alert.type === 'performance' ? {
      metric: 'Call Show-up Rate',
      expected: 80,
      actual: 65,
      variance: -18.75,
    } : undefined,
  }));
};

// Generate performance thresholds
const generatePerformanceThresholds = (): PerformanceThreshold[] => {
  return [
    {
      id: 'threshold_1',
      metric: 'conversion_rate',
      threshold: 2.0,
      operator: 'greater_than',
      isActive: true,
      alertOnBreach: true,
      timeframe: 'daily',
    },
    {
      id: 'threshold_2',
      metric: 'call_show_rate',
      threshold: 75,
      operator: 'greater_than',
      isActive: true,
      alertOnBreach: true,
      timeframe: 'hourly',
    },
    {
      id: 'threshold_3',
      metric: 'email_open_rate',
      threshold: 45,
      operator: 'greater_than',
      isActive: true,
      alertOnBreach: false,
      timeframe: 'daily',
    },
    {
      id: 'threshold_4',
      metric: 'revenue_per_view',
      threshold: 0.15,
      operator: 'greater_than',
      isActive: false,
      alertOnBreach: true,
      timeframe: 'weekly',
    },
    {
      id: 'threshold_5',
      metric: 'video_performance',
      threshold: 10000,
      operator: 'greater_than',
      isActive: true,
      alertOnBreach: false,
      timeframe: 'daily',
    },
  ];
};

// AI-generated insights
const mockAIInsights: AIInsight[] = [
  {
    type: 'trend',
    title: 'YouTube Performance Surge',
    description: 'Video views increased 34% this month, driven by "7-Figure Business" video going viral.',
    impact: 'high',
    action: 'Create similar content around business transformation stories',
  },
  {
    type: 'recommendation',
    title: 'Optimize Call Show-up Rate',
    description: 'Show-up rate dropped to 78% this month. Consider implementing reminder sequences.',
    impact: 'medium',
    action: 'Set up automated SMS and email reminders 24h and 2h before calls',
  },
  {
    type: 'alert',
    title: 'Conversion Rate Opportunity',
    description: 'Website to call conversion is 1.5%, below industry average of 2.2%.',
    impact: 'high',
    action: 'A/B test landing page headlines and call-to-action buttons',
  },
  {
    type: 'trend',
    title: 'Geographic Expansion',
    description: 'EU leads increased 28% this quarter, representing untapped revenue potential.',
    impact: 'medium',
    action: 'Consider EU-friendly payment options and timezone-appropriate call slots',
  },
];

// Generate initial data on load
const initialVideos = generateVideoData();
const initialMonthlyMetrics = generateMonthlyMetrics(initialVideos);

export const mockDashboardData: DashboardData = {
  monthlyMetrics: initialMonthlyMetrics,
  videos: initialVideos,
  calls: generateCallData(),
  sales: generateSalesData(),
  kajabiData: mockKajabiData,
  aiInsights: mockAIInsights,
  emailCampaigns: generateEmailCampaigns(),
  realTimeAlerts: generateRealTimeAlerts(),
  performanceThresholds: generatePerformanceThresholds(),
  trafficSources: generateTrafficSources(),
};

// Export function version for dynamic generation
export const generateMockDashboardData = (): DashboardData => {
  const videos = generateVideoData();
  const monthlyMetrics = generateMonthlyMetrics(videos);
  return {
    monthlyMetrics,
    videos,
    calls: generateCallData(),
    sales: generateSalesData(),
    kajabiData: mockKajabiData,
    aiInsights: mockAIInsights,
    emailCampaigns: generateEmailCampaigns(),
    realTimeAlerts: generateRealTimeAlerts(),
    performanceThresholds: generatePerformanceThresholds(),
    trafficSources: generateTrafficSources(),
  };
}; 