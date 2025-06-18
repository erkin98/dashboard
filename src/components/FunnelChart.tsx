'use client';

import { MonthlyMetrics } from '@/types';
import { useState } from 'react';
import { Eye, Users, Phone, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';

interface FunnelChartProps {
  data: MonthlyMetrics;
  className?: string;
  theme?: string;
  onStageClick?: (stage: string, data: { value: number; conversion?: number }) => void;
}

export function FunnelChart({ data, className = '', theme, onStageClick }: FunnelChartProps) {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  const stages = [
    {
      label: 'YouTube Views',
      value: data.youtubeViews,
      color: 'from-cyan-500 to-cyan-400',
      percentage: 100,
      icon: Eye,
      description: 'Total video views across all content',
      highlight: true,
    },
    {
      label: 'Website Visitors',
      value: data.websiteVisitors,
      color: 'from-blue-500 to-blue-400',
      percentage: (data.websiteVisitors / data.youtubeViews) * 100,
      icon: Users,
      description: 'Visitors who clicked through to website',
      highlight: true,
    },
    {
      label: 'Calls Booked',
      value: data.callsBooked,
      color: 'from-purple-500 to-purple-400',
      percentage: (data.callsBooked / data.youtubeViews) * 100,
      icon: Phone,
      description: 'Discovery calls scheduled',
      highlight: false,
    },
    {
      label: 'Calls Accepted',
      value: data.callsAccepted,
      color: 'from-green-500 to-green-400',
      percentage: (data.callsAccepted / data.youtubeViews) * 100,
      icon: CheckCircle,
      description: 'Calls that were attended',
      highlight: false,
    },
    {
      label: 'Sales Closed',
      value: Math.floor(data.callsAccepted * (data.conversionRates.acceptedToSale / 100)),
      color: 'from-emerald-500 to-emerald-400',
      percentage: (data.callsAccepted * (data.conversionRates.acceptedToSale / 100) / data.youtubeViews) * 100,
      icon: DollarSign,
      description: 'Successful conversions to sales',
      highlight: false,
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  return (
    <div className={`${className} relative min-h-[600px] w-full`}>
      {/* Theme-aware background design */}
      <div className={`absolute inset-0 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800/30 to-slate-700/20' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20'
      }`}></div>
      
      {/* Responsive geometric patterns */}
      <div className="absolute inset-0 opacity-[0.02] overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-36 h-36 md:w-72 md:h-72 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-3xl transform translate-y-1/2"></div>
      </div>
      
      {/* Theme-aware grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, ${
          theme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'
        } 2px, transparent 0)`,
        backgroundSize: '25px 25px md:50px md:50px'
      }}></div>
      
      {/* Theme-aware content container with responsive padding */}
      <div className={`relative z-10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl mx-auto max-w-none ${
        theme === 'dark'
          ? 'bg-slate-900/40 border border-slate-700/60'
          : 'bg-white/40 border border-white/60'
      }`}>
        {/* Responsive decorative elements */}
        <div className="absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 md:w-24 md:h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
        
        {/* Funnel stages with responsive spacing */}
        <div className="relative space-y-4 md:space-y-6">
          {stages.map((stage, index) => {
            const width = Math.max(stage.percentage, 12); // Increased minimum width for mobile
            const isHovered = hoveredStage === index;
            const Icon = stage.icon;
            const isHighlighted = stage.highlight;
            
            return (
              <div 
                key={stage.label} 
                className={`group transition-all duration-300 ${
                  isHovered ? 'scale-[1.02] md:scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredStage(index)}
                onMouseLeave={() => setHoveredStage(null)}
                onClick={() => onStageClick?.(stage.label, { value: stage.value, conversion: stage.percentage })}
              >
                {/* Responsive stage header */}
                <div className="flex items-start sm:items-center justify-between mb-2 sm:mb-3 gap-2">
                  <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg flex-shrink-0 ${
                      isHighlighted
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-cyan-500/25'
                        : theme === 'dark'
                        ? 'bg-slate-800/80 text-slate-300 shadow-slate-900/50 group-hover:bg-slate-700/90 group-hover:shadow-slate-800/50'
                        : 'bg-white/80 text-slate-600 shadow-slate-200/50 group-hover:bg-white/90 group-hover:shadow-slate-300/50'
                    }`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-sm sm:text-base md:text-lg transition-colors truncate ${
                        isHighlighted 
                          ? 'text-cyan-400'
                          : theme === 'dark'
                          ? 'text-slate-100'
                          : 'text-slate-800'
                      }`}>
                        {stage.label}
                      </h3>
                      {isHovered && (
                        <p className={`text-xs sm:text-sm animate-fade-in mt-1 hidden sm:block ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {stage.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`font-bold text-sm sm:text-lg md:text-xl ${
                      isHighlighted 
                        ? 'text-cyan-400'
                        : theme === 'dark'
                        ? 'text-slate-100'
                        : 'text-slate-800'
                    }`}>
                      {formatNumber(stage.value)}
                    </div>
                    <div className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold whitespace-nowrap ${
                      isHighlighted
                        ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                        : theme === 'dark'
                        ? 'bg-slate-700 text-slate-300 border border-slate-600'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {stage.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                {/* Responsive progress bar */}
                <div className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 shadow-inner ${
                  isHovered ? 'h-10 sm:h-12 md:h-14 shadow-lg' : 'h-8 sm:h-10'
                } ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600/50'
                    : 'bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200/50'
                }`}>
                  <div
                    className={`h-full bg-gradient-to-r ${stage.color} relative transition-all duration-500 flex items-center justify-end pr-2 sm:pr-4 shadow-lg ${
                      isHovered ? 'brightness-110 shadow-xl' : ''
                    }`}
                    style={{ width: `${width}%` }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    
                    <div className="relative flex items-center space-x-1 sm:space-x-2 text-white">
                      <span className={`font-bold transition-all duration-300 text-xs sm:text-sm ${
                        isHovered ? 'sm:text-base' : ''
                      }`}>
                        {stage.percentage.toFixed(1)}%
                      </span>
                      {isHighlighted && (
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Responsive connection line */}
                {index < stages.length - 1 && (
                  <div className="flex justify-center my-3 sm:my-4 md:my-6">
                    <div className={`w-0.5 h-4 sm:h-6 md:h-8 transition-all duration-300 rounded-full ${
                      isHovered 
                        ? 'bg-gradient-to-b from-cyan-500 to-blue-500 h-6 sm:h-8 md:h-10 shadow-lg' 
                        : theme === 'dark'
                        ? 'bg-gradient-to-b from-slate-600 to-slate-700'
                        : 'bg-gradient-to-b from-slate-300 to-slate-400'
                    }`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Responsive summary stats */}
        <div className={`mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6 md:pt-8 relative ${
          theme === 'dark' 
            ? 'border-t border-slate-600/60' 
            : 'border-t border-slate-200/60'
        }`}>
          {/* Decorative line accent */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-px w-12 sm:w-16 md:w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Overall Conversion */}
            <div className={`rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60'
                : 'bg-white/70 hover:bg-white/80 border border-white/60'
            }`}>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className={`text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Overall Conversion
                </span>
                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg animate-pulse"></div>
              </div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
              }`}>
                {((stages[4].value / stages[0].value) * 100).toFixed(2)}%
              </div>
              <div className={`text-xs font-medium ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                View → Sale Rate
              </div>
            </div>
            
            {/* Revenue Per View */}
            <div className={`rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60'
                : 'bg-white/70 hover:bg-white/80 border border-white/60'
            }`}>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className={`text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Revenue Per View
                </span>
                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg animate-pulse"></div>
              </div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
              }`}>
                ${((stages[4].value * 2250) / stages[0].value).toFixed(2)}
              </div>
              <div className={`text-xs font-medium ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Average Revenue
              </div>
            </div>

            {/* View to Visitor Rate */}
            <div className={`rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-sm sm:col-span-2 lg:col-span-1 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-800/80 to-slate-700/80 hover:from-slate-700/90 hover:to-slate-600/90 border border-cyan-500/30'
                : 'bg-gradient-to-br from-cyan-50/80 to-blue-50/80 hover:from-cyan-100/80 hover:to-blue-100/80 border border-cyan-200/50'
            }`}>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className={`text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
                }`}>
                  View → Visitor Rate
                </span>
                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg animate-pulse"></div>
              </div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
              }`}>
                {((data.websiteVisitors / data.youtubeViews) * 100).toFixed(1)}%
              </div>
              <div className={`text-xs font-medium ${
                theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'
              }`}>
                YouTube → Website
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 