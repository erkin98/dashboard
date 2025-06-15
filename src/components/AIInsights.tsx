'use client';

import { AIInsight } from '@/types';
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
        bg: 'bg-red-500/10 border-red-500/30',
        icon: 'text-red-400',
        title: 'text-red-300',
        text: 'text-red-200',
        actionBg: 'bg-red-500/20',
      };
    }
    
    if (impact === 'high') {
      return {
        bg: 'bg-cyan-500/10 border-cyan-500/30',
        icon: 'text-cyan-400',
        title: 'text-cyan-300',
        text: 'text-cyan-200',
        actionBg: 'bg-cyan-500/20',
      };
    }
    
    return {
      bg: 'bg-purple-500/10 border-purple-500/30',
      icon: 'text-purple-400',
      title: 'text-purple-300',
      text: 'text-purple-200',
      actionBg: 'bg-purple-500/20',
    };
  };

  const getImpactBadge = (impact: AIInsight['impact']) => {
    const colors = {
      high: 'bg-red-500/20 text-red-300 border border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      low: 'bg-slate-600/20 text-slate-300 border border-slate-600/30',
    };
    
    return (
      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${colors[impact]}`}>
        {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
      </span>
    );
  };

  return (
    <div className={`bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
            <SparklesIcon className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">AI-Powered Insights</h3>
            <p className="text-xs text-slate-400">Generated from your data</p>
          </div>
        </div>
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const colors = getInsightColor(insight.type, insight.impact);
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border backdrop-blur-sm ${colors.bg} hover:bg-opacity-80 transition-all duration-200`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50`}>
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-sm font-semibold ${colors.title}`}>
                      {insight.title}
                    </h4>
                    {getImpactBadge(insight.impact)}
                  </div>
                  
                  <p className={`text-sm ${colors.text} mb-4 leading-relaxed`}>
                    {insight.description}
                  </p>
                  
                  {insight.action && (
                    <div className={`text-xs ${colors.text} ${colors.actionBg} p-3 rounded-lg border border-slate-600/30 backdrop-blur-sm`}>
                      <div className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></div>
                        <span className="font-medium text-slate-200">Recommended Action:</span>
                      </div>
                      <div className="mt-1 pl-3.5">{insight.action}</div>
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
            <span className="text-sm text-slate-400">Last updated: {new Date().toLocaleString()}</span>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 hover:from-cyan-500/30 hover:to-purple-500/30 font-medium text-sm rounded-lg border border-cyan-500/30 backdrop-blur-sm transition-all duration-200 hover:scale-105">
            Generate New Insights
          </button>
        </div>
      </div>
    </div>
  );
} 