export interface MonthlyMetrics {
  month: string;
  youtubeViews: number;
  youtubeUniqueViews: number;
  websiteVisitors: number;
  callsBooked: number;
  callsAccepted: number;
  showUpRate: number;
  newCashCollected: {
    paidInFull: number;
    installments: number;
    total: number;
  };
  totalCashCollected: number;
  conversionRates: {
    viewToWebsite: number;
    websiteToCall: number;
    callToAccepted: number;
    acceptedToSale: number;
  };
}

export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  views: number;
  uniqueViews: number;
  leadsGenerated: number;
  callsBooked: number;
  callsAccepted: number;
  salesClosed: number;
  revenue: number;
  conversionRate: number;
  revenuePerView: number;
}

export interface CallBooking {
  id: string;
  videoId: string;
  bookedAt: string;
  status: 'booked' | 'accepted' | 'no-show' | 'cancelled';
  country: string;
  leadSource: DetailedLeadSource;
}

export interface DetailedLeadSource {
  platform: 'youtube' | 'google' | 'facebook' | 'twitter' | 'linkedin' | 'direct' | 'referral';
  medium: 'organic' | 'paid' | 'social' | 'email' | 'affiliate' | 'direct';
  campaign?: string;
  source?: string;
  content?: string;
  term?: string;
  timestamp: string;
  userAgent?: string;
  referrerUrl?: string;
  landingPage: string;
  sessionId: string;
}

export interface Sale {
  id: string;
  callId: string;
  amount: number;
  type: 'paid-in-full' | 'installment';
  product: string;
  closedAt: string;
  country: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  type: 'welcome' | 'nurture' | 'promotional' | 'follow-up' | 'abandoned-cart' | 'webinar';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  sentAt?: string;
  scheduledFor?: string;
  recipients: {
    total: number;
    sent: number;
    delivered: number;
    bounced: number;
    failed: number;
  };
  engagement: {
    opens: number;
    uniqueOpens: number;
    clicks: number;
    uniqueClicks: number;
    unsubscribes: number;
    spam: number;
  };
  conversions: {
    callsBooked: number;
    sales: number;
    revenue: number;
  };
  subject: string;
  previewText?: string;
  tags: string[];
  segmentId?: string;
  linkedVideoId?: string;
  followUpSequence?: number;
}

export interface KajabiData {
  products: Array<{
    id: string;
    name: string;
    price: number;
    sales: number;
    revenue: number;
  }>;
  contacts: number;
  emailStats: {
    opens: number;
    clicks: number;
    openRate: number;
    clickRate: number;
  };
  emailCampaigns: EmailCampaign[];
}

export interface AIInsight {
  type: 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

export interface RealTimeAlert {
  id: string;
  type: 'performance' | 'conversion' | 'revenue' | 'engagement' | 'system';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  suggestedActions?: string[];
  relatedVideoId?: string;
  relatedCampaignId?: string;
  threshold?: {
    metric: string;
    expected: number;
    actual: number;
    variance: number;
  };
}

export interface PerformanceThreshold {
  id: string;
  metric: 'conversion_rate' | 'call_show_rate' | 'email_open_rate' | 'revenue_per_view' | 'video_performance';
  threshold: number;
  operator: 'greater_than' | 'less_than' | 'equals';
  isActive: boolean;
  alertOnBreach: boolean;
  timeframe: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface DashboardData {
  monthlyMetrics: MonthlyMetrics[];
  videos: YouTubeVideo[];
  calls: CallBooking[];
  sales: Sale[];
  kajabiData: KajabiData;
  aiInsights: AIInsight[];
  emailCampaigns: EmailCampaign[];
  realTimeAlerts: RealTimeAlert[];
  performanceThresholds: PerformanceThreshold[];
  trafficSources: TrafficSourceAttribution[];
  apiStatus?: {
    youtube: 'connected' | 'mock' | 'error';
    kajabi: 'connected' | 'mock' | 'error';
    calcom: 'connected' | 'mock' | 'error';
    openai: 'connected' | 'mock' | 'error';
  };
  lastUpdated?: string;
}

export interface TrafficSourceAttribution {
  source: DetailedLeadSource;
  visitors: number;
  callsBooked: number;
  salesClosed: number;
  revenue: number;
  conversionRate: number;
  costPerAcquisition?: number;
  lifetime: {
    firstSeen: string;
    lastSeen: string;
    totalVisits: number;
    totalRevenue: number;
  };
} 