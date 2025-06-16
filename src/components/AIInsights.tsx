'use client';

import { AIInsight } from '@/types';
import { useEffect, useState } from 'react';
import { 
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline/index.js';

interface AIInsightsProps {
  insights: AIInsight[];
  className?: string;
}

export function AIInsights({ insights, className = '' }: AIInsightsProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend':
        return ArrowTrendingUpIcon;
      case 'recommendation':
        return LightBulbIcon;
      case 'alert':
        return ExclamationTriangleIcon;
      default:
        return ChartBarIcon;
    }
  };

  const getInsightColor = (type: AIInsight['type'], impact: AIInsight['impact']) => {
    if (type === 'alert') {
      return {
        bg: 'bg-red-500/20 border-red-400/50',
        icon: 'text-red-300',
        title: 'text-red-100',
        text: 'text-red-50',
        actionBg: 'bg-red-500/30',
      };
    }
    
    if (impact === 'high') {
      return {
        bg: 'bg-cyan-500/20 border-cyan-400/50',
        icon: 'text-cyan-300',
        title: 'text-cyan-100',
        text: 'text-cyan-50',
        actionBg: 'bg-cyan-500/30',
      };
    }
    
    return {
      bg: 'bg-purple-500/20 border-purple-400/50',
      icon: 'text-purple-300',
      title: 'text-purple-100',
      text: 'text-purple-50',
      actionBg: 'bg-purple-500/30',
    };
  };

  const getImpactBadge = (impact: AIInsight['impact']) => {
    const colors = {
      high: 'bg-red-500/30 text-red-100 border border-red-400/60 font-semibold',
      medium: 'bg-amber-500/30 text-amber-100 border border-amber-400/60 font-semibold',
      low: 'bg-slate-600/30 text-slate-100 border border-slate-500/60 font-medium',
    };
    
          return (
        <span className={`inline-flex px-3 py-1.5 text-xs rounded-full backdrop-blur-sm ${colors[impact]}`}>
          {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
        </span>
      );
  };

  return (
    <div className={`bg-slate-900/60 backdrop-blur-md border border-slate-600/60 rounded-xl p-6 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl border border-cyan-400/50 shadow-lg">
            <SparklesIcon className="h-6 w-6 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-50">AI-Powered Insights</h3>
            <p className="text-sm text-slate-300 font-medium">Generated from your data</p>
          </div>
        </div>
        <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse shadow-sm"></div>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const colors = getInsightColor(insight.type, insight.impact);
          
          return (
            <div
              key={index}
              className={`p-5 rounded-xl border backdrop-blur-sm ${colors.bg} hover:bg-opacity-90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50`}>
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-base font-bold ${colors.title}`}>
                      {insight.title}
                    </h4>
                    {getImpactBadge(insight.impact)}
                  </div>
                  
                  <p className={`text-sm ${colors.text} mb-5 leading-relaxed font-medium`}>
                    {insight.description}
                  </p>
                  
                  {insight.action && (
                    <div className={`text-sm ${colors.text} ${colors.actionBg} p-4 rounded-lg border border-slate-500/40 backdrop-blur-sm`}>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-current animate-pulse"></div>
                        <span className="font-bold text-slate-100">Recommended Action:</span>
                      </div>
                      <div className="mt-2 pl-4 font-medium">{insight.action}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {insights.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <ChartBarIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h4 className="text-slate-300 font-medium mb-2">No Insights Available</h4>
            <p className="text-slate-400 text-sm">Check back after more data is collected for AI-powered recommendations.</p>
          </div>
        </div>
      )}
      
      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-sm text-slate-400">Last updated: {mounted ? new Date().toLocaleString() : 'Loading...'}</span>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 hover:from-cyan-500/30 hover:to-purple-500/30 font-medium text-sm rounded-lg border border-cyan-500/30 backdrop-blur-sm transition-all duration-200 hover:scale-105">
            Generate New Insights
          </button>
        </div>
      </div>
    </div>
  );
} 