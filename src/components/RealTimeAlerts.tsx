'use client';

import { RealTimeAlert, PerformanceThreshold } from '@/types';
import { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle,
  Info,
  TrendingDown,
  TrendingUp,
  X,
  Eye,
  EyeOff,
  Settings,
  Clock,
  Zap,
  Target
} from 'lucide-react';

interface RealTimeAlertsProps {
  alerts: RealTimeAlert[];
  thresholds: PerformanceThreshold[];
  onMarkAsRead?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  className?: string;
  theme?: string;
}

export function RealTimeAlerts({ 
  alerts, 
  thresholds, 
  onMarkAsRead, 
  onDismiss,
  className = '', 
  theme 
}: RealTimeAlertsProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'today'>('unread');
  const [showSettings, setShowSettings] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const filteredAlerts = alerts.filter(alert => {
    const now = new Date();
    const alertDate = new Date(alert.timestamp);
    const isToday = alertDate.toDateString() === now.toDateString();

    switch (filter) {
      case 'unread':
        return !alert.isRead;
      case 'critical':
        return alert.severity === 'critical';
      case 'today':
        return isToday;
      default:
        return true;
    }
  });

  const getSeverityIcon = (severity: RealTimeAlert['severity']) => {
    const iconMap = {
      critical: AlertTriangle,
      warning: AlertCircle,
      info: Info,
      success: CheckCircle,
    };
    return iconMap[severity];
  };

  const getSeverityColor = (severity: RealTimeAlert['severity']) => {
    const colorMap = {
      critical: 'text-red-400 bg-red-500/20 border-red-500/30',
      warning: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
      info: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      success: 'text-green-400 bg-green-500/20 border-green-500/30',
    };
    return colorMap[severity];
  };

  const getTypeIcon = (type: RealTimeAlert['type']) => {
    const iconMap = {
      performance: TrendingDown,
      conversion: Target,
      revenue: TrendingUp,
      engagement: Zap,
      system: Settings,
    };
    return iconMap[type] || Info;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length;

  return (
    <div className={`${className} ${
      theme === 'dark'
        ? 'bg-slate-900/50 border-slate-700/50'
        : 'bg-white/50 border-slate-200/50'
    } backdrop-blur-sm border rounded-xl`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className={`h-6 w-6 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
              }`} />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
              }`}>
                Real-Time Alerts
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                AI-powered performance monitoring
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors mt-4 sm:mt-0 ${
              showSettings
                ? theme === 'dark'
                  ? 'bg-slate-700 text-slate-100'
                  : 'bg-slate-200 text-slate-800'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-300'
                : 'text-slate-600 hover:text-slate-700'
            }`}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Total</span>
            </div>
            <div className={`text-lg font-bold mt-1 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {alerts.length}
            </div>
          </div>

          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <EyeOff className="h-4 w-4 text-orange-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Unread</span>
            </div>
            <div className={`text-lg font-bold mt-1 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {unreadCount}
            </div>
          </div>

          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Critical</span>
            </div>
            <div className={`text-lg font-bold mt-1 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {criticalCount}
            </div>
          </div>

          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-400" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Active</span>
            </div>
            <div className={`text-lg font-bold mt-1 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {thresholds.filter(t => t.isActive).length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'unread', 'critical', 'today'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                filter === filterOption
                  ? theme === 'dark'
                    ? 'bg-slate-700 text-slate-100 border-slate-600'
                    : 'bg-slate-200 text-slate-800 border-slate-300'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-300 border-slate-600'
                  : 'text-slate-600 hover:text-slate-700 border-slate-300'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className={`text-center py-8 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {filter === 'unread' ? 'No unread alerts' : 'No alerts found'}
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const SeverityIcon = getSeverityIcon(alert.severity);
              const TypeIcon = getTypeIcon(alert.type);
              const isExpanded = expandedAlert === alert.id;

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    alert.isRead
                      ? theme === 'dark'
                        ? 'bg-slate-800/30 border-slate-700/50'
                        : 'bg-slate-50/50 border-slate-200/50'
                      : theme === 'dark'
                      ? 'bg-slate-800/60 border-slate-600/60 shadow-md'
                      : 'bg-white/60 border-slate-300/60 shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icons */}
                    <div className="flex space-x-2 flex-shrink-0">
                      <div className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                        <SeverityIcon className="h-4 w-4" />
                      </div>
                      <div className={`p-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-slate-700/50 border-slate-600/50 text-slate-300'
                          : 'bg-slate-100/50 border-slate-300/50 text-slate-600'
                      }`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-semibold ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                          }`}>
                            {alert.title}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {alert.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              <Clock className="h-3 w-3 inline mr-1" />
                              {formatTimestamp(alert.timestamp)}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                            className={`p-1 rounded transition-colors ${
                              theme === 'dark'
                                ? 'text-slate-400 hover:text-slate-300'
                                : 'text-slate-600 hover:text-slate-700'
                            }`}
                          >
                            {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          {!alert.isRead && onMarkAsRead && (
                            <button
                              onClick={() => onMarkAsRead(alert.id)}
                              className={`p-1 rounded transition-colors ${
                                theme === 'dark'
                                  ? 'text-slate-400 hover:text-slate-300'
                                  : 'text-slate-600 hover:text-slate-700'
                              }`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {onDismiss && (
                            <button
                              onClick={() => onDismiss(alert.id)}
                              className={`p-1 rounded transition-colors ${
                                theme === 'dark'
                                  ? 'text-slate-400 hover:text-slate-300'
                                  : 'text-slate-600 hover:text-slate-700'
                              }`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && alert.suggestedActions && (
                        <div className={`mt-4 pt-4 border-t ${
                          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                        }`}>
                          <h5 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            Suggested Actions
                          </h5>
                          <ul className="space-y-2">
                            {alert.suggestedActions.map((action, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                                <span className={`text-sm ${
                                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                                }`}>
                                  {action}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 