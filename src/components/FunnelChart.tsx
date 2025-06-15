'use client';

import { MonthlyMetrics } from '@/types';

interface FunnelChartProps {
  data: MonthlyMetrics;
  className?: string;
}

export function FunnelChart({ data, className = '' }: FunnelChartProps) {
  const stages = [
    {
      label: 'YouTube Views',
      value: data.youtubeViews,
      color: 'from-cyan-500 to-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30',
      percentage: 100,
    },
    {
      label: 'Website Visitors',
      value: data.websiteVisitors,
      color: 'from-blue-500 to-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      percentage: (data.websiteVisitors / data.youtubeViews) * 100,
    },
    {
      label: 'Calls Booked',
      value: data.callsBooked,
      color: 'from-purple-500 to-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      percentage: (data.callsBooked / data.youtubeViews) * 100,
    },
    {
      label: 'Calls Accepted',
      value: data.callsAccepted,
      color: 'from-green-500 to-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      percentage: (data.callsAccepted / data.youtubeViews) * 100,
    },
    {
      label: 'Sales Closed',
      value: Math.floor(data.callsAccepted * (data.conversionRates.acceptedToSale / 100)),
      color: 'from-emerald-500 to-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      percentage: (data.callsAccepted * (data.conversionRates.acceptedToSale / 100) / data.youtubeViews) * 100,
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  return (
    <div className={`${className}`}>
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const width = Math.max(stage.percentage, 8); // Minimum 8% width for visibility
          
          return (
            <div key={stage.label} className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-200">{stage.label}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-slate-100">
                    {formatNumber(stage.value)}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
                    {stage.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="relative h-10 bg-slate-800/30 rounded-lg overflow-hidden border border-slate-700/50 backdrop-blur-sm">
                <div
                  className={`h-full bg-gradient-to-r ${stage.color} rounded-lg transition-all duration-500 flex items-center justify-center relative overflow-hidden`}
                  style={{ width: `${width}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  <span className="text-white text-xs font-medium relative z-10">
                    {stage.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {index < stages.length - 1 && (
                <div className="flex justify-center mt-3">
                  <div className="w-px h-6 bg-gradient-to-b from-slate-600 to-slate-700"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Overall Conversion</span>
              <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
            </div>
            <div className="text-xl font-bold text-slate-100 mt-2">
              {((stages[4].value / stages[0].value) * 100).toFixed(3)}%
            </div>
            <div className="text-xs text-slate-500 mt-1">View → Sale Rate</div>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Revenue Per View</span>
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
            </div>
            <div className="text-xl font-bold text-slate-100 mt-2">
              ${((stages[4].value * 2250) / stages[0].value).toFixed(3)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Average Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
} 