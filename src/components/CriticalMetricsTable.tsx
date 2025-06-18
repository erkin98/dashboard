'use client';

import { useState } from 'react';
import { MonthlyMetrics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CalendarIcon,
  FunnelIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

interface CriticalMetricsTableProps {
  data: MonthlyMetrics[];
  theme?: 'dark' | 'light';
}

export function CriticalMetricsTable({ data, theme = 'dark' }: CriticalMetricsTableProps) {
  const [timeFilter, setTimeFilter] = useState<'all' | 'last3' | 'last6' | 'current'>('all');
  
  // Filter data based on selection
  const getFilteredData = () => {
    switch (timeFilter) {
      case 'last3':
        return data.slice(-3);
      case 'last6':
        return data.slice(-6);
      case 'current':
        return data.slice(-1);
      default:
        return data;
    }
  };
  
  const filteredData = getFilteredData();
  
  // Calculate month-over-month changes
  const getMonthOverMonthChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  // Find record highs
  const findRecordHighs = () => {
    const metrics = {
      youtubeViews: Math.max(...data.map(d => d.youtubeViews)),
      websiteVisitors: Math.max(...data.map(d => d.websiteVisitors)),
      callsBooked: Math.max(...data.map(d => d.callsBooked)),
      newCashTotal: Math.max(...data.map(d => d.newCashCollected.total)),
      totalCash: Math.max(...data.map(d => d.totalCashCollected)),
    };
    return metrics;
  };
  
  const recordHighs = findRecordHighs();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  // Get trend indicator
  const getTrendIndicator = (change: number) => {
    if (change > 0) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    }
    return <div className="h-4 w-4 rounded-full bg-gray-500" />;
  };
  
  // Check if value is a record high
  const isRecordHigh = (value: number, metric: keyof typeof recordHighs) => {
    return value === recordHighs[metric];
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
              <CalendarIcon className="h-5 w-5 text-cyan-500" />
              Critical Monthly Metrics
            </CardTitle>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Foundation metrics from YouTube → Kajabi → Cal.com integrations
            </p>
          </div>
          
          {/* Time Filter Controls */}
          <div className="flex items-center gap-2">
            <FunnelIcon className={`h-4 w-4 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`} />
            <div className="flex gap-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'last6', label: 'Last 6M' },
                { key: 'last3', label: 'Last 3M' },
                { key: 'current', label: 'Current' },
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={timeFilter === filter.key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeFilter(filter.key as 'all' | 'last3' | 'last6' | 'current')}
                  className={`h-8 px-3 text-xs ${
                    timeFilter === filter.key
                      ? theme === 'dark'
                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : theme === 'dark'
                        ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <th className={`text-left py-3 px-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>Month</th>
                <th className={`text-right py-3 px-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>YouTube Views</th>
                <th className={`text-right py-3 px-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>Unique Views</th>
                <th className={`text-right py-3 px-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>Website Visitors</th>
                <th className={`text-right py-3 px-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>Calls Booked</th>
                <th className={`text-right py-3 px-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>Accepted</th>
                <th className={`text-right py-3 px-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>New Cash</th>
                <th className={`text-right py-3 px-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>Total Cash</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((month, index) => {
                const prevMonth = index > 0 ? filteredData[index - 1] : null;
                
                // Calculate changes
                const changes = {
                  youtubeViews: prevMonth ? getMonthOverMonthChange(month.youtubeViews, prevMonth.youtubeViews) : 0,
                  websiteVisitors: prevMonth ? getMonthOverMonthChange(month.websiteVisitors, prevMonth.websiteVisitors) : 0,
                  callsBooked: prevMonth ? getMonthOverMonthChange(month.callsBooked, prevMonth.callsBooked) : 0,
                  newCash: prevMonth ? getMonthOverMonthChange(month.newCashCollected.total, prevMonth.newCashCollected.total) : 0,
                  totalCash: prevMonth ? getMonthOverMonthChange(month.totalCashCollected, prevMonth.totalCashCollected) : 0,
                };
                
                return (
                  <tr 
                    key={month.month}
                    className={`border-b transition-colors hover:bg-opacity-50 ${
                      theme === 'dark' 
                        ? 'border-slate-800 hover:bg-slate-800' 
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {/* Month */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                        {index === filteredData.length - 1 && (
                          <Badge variant="outline" className="text-xs">Latest</Badge>
                        )}
                      </div>
                    </td>
                    
                    {/* YouTube Views */}
                    <td className="py-4 px-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          {isRecordHigh(month.youtubeViews, 'youtubeViews') && (
                            <TrophyIcon className="h-3 w-3 text-yellow-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            {formatNumber(month.youtubeViews)}
                          </span>
                        </div>
                        {prevMonth && (
                          <div className="flex items-center gap-1">
                            {getTrendIndicator(changes.youtubeViews)}
                            <span className={`text-xs ${
                              changes.youtubeViews > 0 
                                ? 'text-green-500' 
                                : changes.youtubeViews < 0 
                                  ? 'text-red-500' 
                                  : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {changes.youtubeViews > 0 ? '+' : ''}{changes.youtubeViews.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Unique Views */}
                    <td className="py-4 px-2 text-right">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {formatNumber(month.youtubeUniqueViews)}
                      </span>
                    </td>
                    
                    {/* Website Visitors */}
                    <td className="py-4 px-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          {isRecordHigh(month.websiteVisitors, 'websiteVisitors') && (
                            <TrophyIcon className="h-3 w-3 text-yellow-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            {formatNumber(month.websiteVisitors)}
                          </span>
                        </div>
                        {prevMonth && (
                          <div className="flex items-center gap-1">
                            {getTrendIndicator(changes.websiteVisitors)}
                            <span className={`text-xs ${
                              changes.websiteVisitors > 0 
                                ? 'text-green-500' 
                                : changes.websiteVisitors < 0 
                                  ? 'text-red-500' 
                                  : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {changes.websiteVisitors > 0 ? '+' : ''}{changes.websiteVisitors.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Calls Booked */}
                    <td className="py-4 px-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          {isRecordHigh(month.callsBooked, 'callsBooked') && (
                            <TrophyIcon className="h-3 w-3 text-yellow-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            {formatNumber(month.callsBooked)}
                          </span>
                        </div>
                        {prevMonth && (
                          <div className="flex items-center gap-1">
                            {getTrendIndicator(changes.callsBooked)}
                            <span className={`text-xs ${
                              changes.callsBooked > 0 
                                ? 'text-green-500' 
                                : changes.callsBooked < 0 
                                  ? 'text-red-500' 
                                  : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {changes.callsBooked > 0 ? '+' : ''}{changes.callsBooked.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Accepted Calls */}
                    <td className="py-4 px-2 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {formatNumber(month.callsAccepted)}
                        </span>
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {((month.callsAccepted / month.callsBooked) * 100).toFixed(1)}% show
                        </span>
                      </div>
                    </td>
                    
                    {/* New Cash Collected */}
                    <td className="py-4 px-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          {isRecordHigh(month.newCashCollected.total, 'newCashTotal') && (
                            <TrophyIcon className="h-3 w-3 text-yellow-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            {formatCurrency(month.newCashCollected.total)}
                          </span>
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          PIF: {formatCurrency(month.newCashCollected.paidInFull)}
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Install: {formatCurrency(month.newCashCollected.installments)}
                        </div>
                        {prevMonth && (
                          <div className="flex items-center gap-1">
                            {getTrendIndicator(changes.newCash)}
                            <span className={`text-xs ${
                              changes.newCash > 0 
                                ? 'text-green-500' 
                                : changes.newCash < 0 
                                  ? 'text-red-500' 
                                  : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {changes.newCash > 0 ? '+' : ''}{changes.newCash.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Total Cash Collected */}
                    <td className="py-4 px-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          {isRecordHigh(month.totalCashCollected, 'totalCash') && (
                            <TrophyIcon className="h-3 w-3 text-yellow-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            {formatCurrency(month.totalCashCollected)}
                          </span>
                        </div>
                        {prevMonth && (
                          <div className="flex items-center gap-1">
                            {getTrendIndicator(changes.totalCash)}
                            <span className={`text-xs ${
                              changes.totalCash > 0 
                                ? 'text-green-500' 
                                : changes.totalCash < 0 
                                  ? 'text-red-500' 
                                  : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {changes.totalCash > 0 ? '+' : ''}{changes.totalCash.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Summary Stats */}
        <div className={`mt-6 p-4 rounded-lg border ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-slate-50/50 border-slate-200/50'
        }`}>
          <h4 className={`text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Period Summary ({filteredData.length} months)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                Total YouTube Views:
              </span>
              <div className={`font-medium ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {formatNumber(filteredData.reduce((sum, m) => sum + m.youtubeViews, 0))}
              </div>
            </div>
            <div>
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                Total Calls Booked:
              </span>
              <div className={`font-medium ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {formatNumber(filteredData.reduce((sum, m) => sum + m.callsBooked, 0))}
              </div>
            </div>
            <div>
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                Total New Cash:
              </span>
              <div className={`font-medium ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {formatCurrency(filteredData.reduce((sum, m) => sum + m.newCashCollected.total, 0))}
              </div>
            </div>
            <div>
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                Avg Conversion:
              </span>
              <div className={`font-medium ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {(filteredData.reduce((sum, m) => sum + m.conversionRates.acceptedToSale, 0) / filteredData.length).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 