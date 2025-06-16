'use client';

import { YouTubeVideo } from '@/types';
import { format } from 'date-fns';

interface VideoPerformanceTableProps {
  videos: YouTubeVideo[];
  className?: string;
}

export function VideoPerformanceTable({ videos, className = '' }: VideoPerformanceTableProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const getPerformanceRating = (revenuePerView: number) => {
    if (revenuePerView >= 0.05) return { 
      label: 'Excellent', 
      color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
    };
    if (revenuePerView >= 0.03) return { 
      label: 'Good', 
      color: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
    };
    if (revenuePerView >= 0.01) return { 
      label: 'Average', 
      color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
    };
    return { 
      label: 'Poor', 
      color: 'bg-red-500/20 text-red-300 border border-red-500/30' 
    };
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-slate-900';
    if (index === 2) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-slate-900';
    return 'bg-slate-700/50 text-slate-300 border border-slate-600/50';
  };

  return (
    <div className={`bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl ${className}`}>
      <div className="p-3 sm:p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-100">Video Performance Leaderboard</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ranked by revenue generated per video
            </p>
          </div>
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Video
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Views
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider hidden sm:table-cell">
                Calls
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider hidden md:table-cell">
                Sales
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                $/View
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {videos.slice(0, 10).map((video, index) => {
              const rating = getPerformanceRating(video.revenuePerView);
              
              return (
                <tr key={video.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`
                        inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold
                        ${getRankBadge(index)}
                      `}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="max-w-[150px] sm:max-w-xs">
                      <div className="text-xs sm:text-sm font-medium text-slate-100 truncate">
                        {video.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {formatDate(video.publishedAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-slate-100">
                      {formatNumber(video.views)}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm font-medium text-slate-100">{video.callsBooked}</div>
                    <div className="text-xs text-slate-400">
                      {((video.callsBooked / video.views) * 100).toFixed(2)}% rate
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm font-medium text-slate-100">{video.salesClosed}</div>
                    <div className="text-xs text-slate-400">
                      {((video.salesClosed / video.callsBooked) * 100).toFixed(1)}% close
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-bold text-green-400">
                      {formatCurrency(video.revenue)}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm font-mono text-cyan-400">
                      ${video.revenuePerView.toFixed(3)}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${rating.color}`}>
                      {rating.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="px-3 sm:px-6 py-3 sm:py-4 bg-slate-800/30 border-t border-slate-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-slate-400 gap-2 sm:gap-0">
          <span>Showing top 10 performing videos</span>
          <span className="text-slate-300">
            Total videos analyzed: <span className="font-semibold text-cyan-400">{videos.length}</span>
          </span>
        </div>
      </div>
    </div>
  );
} 