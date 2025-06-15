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
  leadSource: string;
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
}

export interface AIInsight {
  type: 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

export interface DashboardData {
  monthlyMetrics: MonthlyMetrics[];
  videos: YouTubeVideo[];
  calls: CallBooking[];
  sales: Sale[];
  kajabiData: KajabiData;
  aiInsights: AIInsight[];
} 