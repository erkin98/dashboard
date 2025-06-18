'use client';

import { useState } from 'react';
import { MonthlyMetrics, YouTubeVideo, Sale } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRightIcon,
  PlayIcon,
  UsersIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface DetailedFunnelOverviewProps {
  monthlyMetrics: MonthlyMetrics[];
  videos: YouTubeVideo[];
  sales: Sale[];
  theme?: 'dark' | 'light';
}

interface FunnelStage {
  name: string;
  value: number;
  conversion?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function DetailedFunnelOverview({ 
  monthlyMetrics, 
  sales, 
  theme = 'dark' 
}: DetailedFunnelOverviewProps) {
  const [selectedMonth, setSelectedMonth] = useState(monthlyMetrics.length - 1);
  
  const currentMonth = monthlyMetrics[selectedMonth];
  
  if (!currentMonth) return null;

  // Calculate detailed funnel stages
  const funnelStages: FunnelStage[] = [
    {
      name: 'YouTube Views',
      value: currentMonth.youtubeViews,
      icon: PlayIcon,
      color: 'red'
    },
    {
      name: 'Website Visitors', 
      value: currentMonth.websiteVisitors,
      conversion: (currentMonth.websiteVisitors / currentMonth.youtubeViews) * 100,
      icon: UsersIcon,
      color: 'blue'
    },
    {
      name: 'Calls Booked',
      value: currentMonth.callsBooked,
      conversion: (currentMonth.callsBooked / currentMonth.websiteVisitors) * 100,
      icon: PhoneIcon,
      color: 'cyan'
    },
    {
      name: 'Calls Accepted',
      value: currentMonth.callsAccepted,
      conversion: (currentMonth.callsAccepted / currentMonth.callsBooked) * 100,
      icon: TrophyIcon,
      color: 'green'
    },
    {
      name: 'Sales Closed',
      value: Math.round(currentMonth.conversionRates.acceptedToSale * currentMonth.callsAccepted / 100),
      conversion: currentMonth.conversionRates.acceptedToSale,
      icon: CurrencyDollarIcon,
      color: 'purple'
    }
  ];

  // Calculate revenue breakdown
  const revenueBreakdown = {
    fullPay: currentMonth.newCashCollected.paidInFull,
    installments: currentMonth.newCashCollected.installments,
    total: currentMonth.newCashCollected.total
  };

  // Get products from sales data for current month
  const currentMonthSales = sales.filter(sale => {
    const saleMonth = new Date(sale.closedAt).toISOString().slice(0, 7);
    return saleMonth === currentMonth.month;
  });

  const productBreakdown = currentMonthSales.reduce((acc, sale) => {
    acc[sale.product] = (acc[sale.product] || 0) + sale.amount;
    return acc;
  }, {} as Record<string, number>);

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

  const getStageColor = (color: string) => {
    const colors = {
      red: theme === 'dark' ? 'text-red-400' : 'text-red-600',
      blue: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      cyan: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
      green: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      purple: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBgColor = (color: string) => {
    const colors = {
      red: theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50',
      blue: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50',
      cyan: theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50',
      green: theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
      purple: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50',
    };
    return colors[color as keyof typeof colors] || colors.blue;
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
              <TrophyIcon className="h-5 w-5 text-purple-500" />
              Detailed Funnel Overview
            </CardTitle>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Complete conversion funnel with revenue breakdown
            </p>
          </div>
          
          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <CalendarIcon className={`h-4 w-4 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`} />
            <div className="flex gap-1">
              {monthlyMetrics.slice(-6).map((month, index) => {
                const actualIndex = monthlyMetrics.length - 6 + index;
                return (
                  <Button
                    key={month.month}
                    variant={selectedMonth === actualIndex ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedMonth(actualIndex)}
                    className={`h-8 px-3 text-xs ${
                      selectedMonth === actualIndex
                        ? theme === 'dark'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                        : theme === 'dark'
                          ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                      month: 'short' 
                    })}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Funnel Visualization */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Conversion Funnel - {new Date(currentMonth.month + '-01').toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          
          <div className="grid gap-4">
            {funnelStages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.name} className="flex items-center gap-4">
                  {/* Stage Card */}
                  <div className={`flex-1 p-4 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-slate-800/30 border-slate-700/50' 
                      : 'bg-white/50 border-slate-200/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getBgColor(stage.color)}`}>
                          <Icon className={`h-5 w-5 ${getStageColor(stage.color)}`} />
                        </div>
                        <div>
                          <h4 className={`font-medium ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            {stage.name}
                          </h4>
                          <p className={`text-2xl font-bold ${getStageColor(stage.color)}`}>
                            {formatNumber(stage.value)}
                          </p>
                        </div>
                      </div>
                      
                      {stage.conversion && (
                        <div className="text-right">
                          <Badge variant="outline" className={`${
                            stage.conversion > 15 
                              ? 'border-green-500/50 text-green-600' 
                              : stage.conversion > 5 
                                ? 'border-yellow-500/50 text-yellow-600'
                                : 'border-red-500/50 text-red-600'
                          }`}>
                            {stage.conversion.toFixed(1)}% conversion
                          </Badge>
                          <div className="mt-2">
                            <Progress 
                              value={Math.min(stage.conversion, 100)} 
                              className="w-20 h-2"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  {index < funnelStages.length - 1 && (
                    <ArrowRightIcon className={`h-6 w-6 ${
                      theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Type Breakdown */}
          <div className={`p-4 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-slate-800/30 border-slate-700/50' 
              : 'bg-white/50 border-slate-200/50'
          }`}>
            <h4 className={`font-semibold mb-3 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Revenue by Payment Type
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                  Paid in Full
                </span>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    {formatCurrency(revenueBreakdown.fullPay)}
                  </div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {((revenueBreakdown.fullPay / revenueBreakdown.total) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                  Installments
                </span>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">
                    {formatCurrency(revenueBreakdown.installments)}
                  </div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {((revenueBreakdown.installments / revenueBreakdown.total) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className={`pt-2 border-t ${
                theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Total New Revenue
                  </span>
                  <div className="font-bold text-purple-600">
                    {formatCurrency(revenueBreakdown.total)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Breakdown */}
          <div className={`p-4 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-slate-800/30 border-slate-700/50' 
              : 'bg-white/50 border-slate-200/50'
          }`}>
            <h4 className={`font-semibold mb-3 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Revenue by Product
            </h4>
            {Object.keys(productBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(productBreakdown).map(([product, revenue]) => (
                  <div key={product} className="flex justify-between items-center">
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                      {product}
                    </span>
                    <div className="text-right">
                      <div className="font-semibold text-cyan-600">
                        {formatCurrency(revenue)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {((revenue / revenueBreakdown.total) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-4 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                No product sales data for this month
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white/50 border-slate-200/50'
        }`}>
          <h4 className={`font-semibold mb-3 ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Key Performance Indicators
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {currentMonth.showUpRate.toFixed(1)}%
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Show-up Rate
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {currentMonth.conversionRates.acceptedToSale.toFixed(1)}%
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Close Rate
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {formatCurrency(revenueBreakdown.total / currentMonth.callsAccepted || 0)}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Revenue per Call
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {(revenueBreakdown.total / currentMonth.youtubeViews * 1000).toFixed(2)}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Revenue per 1K Views
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 