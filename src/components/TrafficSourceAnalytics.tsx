'use client';

import { TrafficSourceAttribution, DetailedLeadSource } from '@/types';
import { useState } from 'react';
import { 
  Globe, 
  Youtube, 
  Search, 
  Facebook, 
  Twitter, 
  Linkedin,
  Users,
  Phone,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Filter,
  ExternalLink,
} from 'lucide-react';

interface TrafficSourceAnalyticsProps {
  trafficSources: TrafficSourceAttribution[];
  className?: string;
  theme?: string;
}

export function TrafficSourceAnalytics({ trafficSources, className = '', theme }: TrafficSourceAnalyticsProps) {
  const [viewType, setViewType] = useState<'table' | 'chart'>('table');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterMedium, setFilterMedium] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'revenue' | 'visitors' | 'conversion' | 'roi'>('revenue');

  const filteredSources = trafficSources.filter(source => {
    const platformMatch = filterPlatform === 'all' || source.source.platform === filterPlatform;
    const mediumMatch = filterMedium === 'all' || source.source.medium === filterMedium;
    return platformMatch && mediumMatch;
  });

  const sortedSources = [...filteredSources].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.revenue - a.revenue;
      case 'visitors':
        return b.visitors - a.visitors;
      case 'conversion':
        return b.conversionRate - a.conversionRate;
      case 'roi':
        const aROI = a.costPerAcquisition ? (a.revenue / (a.costPerAcquisition * a.visitors)) : 0;
        const bROI = b.costPerAcquisition ? (b.revenue / (b.costPerAcquisition * b.visitors)) : 0;
        return bROI - aROI;
      default:
        return 0;
    }
  });

  const getPlatformIcon = (platform: DetailedLeadSource['platform']) => {
    const iconMap = {
      youtube: Youtube,
      google: Search,
      facebook: Facebook,
      twitter: Twitter,
      linkedin: Linkedin,
      direct: Globe,
      referral: ExternalLink,
    };
    return iconMap[platform] || Globe;
  };

  const getPlatformColor = (platform: DetailedLeadSource['platform']) => {
    const colorMap = {
      youtube: 'text-red-400 bg-red-500/20 border-red-500/30',
      google: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      facebook: 'text-blue-500 bg-blue-600/20 border-blue-600/30',
      twitter: 'text-sky-400 bg-sky-500/20 border-sky-500/30',
      linkedin: 'text-blue-600 bg-blue-700/20 border-blue-700/30',
      direct: 'text-green-400 bg-green-500/20 border-green-500/30',
      referral: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    };
    return colorMap[platform] || 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  };

  const getMediumBadge = (medium: DetailedLeadSource['medium']) => {
    const badgeMap = {
      organic: 'bg-green-500/20 text-green-300 border-green-500/30',
      paid: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      social: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      email: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      affiliate: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      direct: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    };
    return badgeMap[medium] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const calculateROI = (source: TrafficSourceAttribution) => {
    if (!source.costPerAcquisition || source.costPerAcquisition === 0) return null;
    const totalCost = source.costPerAcquisition * source.visitors;
    return ((source.revenue - totalCost) / totalCost) * 100;
  };

  const totalStats = trafficSources.reduce((acc, source) => ({
    visitors: acc.visitors + source.visitors,
    callsBooked: acc.callsBooked + source.callsBooked,
    salesClosed: acc.salesClosed + source.salesClosed,
    revenue: acc.revenue + source.revenue,
  }), { visitors: 0, callsBooked: 0, salesClosed: 0, revenue: 0 });

  const topPerformingSources = sortedSources.slice(0, 5);

  return (
    <div className={`${className} ${
      theme === 'dark'
        ? 'bg-slate-900/50 border-slate-700/50'
        : 'bg-white/50 border-slate-200/50'
    } backdrop-blur-sm border rounded-xl`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              Traffic Source Attribution
            </h3>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Detailed attribution and ROI analysis by traffic source
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <button
              onClick={() => setViewType('table')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                viewType === 'table'
                  ? theme === 'dark'
                    ? 'bg-slate-700 text-slate-100'
                    : 'bg-slate-200 text-slate-800'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType('chart')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                viewType === 'chart'
                  ? theme === 'dark'
                    ? 'bg-slate-700 text-slate-100'
                    : 'bg-slate-200 text-slate-800'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              <PieChart className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Visitors</span>
            </div>
            <div className={`text-xl font-bold mt-2 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {formatNumber(totalStats.visitors)}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-cyan-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Calls</span>
            </div>
            <div className={`text-xl font-bold mt-2 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {totalStats.callsBooked}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Sales</span>
            </div>
            <div className={`text-xl font-bold mt-2 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {totalStats.salesClosed}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Revenue</span>
            </div>
            <div className={`text-xl font-bold mt-2 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {formatCurrency(totalStats.revenue)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-600 text-slate-200'
                  : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="direct">Direct</option>
              <option value="referral">Referral</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filterMedium}
              onChange={(e) => setFilterMedium(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-600 text-slate-200'
                  : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">All Mediums</option>
              <option value="organic">Organic</option>
              <option value="paid">Paid</option>
              <option value="social">Social</option>
              <option value="email">Email</option>
              <option value="affiliate">Affiliate</option>
              <option value="direct">Direct</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'revenue' | 'visitors' | 'conversion' | 'roi')}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-600 text-slate-200'
                  : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <option value="revenue">Revenue</option>
              <option value="visitors">Visitors</option>
              <option value="conversion">Conversion Rate</option>
              <option value="roi">ROI</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        {viewType === 'table' ? (
          /* Traffic Sources Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className={`${
                theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
              }`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Source
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Medium
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Visitors
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Calls
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Sales
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Conv. Rate
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Revenue
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'dark' ? 'divide-slate-700' : 'divide-slate-200'
              }`}>
                {sortedSources.map((source, index) => {
                  const PlatformIcon = getPlatformIcon(source.source.platform);
                  const roi = calculateROI(source);
                  
                  return (
                    <tr key={index} className={`hover:${
                      theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50'
                    } transition-colors duration-200`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg border ${getPlatformColor(source.source.platform)}`}>
                            <PlatformIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className={`text-sm font-medium ${
                              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                            }`}>
                              {source.source.platform.charAt(0).toUpperCase() + source.source.platform.slice(1)}
                            </div>
                            {source.source.campaign && (
                              <div className={`text-xs ${
                                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                {source.source.campaign}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getMediumBadge(source.source.medium)}`}>
                          {source.source.medium}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                        }`}>
                          {formatNumber(source.visitors)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-cyan-400">
                          {source.callsBooked}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-green-400">
                          {source.salesClosed}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                        }`}>
                          {formatPercentage(source.conversionRate)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-bold text-emerald-400">
                          {formatCurrency(source.revenue)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {roi !== null ? (
                          <div className={`flex items-center space-x-1 text-sm font-medium ${
                            roi >= 100 ? 'text-emerald-400' : roi >= 0 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {roi >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span>{roi.toFixed(0)}%</span>
                          </div>
                        ) : (
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            N/A
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Chart View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Sources by Revenue */}
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
              <h4 className={`text-sm font-semibold mb-4 ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
              }`}>
                Top Sources by Revenue
              </h4>
              <div className="space-y-3">
                {topPerformingSources.map((source, index) => {
                  const PlatformIcon = getPlatformIcon(source.source.platform);
                  const percentage = (source.revenue / totalStats.revenue) * 100;
                  
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg border ${getPlatformColor(source.source.platform)}`}>
                        <PlatformIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                          }`}>
                            {source.source.platform.charAt(0).toUpperCase() + source.source.platform.slice(1)}
                          </span>
                          <span className={`text-sm font-bold ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                          }`}>
                            {formatCurrency(source.revenue)}
                          </span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${
                          theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                        }`}>
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conversion Rates by Source */}
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
              <h4 className={`text-sm font-semibold mb-4 ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
              }`}>
                Conversion Rates by Source
              </h4>
              <div className="space-y-3">
                {topPerformingSources.map((source, index) => {
                  const PlatformIcon = getPlatformIcon(source.source.platform);
                  
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg border ${getPlatformColor(source.source.platform)}`}>
                        <PlatformIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                          }`}>
                            {source.source.platform.charAt(0).toUpperCase() + source.source.platform.slice(1)}
                          </span>
                          <span className={`text-sm font-bold ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                          }`}>
                            {formatPercentage(source.conversionRate)}
                          </span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${
                          theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                        }`}>
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                            style={{ width: `${Math.min(source.conversionRate * 10, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {sortedSources.length === 0 && (
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            No traffic sources found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
} 