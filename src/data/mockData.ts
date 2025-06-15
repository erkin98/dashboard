import { DashboardData, MonthlyMetrics, YouTubeVideo, CallBooking, Sale, KajabiData, AIInsight } from '@/types';

// Generate realistic monthly metrics for last 6 months
const generateMonthlyMetrics = (): MonthlyMetrics[] => {
  const months = ['2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11'];
  
  return months.map((month, index) => {
    const growth = 1 + (index * 0.15); // 15% monthly growth trend
    const base = {
      youtubeViews: Math.floor(50000 * growth),
      youtubeUniqueViews: Math.floor(35000 * growth),
      websiteVisitors: Math.floor(8000 * growth),
      callsBooked: Math.floor(120 * growth),
      callsAccepted: Math.floor(96 * growth),
    };
    
    const newCashCollected = {
      paidInFull: Math.floor(45000 * growth),
      installments: Math.floor(25000 * growth),
      total: Math.floor(70000 * growth),
    };
    
    return {
      month,
      ...base,
      showUpRate: 80 + Math.random() * 10, // 80-90%
      newCashCollected,
      totalCashCollected: Math.floor(85000 * growth),
      conversionRates: {
        viewToWebsite: (base.websiteVisitors / base.youtubeViews) * 100,
        websiteToCall: (base.callsBooked / base.websiteVisitors) * 100,
        callToAccepted: (base.callsAccepted / base.callsBooked) * 100,
        acceptedToSale: 25 + Math.random() * 10, // 25-35%
      },
    };
  });
};

// Generate YouTube video performance data
const generateVideoData = (): YouTubeVideo[] => {
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
  
  return Array.from({ length: 500 }, (_, index) => ({
    id: `call_${index + 1}`,
    videoId: `video_${Math.floor(Math.random() * 10) + 1}`,
    bookedAt: new Date(2024, Math.floor(Math.random() * 6) + 5, Math.floor(Math.random() * 28) + 1).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    leadSource: 'youtube',
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

export const mockDashboardData: DashboardData = {
  monthlyMetrics: generateMonthlyMetrics(),
  videos: generateVideoData(),
  calls: generateCallData(),
  sales: generateSalesData(),
  kajabiData: mockKajabiData,
  aiInsights: mockAIInsights,
}; 