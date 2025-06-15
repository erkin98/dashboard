'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  X, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Clock,
  Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'revenue' | 'growth';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Generate unique ID for notifications
  const generateUniqueId = useCallback(() => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Mock notification generator
  const generateNotification = useCallback((): Notification => {
    const types: Notification['type'][] = ['success', 'warning', 'error', 'info', 'revenue', 'growth'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const notificationTemplates = {
      success: [
        { title: 'Goal Achieved!', message: 'Monthly revenue target exceeded by 15%' },
        { title: 'New Milestone', message: 'Reached 100K YouTube subscribers!' },
        { title: 'Conversion Success', message: 'Call conversion rate improved to 32%' }
      ],
      warning: [
        { title: 'Low Conversion Alert', message: 'Conversion rate dropped below 25% threshold' },
        { title: 'Video Performance', message: 'Latest video underperforming vs average' },
        { title: 'Lead Quality Notice', message: 'Lead quality score decreased this week' }
      ],
      error: [
        { title: 'System Alert', message: 'API connection temporarily unavailable' },
        { title: 'Data Sync Issue', message: 'YouTube analytics sync failed - retrying' },
        { title: 'Payment Failed', message: 'Subscription payment requires attention' }
      ],
      info: [
        { title: 'Weekly Report Ready', message: 'Your performance summary is available' },
        { title: 'New Feature', message: 'Advanced analytics dashboard now live' },
        { title: 'Scheduled Maintenance', message: 'System update planned for tonight' }
      ],
      revenue: [
        { title: 'Revenue Spike!', message: '$15,000 generated from latest video launch' },
        { title: 'High-Value Lead', message: 'New $50K+ opportunity in pipeline' },
        { title: 'Upsell Success', message: 'Client upgraded to premium coaching package' }
      ],
      growth: [
        { title: 'Audience Growth', message: 'YouTube channel gained 2,500 new subscribers' },
        { title: 'Engagement Boost', message: 'Video engagement up 40% this month' },
        { title: 'Market Expansion', message: 'New demographic showing strong interest' }
      ]
    };

    const templates = notificationTemplates[type];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      id: `notif_${generateUniqueId()}`,
      type,
      title: template.title,
      message: template.message,
      timestamp: new Date(),
      read: false,
      actionLabel: type === 'revenue' ? 'View Details' : type === 'warning' ? 'Investigate' : undefined,
      onAction: () => console.log(`Action for ${template.title}`)
    };
  }, [generateUniqueId]);

  // Add new notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to generate a new notification every 10 seconds
      if (Math.random() < 0.3) {
        const newNotification = generateNotification();
        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep max 20 notifications
      }
    }, 10000);

    // Generate initial notifications
    const initialNotifications = Array.from({ length: 3 }, () => generateNotification());
    setNotifications(initialNotifications);

    return () => clearInterval(interval);
  }, [generateNotification]);

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'revenue':
        return <DollarSign className="w-5 h-5 text-green-400" />;
      case 'growth':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'revenue':
        return 'border-green-500/30 bg-green-500/10';
      case 'growth':
        return 'border-blue-500/30 bg-blue-500/10';
      default:
        return 'border-cyan-500/30 bg-cyan-500/10';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-200 hover-lift"
      >
        <Bell className="w-5 h-5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse-glow">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 max-h-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-50 animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                  <p className="text-xs mt-1">We&apos;ll notify you of important updates</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        notification.read 
                          ? 'bg-slate-800/30 border-slate-700/30' 
                          : `${getNotificationStyles(notification.type)} border-opacity-50`
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`font-medium text-sm ${
                              notification.read ? 'text-slate-300' : 'text-white'
                            }`}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => dismissNotification(notification.id)}
                              className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <p className={`text-xs mt-1 ${
                            notification.read ? 'text-slate-400' : 'text-slate-300'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(notification.timestamp)}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {notification.actionLabel && (
                                <button
                                  onClick={notification.onAction}
                                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                  {notification.actionLabel}
                                </button>
                              )}
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
                <button className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors w-full justify-center">
                  <Settings className="w-3 h-3" />
                  Notification Settings
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter; 