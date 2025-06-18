'use client';

import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyMetrics } from '@/types';
import { useState } from 'react';
import { Eye, Users, TrendingUp, BarChart3 } from 'lucide-react';

interface TrafficChartProps {
  data: MonthlyMetrics[];
  className?: string;
  theme?: string;
}

export function TrafficChart({ data, className = '', theme }: TrafficChartProps) {
  const [activeMetric, setActiveMetric] = useState<'views' | 'visitors' | 'both'>('both');
  const [hoveredData, setHoveredData] = useState<{
    month: string;
    youtubeViews: number;
    websiteVisitors: number;
    conversionRate: number;
  } | null>(null);

  const formatMonth = (month: string) => {
    return new Date(month + '-01').toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const chartData = data.map(item => ({
    month: formatMonth(item.month),
    youtubeViews: item.youtubeViews,
    websiteVisitors: item.websiteVisitors,
    conversionRate: (item.websiteVisitors / item.youtubeViews) * 100,
    uniqueViews: item.youtubeUniqueViews,
  }));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const totalViews = chartData.reduce((sum, item) => sum + item.youtubeViews, 0);
  const totalVisitors = chartData.reduce((sum, item) => sum + item.websiteVisitors, 0);
  const avgConversion = (totalVisitors / totalViews) * 100;

  const MetricButton = ({ 
    metric, 
    icon: Icon, 
    label, 
    value, 
    change, 
    active 
  }: {
    metric: 'views' | 'visitors' | 'both';
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    change: string;
    active: boolean;
  }) => (
    <button
      onClick={() => setActiveMetric(metric)}
      className={`flex-1 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
        active
          ? theme === 'dark'
            ? 'bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
            : 'bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40'
          : theme === 'dark'
          ? 'bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600/60'
          : 'bg-white/30 border border-slate-300/50 hover:bg-white/60 hover:border-slate-400/60'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-5 w-5 ${
          active 
            ? 'text-cyan-400' 
            : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`} />
        <span className={`text-xs px-2 py-1 rounded-full ${
          change.startsWith('+') 
            ? theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'
            : theme === 'dark' ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'
        }`}>
          {change}
        </span>
      </div>
              <div className={`text-xs sm:text-sm font-medium mb-1 ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {label}
        </div>
        <div className={`text-lg sm:text-xl font-bold ${
        active 
          ? 'text-cyan-400' 
          : theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
      }`}>
        {value}
      </div>
    </button>
  );

  return (
    <div className={`${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <MetricButton
          metric="views"
          icon={Eye}
          label="YouTube Views"
          value={formatNumber(totalViews)}
          change="+12.5%"
          active={activeMetric === 'views'}
        />
        <MetricButton
          metric="visitors"
          icon={Users}
          label="Website Visitors"
          value={formatNumber(totalVisitors)}
          change="+8.3%"
          active={activeMetric === 'visitors'}
        />
        <MetricButton
          metric="both"
          icon={TrendingUp}
          label="Conversion Rate"
          value={`${avgConversion.toFixed(1)}%`}
          change="+2.1%"
          active={activeMetric === 'both'}
        />
      </div>

      {/* Chart */}
      <div className={`h-64 sm:h-80 w-full rounded-xl p-3 sm:p-4 backdrop-blur-xl transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900/30 border border-slate-700/50' 
          : 'bg-white/30 border border-slate-200/50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold flex items-center ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            <BarChart3 className="mr-2 h-5 w-5 text-cyan-500" />
            Traffic & Engagement Trends
          </h3>
          <div className="flex items-center space-x-4">
            {hoveredData && (
              <div className={`text-xs sm:text-sm px-3 py-2 rounded-lg shadow-lg backdrop-blur-md border animate-fade-in ${
                theme === 'dark' 
                  ? 'bg-slate-800/90 text-slate-100 border-slate-700/50' 
                  : 'bg-white/90 text-slate-900 border-slate-200/50'
              }`}>
                <div className="font-semibold text-cyan-500">{hoveredData.month}</div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    {formatNumber(hoveredData.youtubeViews)} views
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {formatNumber(hoveredData.websiteVisitors)} visitors
                  </span>
                </div>
                <div className="text-xs text-orange-500 mt-1">
                  {hoveredData.conversionRate.toFixed(1)}% conversion
                </div>
              </div>
            )}
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            margin={{ top: 20, right: 50, left: 70, bottom: 60 }}
            onMouseMove={(data) => {
              if (data.activePayload) {
                setHoveredData(data.activePayload[0]?.payload);
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? '#475569' : '#cbd5e1'} 
              opacity={0.3} 
            />
            <XAxis 
              dataKey="month" 
              stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
              fontSize={12}
              axisLine={{ stroke: theme === 'dark' ? '#475569' : '#cbd5e1' }}
              tickLine={{ stroke: theme === 'dark' ? '#475569' : '#cbd5e1' }}
              tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
              height={60}
            />
            <YAxis 
              yAxisId="left"
              stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
              fontSize={12}
              tickFormatter={formatNumber}
              axisLine={{ stroke: theme === 'dark' ? '#475569' : '#cbd5e1' }}
              tickLine={{ stroke: theme === 'dark' ? '#475569' : '#cbd5e1' }}
              tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
              width={70}
              label={{ 
                value: 'Views & Visitors', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: theme === 'dark' ? '#94a3b8' : '#64748b' }
              }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
              fontSize={12}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
              axisLine={{ stroke: theme === 'dark' ? '#475569' : '#cbd5e1' }}
              tickLine={{ stroke: theme === 'dark' ? '#475569' : '#cbd5e1' }}
              tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
              width={50}
              label={{ 
                value: 'Conversion %', 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: theme === 'dark' ? '#94a3b8' : '#64748b' }
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                border: theme === 'dark' ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid rgba(203, 213, 225, 0.5)',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(16px)',
                color: theme === 'dark' ? '#e2e8f0' : '#334155',
              }}
              labelStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#64748b' }}
              formatter={(value: number, name: string) => [
                <span key={name} style={{ color: theme === 'dark' ? '#f1f5f9' : '#0f172a', fontWeight: 'bold' }}>
                  {name === 'conversionRate' ? `${value.toFixed(1)}%` : formatNumber(value)}
                </span>,
                <span key={`${name}-label`} style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  {name === 'youtubeViews' ? 'YouTube Views' : 
                   name === 'websiteVisitors' ? 'Website Visitors' : 
                   'Conversion Rate'}
                </span>
              ]}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                color: theme === 'dark' ? '#94a3b8' : '#64748b'
              }}
              height={36}
            />
            
            {(activeMetric === 'views' || activeMetric === 'both') && (
              <Bar 
                yAxisId="left"
                dataKey="youtubeViews" 
                fill="url(#youtubeGradient)" 
                name="YouTube Views"
                radius={[4, 4, 0, 0]}
                opacity={activeMetric === 'views' ? 1 : 0.7}
              />
            )}
            
            {(activeMetric === 'visitors' || activeMetric === 'both') && (
              <Bar 
                yAxisId="left"
                dataKey="websiteVisitors" 
                fill="url(#visitorsGradient)" 
                name="Website Visitors"
                radius={[4, 4, 0, 0]}
                opacity={activeMetric === 'visitors' ? 1 : 0.7}
              />
            )}
            
            {activeMetric === 'both' && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversionRate"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ 
                  fill: '#F59E0B', 
                  strokeWidth: 2, 
                  r: 5,
                  stroke: theme === 'dark' ? '#0f172a' : '#ffffff'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#F59E0B', 
                  strokeWidth: 3,
                  fill: '#F59E0B',
                  filter: 'drop-shadow(0 0 6px #F59E0B)'
                }}
                name="Conversion Rate"
              />
            )}
            
            <defs>
              <linearGradient id="youtubeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        <div className={`p-3 sm:p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/40' 
            : 'bg-white/30 border-slate-200/50 hover:bg-white/50'
        }`}>
          <div className={`text-xs sm:text-sm font-medium ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Avg. Monthly Views
          </div>
          <div className={`text-lg sm:text-xl font-bold ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          }`}>
            {formatNumber(totalViews / chartData.length)}
          </div>
        </div>
        
        <div className={`p-3 sm:p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/40' 
            : 'bg-white/30 border-slate-200/50 hover:bg-white/50'
        }`}>
          <div className={`text-xs sm:text-sm font-medium ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Avg. Monthly Visitors
          </div>
          <div className={`text-lg sm:text-xl font-bold ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {formatNumber(totalVisitors / chartData.length)}
          </div>
        </div>
        
        <div className={`p-3 sm:p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/40' 
            : 'bg-white/30 border-slate-200/50 hover:bg-white/50'
        }`}>
          <div className={`text-xs sm:text-sm font-medium ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Best Month
          </div>
          <div className={`text-lg sm:text-xl font-bold ${
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`}>
            {chartData.reduce((best, current) => 
              current.youtubeViews > best.youtubeViews ? current : best
            ).month}
          </div>
        </div>
        
        <div className={`p-3 sm:p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/40' 
            : 'bg-white/30 border-slate-200/50 hover:bg-white/50'
        }`}>
          <div className={`text-xs sm:text-sm font-medium ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Growth Trend
          </div>
          <div className={`text-lg sm:text-xl font-bold ${
            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
          }`}>
            +15.2%
          </div>
        </div>
      </div>
    </div>
  );
} 