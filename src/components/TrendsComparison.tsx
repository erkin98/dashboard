'use client';

import { useState, useMemo } from 'react';
import { MonthlyMetrics, YouTubeVideo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  TrophyIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

interface TrendsComparisonProps {
  monthlyMetrics: MonthlyMetrics[];
  videos: YouTubeVideo[];
  theme?: 'dark' | 'light';
}

interface TrendData {
  metric: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  status: 'up' | 'down' | 'stable';
  severity: 'good' | 'warning' | 'critical';
}

interface DropoffPoint {
  stage: string;
  fromStage: string;
  conversionRate: number;
  expectedRate: number;
  variance: number;
  severity: 'high' | 'medium' | 'low';
}

export function TrendsComparison({ 
  monthlyMetrics, 
  videos, 
  theme = 'dark' 
}: TrendsComparisonProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3m' | '6m' | 'all'>('6m');
  
  // Get filtered data based on timeframe
  const filteredMetrics = useMemo(() => {
    switch (selectedTimeframe) {
      case '3m':
        return monthlyMetrics.slice(-3);
      case '6m':
        return monthlyMetrics.slice(-6);
      default:
        return monthlyMetrics;
    }
  }, [monthlyMetrics, selectedTimeframe]);

  // Calculate month-over-month trends
  const trends = useMemo(() => {
    if (filteredMetrics.length < 2) return [];
    
    const current = filteredMetrics[filteredMetrics.length - 1];
    const previous = filteredMetrics[filteredMetrics.length - 2];
    
    const trendData: TrendData[] = [
      {
        metric: 'YouTube Views',
        current: current.youtubeViews,
        previous: previous.youtubeViews,
        change: current.youtubeViews - previous.youtubeViews,
        changePercent: ((current.youtubeViews - previous.youtubeViews) / previous.youtubeViews) * 100,
        status: current.youtubeViews > previous.youtubeViews ? 'up' : current.youtubeViews < previous.youtubeViews ? 'down' : 'stable',
        severity: 'good'
      },
      {
        metric: 'Website Visitors',
        current: current.websiteVisitors,
        previous: previous.websiteVisitors,
        change: current.websiteVisitors - previous.websiteVisitors,
        changePercent: ((current.websiteVisitors - previous.websiteVisitors) / previous.websiteVisitors) * 100,
        status: current.websiteVisitors > previous.websiteVisitors ? 'up' : current.websiteVisitors < previous.websiteVisitors ? 'down' : 'stable',
        severity: 'good'
      },
      {
        metric: 'Calls Booked',
        current: current.callsBooked,
        previous: previous.callsBooked,
        change: current.callsBooked - previous.callsBooked,
        changePercent: ((current.callsBooked - previous.callsBooked) / previous.callsBooked) * 100,
        status: current.callsBooked > previous.callsBooked ? 'up' : current.callsBooked < previous.callsBooked ? 'down' : 'stable',
        severity: 'good'
      },
      {
        metric: 'Revenue',
        current: current.newCashCollected.total,
        previous: previous.newCashCollected.total,
        change: current.newCashCollected.total - previous.newCashCollected.total,
        changePercent: ((current.newCashCollected.total - previous.newCashCollected.total) / previous.newCashCollected.total) * 100,
        status: current.newCashCollected.total > previous.newCashCollected.total ? 'up' : current.newCashCollected.total < previous.newCashCollected.total ? 'down' : 'stable',
        severity: 'good'
      },
      {
        metric: 'Show-up Rate',
        current: current.showUpRate,
        previous: previous.showUpRate,
        change: current.showUpRate - previous.showUpRate,
        changePercent: ((current.showUpRate - previous.showUpRate) / previous.showUpRate) * 100,
        status: current.showUpRate > previous.showUpRate ? 'up' : current.showUpRate < previous.showUpRate ? 'down' : 'stable',
        severity: current.showUpRate < 70 ? 'critical' : current.showUpRate < 80 ? 'warning' : 'good'
      },
      {
        metric: 'Close Rate',
        current: current.conversionRates.acceptedToSale,
        previous: previous.conversionRates.acceptedToSale,
        change: current.conversionRates.acceptedToSale - previous.conversionRates.acceptedToSale,
        changePercent: ((current.conversionRates.acceptedToSale - previous.conversionRates.acceptedToSale) / previous.conversionRates.acceptedToSale) * 100,
        status: current.conversionRates.acceptedToSale > previous.conversionRates.acceptedToSale ? 'up' : current.conversionRates.acceptedToSale < previous.conversionRates.acceptedToSale ? 'down' : 'stable',
        severity: current.conversionRates.acceptedToSale < 15 ? 'critical' : current.conversionRates.acceptedToSale < 25 ? 'warning' : 'good'
      }
    ];
    
    return trendData;
  }, [filteredMetrics]);

  // Identify drop-off points
  const dropoffPoints = useMemo(() => {
    if (filteredMetrics.length === 0) return [];
    
    const latest = filteredMetrics[filteredMetrics.length - 1];
    const dropoffs: DropoffPoint[] = [];
    
    // View to Website conversion
    const viewToWebsite = (latest.websiteVisitors / latest.youtubeViews) * 100;
    if (viewToWebsite < 8) { // Expected: 8-15%
      dropoffs.push({
        stage: 'View → Website',
        fromStage: 'YouTube Views',
        conversionRate: viewToWebsite,
        expectedRate: 10,
        variance: viewToWebsite - 10,
        severity: viewToWebsite < 5 ? 'high' : viewToWebsite < 8 ? 'medium' : 'low'
      });
    }
    
    // Website to Call conversion
    const websiteToCall = (latest.callsBooked / latest.websiteVisitors) * 100;
    if (websiteToCall < 15) { // Expected: 15-25%
      dropoffs.push({
        stage: 'Website → Call',
        fromStage: 'Website Visitors',
        conversionRate: websiteToCall,
        expectedRate: 20,
        variance: websiteToCall - 20,
        severity: websiteToCall < 10 ? 'high' : websiteToCall < 15 ? 'medium' : 'low'
      });
    }
    
    // Call to Accepted conversion (Show-up rate)
    if (latest.showUpRate < 70) {
      dropoffs.push({
        stage: 'Call → Show-up',
        fromStage: 'Calls Booked',
        conversionRate: latest.showUpRate,
        expectedRate: 75,
        variance: latest.showUpRate - 75,
        severity: latest.showUpRate < 60 ? 'high' : latest.showUpRate < 70 ? 'medium' : 'low'
      });
    }
    
    // Accepted to Sale conversion
    if (latest.conversionRates.acceptedToSale < 20) {
      dropoffs.push({
        stage: 'Show → Close',
        fromStage: 'Calls Accepted',
        conversionRate: latest.conversionRates.acceptedToSale,
        expectedRate: 25,
        variance: latest.conversionRates.acceptedToSale - 25,
        severity: latest.conversionRates.acceptedToSale < 15 ? 'high' : latest.conversionRates.acceptedToSale < 20 ? 'medium' : 'low'
      });
    }
    
    return dropoffs.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }, [filteredMetrics]);

  // Get top performing videos this month
  const topVideos = useMemo(() => {
    return videos
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);
  }, [videos]);

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

  const getTrendIcon = (status: 'up' | 'down' | 'stable') => {
    switch (status) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-500" />;
    }
  };

  const getSeverityColor = (severity: 'good' | 'warning' | 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'good':
      case 'low':
        return 'text-green-600 border-green-500/50';
      case 'warning':
      case 'medium':
        return 'text-yellow-600 border-yellow-500/50';
      case 'critical':
      case 'high':
        return 'text-red-600 border-red-500/50';
      default:
        return 'text-gray-600 border-gray-500/50';
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
              <ChartBarIcon className="h-5 w-5 text-blue-500" />
              Trends & Performance Analysis
            </CardTitle>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Growth trends, comparisons, and drop-off analysis
            </p>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex gap-1">
            {[
              { key: '3m', label: 'Last 3M' },
              { key: '6m', label: 'Last 6M' },
              { key: 'all', label: 'All Time' },
            ].map((timeframe) => (
              <Button
                key={timeframe.key}
                variant={selectedTimeframe === timeframe.key ? 'default' : 'ghost'}
                size="sm"
                                  onClick={() => setSelectedTimeframe(timeframe.key as '3m' | '6m' | 'all')}
                className={`h-8 px-3 text-xs ${
                  selectedTimeframe === timeframe.key
                    ? theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className={`p-1 backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl w-full lg:w-auto ${
            theme === 'dark' ? 'bg-slate-800/30 hover:bg-slate-800/40' : 'bg-white/50 hover:bg-white/70'
          }`}>
            <TabsTrigger value="trends" className={`text-xs sm:text-sm px-3 py-2 ${
              theme === 'dark' 
                ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
            }`}>
              Growth Trends
            </TabsTrigger>
            <TabsTrigger value="dropoffs" className={`text-xs sm:text-sm px-3 py-2 ${
              theme === 'dark' 
                ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
            }`}>
              Drop-off Analysis
            </TabsTrigger>
            <TabsTrigger value="performers" className={`text-xs sm:text-sm px-3 py-2 ${
              theme === 'dark' 
                ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
            }`}>
              Top Performers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-6">
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Month-over-Month Growth
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trends.map((trend) => (
                  <div 
                    key={trend.metric}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-slate-800/30 border-slate-700/50' 
                        : 'bg-white/50 border-slate-200/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-medium ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {trend.metric}
                      </h4>
                      {getTrendIcon(trend.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                          Current:
                        </span>
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {trend.metric.includes('Rate') || trend.metric.includes('Close') || trend.metric.includes('Show-up') 
                            ? `${trend.current.toFixed(1)}%`
                            : trend.metric.includes('Revenue') 
                              ? formatCurrency(trend.current)
                              : formatNumber(trend.current)
                          }
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                          Change:
                        </span>
                        <Badge variant="outline" className={`text-xs ${
                          trend.status === 'up' 
                            ? 'border-green-500/50 text-green-600' 
                            : trend.status === 'down'
                              ? 'border-red-500/50 text-red-600'
                              : 'border-gray-500/50 text-gray-600'
                        }`}>
                          {trend.status === 'up' ? '+' : ''}
                          {trend.changePercent.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dropoffs" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Funnel Drop-off Points
                </h3>
              </div>
              
              {dropoffPoints.length > 0 ? (
                <div className="space-y-3">
                  {dropoffPoints.map((dropoff, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-2 border-dashed ${
                        theme === 'dark' 
                          ? 'bg-slate-800/20' 
                          : 'bg-white/30'
                      } ${getSeverityColor(dropoff.severity)}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`font-medium ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {dropoff.stage}
                        </h4>
                        <Badge variant="outline" className={getSeverityColor(dropoff.severity)}>
                          {dropoff.severity.toUpperCase()} PRIORITY
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                            Current Rate:
                          </span>
                          <div className="font-semibold text-red-600">
                            {dropoff.conversionRate.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                            Expected:
                          </span>
                          <div className="font-semibold text-green-600">
                            {dropoff.expectedRate.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                            Gap:
                          </span>
                          <div className="font-semibold text-red-600">
                            {dropoff.variance.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className={`mt-3 text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <strong>Recommendation:</strong> {' '}
                        {dropoff.stage.includes('View →') && 'Optimize video CTAs and landing page design to increase click-through rates.'}
                        {dropoff.stage.includes('Website →') && 'Improve landing page conversion with better value propositions and simplified booking process.'}
                        {dropoff.stage.includes('Call →') && 'Enhance booking confirmation process and send reminder sequences to reduce no-shows.'}
                        {dropoff.stage.includes('Show →') && 'Review sales process, objection handling, and value demonstration during calls.'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <div className="text-4xl mb-2">🎉</div>
                  <p>No significant drop-off points detected!</p>
                  <p className="text-sm mt-1">Your funnel is performing well across all stages.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="performers" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrophyIcon className="h-5 w-5 text-yellow-500" />
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Top Performing Videos
                </h3>
              </div>
              
              <div className="space-y-3">
                {topVideos.map((video, index) => (
                  <div 
                    key={video.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-slate-800/30 border-slate-700/50' 
                        : 'bg-white/50 border-slate-200/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs font-mono">
                        #{index + 1}
                      </Badge>
                      <PlayIcon className="h-4 w-4 text-red-500" />
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {video.title}
                        </h4>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {formatNumber(video.views)} views • {formatCurrency(video.revenue)} revenue
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {video.conversionRate.toFixed(1)}%
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Conversion
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 