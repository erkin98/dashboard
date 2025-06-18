'use client';

import { useState, useMemo } from 'react';
import { YouTubeVideo, CallBooking, Sale } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  PlayIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface VideoAttributionAnalyticsProps {
  videos: YouTubeVideo[];
  calls: CallBooking[];
  sales: Sale[];
  theme?: 'dark' | 'light';
}

interface VideoPerformance extends YouTubeVideo {
  monthlyViews: number;
  callsFromThisVideo: number;
  acceptedCallsFromThisVideo: number;
  salesFromThisVideo: number;
  revenueFromThisVideo: number;
  viewToCallRate: number;
  callToSaleRate: number;
  revenuePerView: number;
  month: string;
}

export function VideoAttributionAnalytics({ 
  videos, 
  calls, 
  sales, 
  theme = 'dark' 
}: VideoAttributionAnalyticsProps) {
  const [selectedMonth, setSelectedMonth] = useState('2024-01'); // Current month
  const [sortBy, setSortBy] = useState<'revenue' | 'views' | 'conversion'>('revenue');
  
  // Get available months from data
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    calls.forEach(call => {
      const month = call.bookedAt.slice(0, 7);
      months.add(month);
    });
    return Array.from(months).sort().slice(-6); // Last 6 months
  }, [calls]);

  // Calculate video performance metrics for the selected month
  const videoPerformance = useMemo(() => {
    const monthVideos: VideoPerformance[] = [];
    
    videos.forEach(video => {
      // Get calls for this video in selected month
      const videoCalls = calls.filter(call => 
        call.videoId === video.id && 
        call.bookedAt.slice(0, 7) === selectedMonth
      );
      
      const acceptedCalls = videoCalls.filter(call => call.status === 'accepted');
      
      // Get sales from these calls
      const videoSales = sales.filter(sale => 
        videoCalls.some(call => call.id === sale.callId)
      );
      
      const totalRevenue = videoSales.reduce((sum, sale) => sum + sale.amount, 0);
      const callsBooked = videoCalls.length;
      const callsAccepted = acceptedCalls.length;
      const salesClosed = videoSales.length;
      
      // Calculate monthly views (this would be actual monthly data in real implementation)
      const monthlyViews = Math.round(video.views * 0.15); // Assume 15% of total views per month
      
      monthVideos.push({
        ...video,
        monthlyViews,
        callsFromThisVideo: callsBooked,
        acceptedCallsFromThisVideo: callsAccepted,
        salesFromThisVideo: salesClosed,
        revenueFromThisVideo: totalRevenue,
        viewToCallRate: monthlyViews > 0 ? (callsBooked / monthlyViews) * 100 : 0,
        callToSaleRate: callsBooked > 0 ? (salesClosed / callsBooked) * 100 : 0,
        revenuePerView: monthlyViews > 0 ? totalRevenue / monthlyViews : 0,
        month: selectedMonth
      });
    });
    
    // Sort based on selected criteria
    return monthVideos.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.revenueFromThisVideo - a.revenueFromThisVideo;
        case 'views':
          return b.monthlyViews - a.monthlyViews;
        case 'conversion':
          return b.viewToCallRate - a.viewToCallRate;
        default:
          return b.revenueFromThisVideo - a.revenueFromThisVideo;
      }
    });
  }, [videos, calls, sales, selectedMonth, sortBy]);

  // Get top performing video
  const topVideo = videoPerformance[0];
  
  // Calculate totals for the month
  const monthTotals = videoPerformance.reduce(
    (acc, video) => ({
      views: acc.views + video.monthlyViews,
      calls: acc.calls + video.callsFromThisVideo,
      revenue: acc.revenue + video.revenueFromThisVideo,
      sales: acc.sales + video.salesFromThisVideo
    }),
    { views: 0, calls: 0, revenue: 0, sales: 0 }
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPerformanceColor = (rate: number, type: 'conversion' | 'revenue') => {
    if (type === 'conversion') {
      if (rate > 2) return 'text-green-600';
      if (rate > 1) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (rate > 0.5) return 'text-green-600';
      if (rate > 0.1) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  return (
    <Card className={`w-full ${
      theme === 'dark' 
        ? 'bg-slate-900/40 border-slate-700/50' 
        : 'bg-white/80 border-slate-200/50'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              <PlayIcon className="h-5 w-5 text-red-500" />
              Video Attribution Analytics
            </CardTitle>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Track which YouTube videos drive sales and revenue
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Month Selector */}
            <div className="flex items-center gap-2">
              <CalendarIcon className={`h-4 w-4 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`} />
              <div className="flex gap-1">
                {availableMonths.map((month) => (
                  <Button
                    key={month}
                    variant={selectedMonth === month ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedMonth(month)}
                    className={`h-8 px-3 text-xs ${
                      selectedMonth === month
                        ? theme === 'dark'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                        : theme === 'dark'
                          ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {new Date(month + '-01').toLocaleDateString('en-US', { 
                      month: 'short' 
                    })}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <ChartBarIcon className={`h-4 w-4 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`} />
              <div className="flex gap-1">
                {[
                  { key: 'revenue', label: 'Revenue' },
                  { key: 'views', label: 'Views' },
                  { key: 'conversion', label: 'CVR' },
                ].map((sort) => (
                  <Button
                    key={sort.key}
                    variant={sortBy === sort.key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy(sort.key as 'revenue' | 'views' | 'conversion')}
                    className={`h-8 px-3 text-xs ${
                      sortBy === sort.key
                        ? theme === 'dark'
                          ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                          : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                        : theme === 'dark'
                          ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {sort.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Month Summary */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white/50 border-slate-200/50'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })} Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {formatNumber(monthTotals.views)}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total Views
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {formatNumber(monthTotals.calls)}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Calls Booked
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {formatNumber(monthTotals.sales)}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Sales Closed
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {formatCurrency(monthTotals.revenue)}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total Revenue
              </div>
            </div>
          </div>
        </div>

        {/* Top Performer Highlight */}
        {topVideo && (
          <div className={`p-4 rounded-lg border-2 border-dashed ${
            theme === 'dark' 
              ? 'bg-yellow-500/5 border-yellow-500/30' 
              : 'bg-yellow-50 border-yellow-300/50'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <TrophyIcon className="h-5 w-5 text-yellow-500" />
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Top Performer This Month
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className={`font-medium mb-2 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  {topVideo.title}
                </h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Published: {formatDate(topVideo.publishedAt)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-semibold text-red-600">
                    {formatNumber(topVideo.monthlyViews)}
                  </div>
                  <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                    Views
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-cyan-600">
                    {topVideo.callsFromThisVideo}
                  </div>
                  <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                    Calls
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(topVideo.revenueFromThisVideo)}
                  </div>
                  <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                    Revenue
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-purple-600">
                    ${topVideo.revenuePerView.toFixed(3)}
                  </div>
                  <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                    Per View
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Performance Table */}
        <div className="space-y-3">
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Video Performance Rankings
          </h3>
          
          <div className="space-y-2">
            {videoPerformance.slice(0, 10).map((video, index) => (
              <div 
                key={video.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50' 
                    : 'bg-white/50 border-slate-200/50 hover:bg-white/80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Rank & Title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs font-mono">
                        #{index + 1}
                      </Badge>
                      <h4 className={`font-medium truncate ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {video.title}
                      </h4>
                    </div>
                    <p className={`text-sm mt-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Published: {formatDate(video.publishedAt)}
                    </p>
                  </div>
                  
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                    <div className="text-center">
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {formatNumber(video.monthlyViews)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Views
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                      }`}>
                        {video.callsFromThisVideo}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Calls
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {video.salesFromThisVideo}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Sales
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        {formatCurrency(video.revenueFromThisVideo)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Revenue
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${getPerformanceColor(video.viewToCallRate, 'conversion')}`}>
                        {video.viewToCallRate.toFixed(2)}%
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        View→Call
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${getPerformanceColor(video.revenuePerView, 'revenue')}`}>
                        ${video.revenuePerView.toFixed(3)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Per View
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {videoPerformance.length === 0 && (
            <div className={`text-center py-8 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              No video performance data available for this month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 