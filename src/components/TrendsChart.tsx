'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyMetrics } from '@/types';

interface TrendsChartProps {
  data: MonthlyMetrics[];
  metric: 'revenue' | 'views' | 'calls' | 'conversions';
  className?: string;
}

export function TrendsChart({ data, metric, className = '' }: TrendsChartProps) {
  const formatMonth = (month: string) => {
    return new Date(month + '-01').toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const chartData = data.map(item => ({
    month: formatMonth(item.month),
    revenue: item.newCashCollected.total,
    views: item.youtubeViews,
    calls: item.callsBooked,
    conversions: item.conversionRates.acceptedToSale,
    youtubeViews: item.youtubeViews,
    youtubeUniqueViews: item.youtubeUniqueViews,
    callsBooked: item.callsBooked,
    callsAccepted: item.callsAccepted,
    totalCashCollected: item.totalCashCollected,
    conversionRates: item.conversionRates,
  }));

  const getChartConfig = () => {
    switch (metric) {
      case 'revenue':
        return {
          title: 'Revenue Trends',
          lines: [
            { key: 'revenue', color: '#06B6D4', name: 'New Revenue' },
            { key: 'totalCashCollected', color: '#A855F7', name: 'Total Revenue' },
          ],
          yAxisFormatter: (value: number) => `$${value.toLocaleString()}`,
        };
      case 'views':
        return {
          title: 'YouTube Performance',
          lines: [
            { key: 'youtubeViews', color: '#3B82F6', name: 'Total Views' },
            { key: 'youtubeUniqueViews', color: '#10B981', name: 'Unique Views' },
          ],
          yAxisFormatter: (value: number) => value.toLocaleString(),
        };
      case 'calls':
        return {
          title: 'Call Metrics',
          lines: [
            { key: 'callsBooked', color: '#8B5CF6', name: 'Calls Booked' },
            { key: 'callsAccepted', color: '#06B6D4', name: 'Calls Accepted' },
          ],
          yAxisFormatter: (value: number) => value.toLocaleString(),
        };
      case 'conversions':
        return {
          title: 'Conversion Rates',
          lines: [
            { key: 'conversionRates.viewToWebsite', color: '#F59E0B', name: 'View → Website' },
            { key: 'conversionRates.websiteToCall', color: '#EF4444', name: 'Website → Call' },
            { key: 'conversionRates.acceptedToSale', color: '#10B981', name: 'Call → Sale' },
          ],
          yAxisFormatter: (value: number) => `${value.toFixed(1)}%`,
        };
      default:
        return { title: '', lines: [], yAxisFormatter: (value: number) => value.toString() };
    }
  };

  const config = getChartConfig();

  const getValue = (item: Record<string, unknown>, key: string) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      return (item[parent] as Record<string, unknown>)?.[child];
    }
    return item[key];
  };

  return (
    <div className={`bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-100">{config.title}</h3>
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8"
              fontSize={12}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={config.yAxisFormatter}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(16px)',
                color: '#e2e8f0',
              }}
              labelStyle={{ color: '#cbd5e1' }}
              formatter={(value: number, name: string) => [
                <span key={name} style={{ color: '#f1f5f9' }}>{config.yAxisFormatter(value)}</span>,
                <span key={`${name}-label`} style={{ color: '#94a3b8' }}>{name}</span>
              ]}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                color: '#94a3b8'
              }}
            />
            {config.lines.map((line, index) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={(item) => getValue(item, line.key)}
                stroke={line.color}
                strokeWidth={3}
                dot={{ 
                  fill: line.color, 
                  strokeWidth: 2, 
                  r: 5,
                  stroke: '#0f172a'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: line.color, 
                  strokeWidth: 3,
                  fill: line.color,
                  filter: 'drop-shadow(0 0 6px currentColor)'
                }}
                name={line.name}
                filter={`drop-shadow(0 0 4px ${line.color}50)`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 