'use client';

import { EmailCampaign } from '@/types';
import { useState } from 'react';
import { 
  Mail, 
 
  Eye, 
  MousePointer, 
  Phone, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle,
  Pause,
  Send,
  Filter
} from 'lucide-react';

interface EmailCampaignTrackerProps {
  campaigns: EmailCampaign[];
  className?: string;
  theme?: string;
}

export function EmailCampaignTracker({ campaigns, className = '', theme }: EmailCampaignTrackerProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'revenue' | 'opens' | 'clicks' | 'conversions'>('revenue');

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedType === 'all' || campaign.type === selectedType
  );

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.conversions.revenue - a.conversions.revenue;
      case 'opens':
        return b.engagement.uniqueOpens - a.engagement.uniqueOpens;
      case 'clicks':
        return b.engagement.uniqueClicks - a.engagement.uniqueClicks;
      case 'conversions':
        return b.conversions.callsBooked - a.conversions.callsBooked;
      default:
        return 0;
    }
  });

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

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  const getStatusIcon = (status: EmailCampaign['status']) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'sending':
        return <Send className="h-4 w-4 text-blue-400 animate-pulse" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeColor = (type: EmailCampaign['type']) => {
    const colors = {
      'welcome': 'bg-green-500/20 text-green-300 border-green-500/30',
      'nurture': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'promotional': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'follow-up': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'abandoned-cart': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'webinar': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const calculateROI = (campaign: EmailCampaign) => {
    // Assume cost of $0.10 per email sent
    const cost = campaign.recipients.sent * 0.10;
    if (cost === 0) return 0;
    return ((campaign.conversions.revenue - cost) / cost) * 100;
  };

  const totalStats = campaigns.reduce((acc, campaign) => ({
    sent: acc.sent + campaign.recipients.sent,
    opens: acc.opens + campaign.engagement.uniqueOpens,
    clicks: acc.clicks + campaign.engagement.uniqueClicks,
    callsBooked: acc.callsBooked + campaign.conversions.callsBooked,
    revenue: acc.revenue + campaign.conversions.revenue,
  }), { sent: 0, opens: 0, clicks: 0, callsBooked: 0, revenue: 0 });

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
              Email Campaign Performance
            </h3>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Track email engagement and conversion across all campaigns
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Sent</span>
            </div>
            <div className={`text-xl font-bold mt-2 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {formatNumber(totalStats.sent)}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Opens</span>
            </div>
            <div className={`text-xl font-bold mt-2 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {formatPercentage(totalStats.opens, totalStats.sent)}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <MousePointer className="h-5 w-5 text-purple-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Clicks</span>
            </div>
            <div className={`text-xl font-bold mt-2 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {formatPercentage(totalStats.clicks, totalStats.opens)}
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
              <DollarSign className="h-5 w-5 text-emerald-400" />
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-600 text-slate-200'
                  : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">All Types</option>
              <option value="welcome">Welcome</option>
              <option value="nurture">Nurture</option>
              <option value="promotional">Promotional</option>
              <option value="follow-up">Follow-up</option>
              <option value="abandoned-cart">Abandoned Cart</option>
              <option value="webinar">Webinar</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'revenue' | 'opens' | 'clicks' | 'conversions')}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-600 text-slate-200'
                  : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <option value="revenue">Revenue</option>
              <option value="opens">Opens</option>
              <option value="clicks">Clicks</option>
              <option value="conversions">Conversions</option>
            </select>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className={`${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Campaign
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Type
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Status
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Recipients
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Open Rate
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Click Rate
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Calls
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
              {sortedCampaigns.map((campaign) => {
                const openRate = formatPercentage(campaign.engagement.uniqueOpens, campaign.recipients.sent);
                const clickRate = formatPercentage(campaign.engagement.uniqueClicks, campaign.engagement.uniqueOpens);
                const roi = calculateROI(campaign);
                
                return (
                  <tr key={campaign.id} className={`hover:${
                    theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50'
                  } transition-colors duration-200`}>
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        <div className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                        } truncate`}>
                          {campaign.name}
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        } mt-1 truncate`}>
                          {campaign.subject}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getTypeColor(campaign.type)}`}>
                        {campaign.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(campaign.status)}
                        <span className={`text-sm capitalize ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                      }`}>
                        {formatNumber(campaign.recipients.sent)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {campaign.recipients.delivered} delivered
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                      }`}>
                        {openRate}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {formatNumber(campaign.engagement.uniqueOpens)} opens
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                      }`}>
                        {clickRate}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {formatNumber(campaign.engagement.uniqueClicks)} clicks
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-cyan-400">
                        {campaign.conversions.callsBooked}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold text-emerald-400">
                        {formatCurrency(campaign.conversions.revenue)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedCampaigns.length === 0 && (
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            No campaigns found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
} 