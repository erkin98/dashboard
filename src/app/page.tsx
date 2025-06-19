'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  PlayIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Calendar,
  Command,
  Download,
  type LucideIcon,
  Moon,
  RefreshCw,
  Settings,
  Sun,
  Terminal,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationCenter from "@/components/NotificationCenter";
import AdvancedSearch from "@/components/AdvancedSearch";
import { FunnelChart } from '@/components/FunnelChart';
import { TrendsChart } from '@/components/TrendsChart';
import { VideoPerformanceTable } from '@/components/VideoPerformanceTable';
import { TrafficChart } from '@/components/TrafficChart';
import { EmailCampaignTracker } from '@/components/EmailCampaignTracker';
import { TrafficSourceAnalytics } from '@/components/TrafficSourceAnalytics';
import { RealTimeAlerts } from '@/components/RealTimeAlerts';
import { CriticalMetricsTable } from '@/components/CriticalMetricsTable';
import { DetailedFunnelOverview } from '@/components/DetailedFunnelOverview';
import { VideoAttributionAnalytics } from '@/components/VideoAttributionAnalytics';
import { TrendsComparison } from '@/components/TrendsComparison';
import { CountryBreakdown } from '@/components/CountryBreakdown';
import { DashboardData } from '@/types';
import { DashboardIcon } from '@/components/DashboardIcon';

interface ParticleType {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth] = useState(-1);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const dashboardData = await response.json();
      setDashboardData(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // Apply theme to document root
    if (mounted) {
      document.documentElement.className = newTheme;
      localStorage.setItem('dashboard-theme', newTheme);
    }
  }, [theme, mounted]);

  // Initialize theme from localStorage
  useEffect(() => {
    if (mounted) {
      const savedTheme = localStorage.getItem('dashboard-theme') as "dark" | "light" | null;
      if (savedTheme && savedTheme !== theme) {
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
      } else {
        document.documentElement.className = theme;
      }
    }
  }, [mounted, theme]);

  // Mock data for different sections
  const mockSectionData = {
    YouTube: {
      title: "YouTube Analytics",
      metrics: [
        { label: "Total Views", value: "2.4M", change: "+12.5%" },
        { label: "Subscribers", value: "45.2K", change: "+8.3%" },
        { label: "Watch Time", value: "156K hrs", change: "+15.2%" },
        { label: "Engagement Rate", value: "4.8%", change: "+2.1%" }
      ]
    },
    Calls: {
      title: "Call Management",
      metrics: [
        { label: "Scheduled Calls", value: "127", change: "+18%" },
        { label: "Completed Calls", value: "98", change: "+22%" },
        { label: "Show-up Rate", value: "77.2%", change: "+5.1%" },
        { label: "Avg Call Duration", value: "42 min", change: "+3 min" }
      ]
    },
    Revenue: {
      title: "Revenue Dashboard",
      metrics: [
        { label: "Monthly Revenue", value: "$89.5K", change: "+24.3%" },
        { label: "Average Deal Size", value: "$2,850", change: "+12%" },
        { label: "Conversion Rate", value: "18.5%", change: "+3.2%" },
        { label: "Lifetime Value", value: "$8,450", change: "+15%" }
      ]
    },
    Leads: {
      title: "Lead Generation",
      metrics: [
        { label: "New Leads", value: "342", change: "+28%" },
        { label: "Qualified Leads", value: "156", change: "+19%" },
        { label: "Lead Score Avg", value: "78.5", change: "+5.2%" },
        { label: "Cost per Lead", value: "$45", change: "-12%" }
      ]
    },
    Analytics: {
      title: "Advanced Analytics",
      metrics: [
        { label: "Traffic Sources", value: "12", change: "+2" },
        { label: "Bounce Rate", value: "32.1%", change: "-8.5%" },
        { label: "Session Duration", value: "4m 32s", change: "+45s" },
        { label: "Page Views", value: "18.7K", change: "+16%" }
      ]
    },
    "AI Insights": {
      title: "AI-Powered Insights",
      metrics: [
        { label: "Predictions Made", value: "1,247", change: "+156" },
        { label: "Accuracy Rate", value: "94.2%", change: "+2.1%" },
        { label: "Recommendations", value: "23", change: "+8" },
        { label: "Automation Score", value: "87%", change: "+12%" }
      ]
    },
    Geography: {
      title: "Geographic Analytics",
      metrics: [
        { label: "Active Markets", value: "8", change: "+2" },
        { label: "Top Market", value: "US", change: "42.3%" },
        { label: "Best CVR Market", value: "CA", change: "28.5%" },
        { label: "Fastest Growing", value: "AU", change: "+67%" }
      ]
    },
    Settings: {
      title: "System Settings",
      metrics: [
        { label: "Active Integrations", value: "8", change: "+2" },
        { label: "API Calls Today", value: "2.1K", change: "+340" },
        { label: "Storage Used", value: "67%", change: "+5%" },
        { label: "Uptime", value: "99.9%", change: "0%" }
      ]
    }
  };

  const handleSectionClick = useCallback((section: string) => {
    setActiveSection(section);
    console.log(`Navigating to ${section} section`);
  }, []);

  const handleMetricClick = useCallback((metric: string) => {
    setSelectedMetric(metric);
    setShowDetailModal(true);
    console.log(`Viewing details for ${metric}`);
  }, []);

  const handleCardClick = useCallback((cardType: string) => {
    console.log(`${cardType} card clicked - showing detailed view`);
    setSelectedMetric(cardType);
    setShowDetailModal(true);
  }, []);

  const handleQuickAction = useCallback(async (actionName: string, description: string) => {
    // Prevent multiple clicks
    if (quickActionLoading) return;
    
    setQuickActionLoading(actionName);
    console.log(`Quick Action: ${actionName}`);
    
    try {
      // Special handling for specific actions
      switch (actionName) {
        case 'Refresh Data':
          await fetchDashboardData();
          break;
        case 'View Report':
          // Navigate to analytics section but keep modal open
          setActiveSection('Analytics');
          break;
        case 'Export Data':
          // Simulate data export
          await new Promise((resolve) => {
            setTimeout(() => {
              if (dashboardData) {
                const element = document.createElement('a');
                const file = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' });
                element.href = URL.createObjectURL(file);
                element.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }
              resolve(void 0);
            }, 1000);
          });
          break;
        case 'AI Analysis':
          // Navigate to AI Insights but keep modal open
          setActiveSection('AI Insights');
          break;
        case 'Set Alert':
          // Simulate alert creation
          await new Promise(resolve => setTimeout(resolve, 800));
          break;
        case 'Schedule Review':
          // Simulate scheduling
          await new Promise(resolve => setTimeout(resolve, 600));
          break;
        default:
          console.log(`Executing: ${description}`);
          await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Quick Action failed:', error);
    } finally {
      setQuickActionLoading(null);
    }
  }, [dashboardData, fetchDashboardData, quickActionLoading]);

  // Function to render section-specific content
  const renderSectionContent = () => {
    const sectionData = mockSectionData[activeSection as keyof typeof mockSectionData];
    
    if (!sectionData) {
      return renderDefaultDashboard();
    }

    return (
      <Card className={`backdrop-blur-xl overflow-hidden transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-2xl hover:scale-[1.01] ${
        theme === 'dark' 
          ? 'bg-slate-900/20 border-slate-700/20 hover:bg-slate-900/30 hover:border-slate-600/30' 
          : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-slate-200/20'
      }`}>
        <CardHeader className={`pb-3 ${
          theme === 'dark' ? 'border-b border-slate-700/50' : 'border-b border-slate-200/50'
        }`}>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              {getIconForSection(activeSection)} 
              {sectionData.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`text-xs ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 text-cyan-400 border-cyan-500/50' 
                  : 'bg-slate-100/50 text-cyan-600 border-cyan-400/50'
              }`}>
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                LIVE
              </Badge>
              <Button variant="ghost" size="icon" className={`h-8 w-8 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`} onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sectionData.metrics.map((metric, index) => (
              <div key={metric.label} className="animate-slide-in-up hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <div 
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-md hover:backdrop-blur-lg hover:scale-105 hover:shadow-xl ${
                    theme === 'dark' 
                      ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-700/30 hover:border-slate-600/40 hover:shadow-slate-900/50' 
                      : 'bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 hover:shadow-slate-200/30'
                  }`}
                  onClick={() => handleMetricClick(metric.label)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>{metric.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      metric.change.startsWith('+') 
                        ? theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'
                        : metric.change.startsWith('-') 
                        ? theme === 'dark' ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'
                        : theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>{metric.value}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const getIconForSection = (section: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      Dashboard: <Activity className="mr-2 h-5 w-5 text-cyan-500" />,
      YouTube: <PlayIcon className="mr-2 h-5 w-5 text-red-500" />,
      Calls: <PhoneIcon className="mr-2 h-5 w-5 text-blue-500" />,
      Revenue: <CurrencyDollarIcon className="mr-2 h-5 w-5 text-green-500" />,
      Leads: <UserGroupIcon className="mr-2 h-5 w-5 text-purple-500" />,
      Analytics: <BarChart3 className="mr-2 h-5 w-5 text-orange-500" />,
      "AI Insights": <Terminal className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />,
      Settings: <Settings className="mr-2 h-5 w-5 text-slate-500" />
    };
    return iconMap[section] || <Activity className="mr-2 h-5 w-5 text-cyan-500" />;
  };

  const renderDefaultDashboard = () => {
    return (
      <Card className={`backdrop-blur-xl overflow-hidden transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-2xl hover:scale-[1.01] ${
        theme === 'dark' 
          ? 'bg-slate-900/20 border-slate-700/20 hover:bg-slate-900/30 hover:border-slate-600/30' 
          : 'bg-white/60 border-white/40 hover:bg-white/80 hover:border-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_16px_64px_rgba(0,0,0,0.12)]'
      }`}>
        <CardHeader className={`pb-3 ${
          theme === 'dark' ? 'border-b border-slate-700/50' : 'border-b border-white/30'
        }`}>
          <div className="flex items-center justify-between">
            <CardTitle 
              className={`flex items-center cursor-pointer transition-colors ${
                theme === 'dark' 
                  ? 'text-slate-100 hover:text-cyan-400' 
                  : 'text-slate-800 hover:text-cyan-600'
              }`}
              onClick={() => handleSectionClick("Dashboard")}
            >
              <Activity className="mr-2 h-5 w-5 text-cyan-500" />
              Coaching Business Overview
            </CardTitle>
            <div className="flex items-center space-x-2">
              {/* API Status Indicators */}
              {dashboardData?.apiStatus && (
                <div className="flex items-center gap-1">
                  {Object.entries(dashboardData.apiStatus).map(([service, status]) => {
                    const getStatusColor = (status: 'connected' | 'mock' | 'error') => {
                      switch (status) {
                        case 'connected': return 'bg-green-500 border-green-400';
                        case 'mock': return 'bg-yellow-500 border-yellow-400';
                        case 'error': return 'bg-red-500 border-red-400';
                        default: return 'bg-gray-500 border-gray-400';
                      }
                    };
                    
                    const getServiceLetter = (service: string) => {
                      switch (service) {
                        case 'youtube': return 'Y';
                        case 'kajabi': return 'K';
                        case 'calcom': return 'C';
                        case 'openai': return 'O';
                        default: return service.charAt(0).toUpperCase();
                      }
                    };

                    const getServiceName = (service: string) => {
                      switch (service) {
                        case 'youtube': return 'YouTube API';
                        case 'kajabi': return 'Kajabi API';
                        case 'calcom': return 'Cal.com API';
                        case 'openai': return 'OpenAI API';
                        default: return service.charAt(0).toUpperCase() + service.slice(1);
                      }
                    };

                    const getStatusText = (status: 'connected' | 'mock' | 'error') => {
                      switch (status) {
                        case 'connected': return 'Connected - Live Data';
                        case 'mock': return 'Using Mock Data';
                        case 'error': return 'Connection Error';
                        default: return 'Unknown Status';
                      }
                    };
                    
                    return (
                      <div
                        key={service}
                        className={`relative group cursor-help flex items-center`}
                        title={`${getServiceName(service)}: ${getStatusText(status)}`}
                      >
                        {/* Premium Service Letter Badge */}
                        <div className={`
                          h-6 w-6 rounded-full border-2 ${getStatusColor(status as 'connected' | 'mock' | 'error')}
                          flex items-center justify-center text-xs font-bold text-white
                          ${status === 'connected' ? 'animate-status-glow' : ''}
                          transition-all duration-300 group-hover:scale-125 shadow-lg
                          status-premium backdrop-blur-sm
                        `}>
                          {getServiceLetter(service)}
                        </div>
                        
                        {/* Tooltip on hover */}
                        <div className={`
                          absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
                          text-xs font-medium rounded-lg shadow-lg z-50 whitespace-nowrap
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                          ${theme === 'dark' 
                            ? 'bg-slate-800 text-slate-200 border border-slate-700' 
                            : 'bg-white text-slate-800 border border-slate-200 shadow-md'
                          }
                        `}>
                          <div className="text-center">
                            <div className="font-semibold">{getServiceName(service)}</div>
                            <div className={`text-xs mt-1 ${
                              status === 'connected' ? 'text-green-600' :
                              status === 'error' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {getStatusText(status)}
                            </div>
                          </div>
                          {/* Arrow */}
                          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 
                            border-l-4 border-r-4 border-t-4 border-transparent
                            ${theme === 'dark' ? 'border-t-slate-800' : 'border-t-white'}
                          `}></div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Status Legend */}
                  <div className={`ml-3 text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <div className="flex items-center gap-4">
                      {/* Service Legend */}
                      <div>
                        <div className="font-medium mb-1">APIs:</div>
                        <div className="flex gap-2 flex-wrap">
                          <span>Y=YouTube</span>
                          <span>K=Kajabi</span>
                          <span>C=Cal.com</span>
                          <span>O=OpenAI</span>
                        </div>
                      </div>
                      
                      {/* Color Status Legend */}
                      <div>
                        <div className="font-medium mb-1">Status:</div>
                        <div className="flex gap-2 items-center">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>Live</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                            <span>Mock</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span>Error</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <Badge variant="outline" className={`text-xs ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 text-cyan-400 border-cyan-500/50' 
                  : 'bg-white/80 text-cyan-600 border-cyan-400/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.06)]'
              }`}>
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                LIVE
              </Badge>
              <Button variant="ghost" size="icon" className={`h-8 w-8 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`} onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="animate-slide-in-up hover-lift">
              <CoachingMetricCard
                title="YouTube Views"
                value={safeCurrentMonth.youtubeViews}
                icon={PlayIcon}
                trend={previousMonth && safeCurrentMonth.youtubeViews > previousMonth.youtubeViews ? "up" : "down"}
                color="cyan"
                detail={`${(safeCurrentMonth.youtubeUniqueViews || 0).toLocaleString()} unique`}
                onClick={() => handleCardClick("YouTube Views")}
                theme={theme}
              />
            </div>
            <div className="animate-slide-in-up hover-lift" style={{ animationDelay: '0.1s' }}>
              <CoachingMetricCard
                title="Revenue"
                value={safeCurrentMonth.newCashCollected?.total || 0}
                icon={CurrencyDollarIcon}
                trend={previousMonth && safeCurrentMonth.newCashCollected?.total > previousMonth.newCashCollected?.total ? "up" : "stable"}
                color="purple"
                detail={`$${(safeCurrentMonth.totalCashCollected || 0).toLocaleString()} total`}
                onClick={() => handleCardClick("Revenue")}
                theme={theme}
              />
            </div>
            <div className="animate-slide-in-up hover-lift" style={{ animationDelay: '0.2s' }}>
              <CoachingMetricCard
                title="Conversion Rate"
                value={Math.round(safeCurrentMonth.conversionRates?.acceptedToSale || 0)}
                icon={TrophyIcon}
                trend="up"
                color="blue"
                detail={`${safeCurrentMonth.callsBooked || 0} calls booked`}
                onClick={() => handleCardClick("Conversion Rate")}
                theme={theme}
              />
            </div>
          </div>

          {/* Critical Metrics Table - Foundation Requirements */}
          <div className="mt-8">
            <CriticalMetricsTable 
              data={dashboardData?.monthlyMetrics || []} 
              theme={theme}
            />
          </div>

          <div className="mt-8">
            <Tabs defaultValue="critical" className="w-full flex flex-col">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="w-full">
                  <TabsList className={`flex flex-wrap justify-start p-1 backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl h-auto gap-2 ${
                    theme === 'dark' ? 'bg-slate-800/30 hover:bg-slate-800/40' : 'bg-white/50 hover:bg-white/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_4px_16px_rgba(0,0,0,0.06)]'
                  }`}>
                  <TabsTrigger
                    value="critical"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.08)]'
                    }`}
                  >
                    <span className="hidden sm:inline">Critical </span>Metrics
                  </TabsTrigger>
                  <TabsTrigger
                    value="funnel"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.08)]'
                    }`}
                  >
                    <span className="hidden sm:inline">Sales </span>Funnel
                  </TabsTrigger>
                  <TabsTrigger
                    value="trends"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
                    }`}
                  >
                    <span className="hidden sm:inline">Revenue </span>Trends
                  </TabsTrigger>
                  <TabsTrigger
                    value="traffic"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
                    }`}
                  >
                    <span className="hidden sm:inline">YouTube & </span>Traffic
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
                    }`}
                  >
                    <span className="hidden sm:inline">Top </span>Videos
                  </TabsTrigger>
                  <TabsTrigger
                    value="emails"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
                    }`}
                  >
                    <span className="hidden sm:inline">Email </span>Campaigns
                  </TabsTrigger>
                  <TabsTrigger
                    value="sources"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
                    }`}
                  >
                    <span className="hidden sm:inline">Traffic </span>Sources
                  </TabsTrigger>
                  <TabsTrigger
                    value="alerts"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
                    }`}
                  >
                    <span className="hidden sm:inline">Real-Time </span>Alerts
                  </TabsTrigger>
                  <TabsTrigger
                    value="detailed-funnel"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
                    }`}
                  >
                    <span className="hidden sm:inline">Detailed </span>Funnel
                  </TabsTrigger>
                  <TabsTrigger
                    value="attribution"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
                    }`}
                  >
                    <span className="hidden sm:inline">Video </span>Attribution
                  </TabsTrigger>
                  <TabsTrigger
                    value="trends"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
                    }`}
                  >
                    <span className="hidden sm:inline">Trends & </span>Analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="geography"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap ${
                      theme === 'dark' 
                        ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' 
                        : 'data-[state=active]:bg-white data-[state=active]:text-cyan-600'
                    }`}
                  >
                    <span className="hidden sm:inline">Country </span>Breakdown
                  </TabsTrigger>
                  </TabsList>
                </div>

                <div className={`flex items-center justify-center lg:justify-start space-x-3 text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                    <span className="hidden sm:inline">Views</span>
                    <span className="sm:hidden">V</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                    <span className="hidden sm:inline">Revenue</span>
                    <span className="sm:hidden">R</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                    <span className="hidden sm:inline">Calls</span>
                    <span className="sm:hidden">C</span>
                  </div>
                </div>
              </div>

              <TabsContent value="critical" className="mt-0">
                <div className={`w-full relative rounded-lg backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                  theme === 'dark' 
                    ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                    : 'bg-white/50 border border-white/40 hover:bg-white/70 hover:border-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_16px_64px_rgba(0,0,0,0.12)]'
                }`}>
                  <CriticalMetricsTable 
                    data={dashboardData?.monthlyMetrics || []} 
                    theme={theme}
                  />
                </div>
              </TabsContent>

              <TabsContent value="funnel" className="mt-0">
                <div className={`w-full relative rounded-lg p-4 backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                  theme === 'dark' 
                    ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                    : 'bg-white/50 border border-white/40 hover:bg-white/70 hover:border-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_16px_64px_rgba(0,0,0,0.12)]'
                }`}>
                  <FunnelChart 
                    data={safeCurrentMonth} 
                    theme={theme}
                    onStageClick={(stage) => {
                      handleMetricClick(`${stage} Details`);
                    }}
                  />
                </div>
              </TabsContent>

               <TabsContent value="trends" className="mt-0">
                 <div className={`h-80 w-full relative rounded-lg backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                   theme === 'dark' 
                     ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                     : 'bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 shadow-lg hover:shadow-slate-200/20'
                 }`}>
                   {dashboardData && <TrendsChart data={dashboardData.monthlyMetrics} metric="revenue" theme={theme} />}
                 </div>
               </TabsContent>

               <TabsContent value="traffic" className="mt-0">
                 <div className={`w-full relative rounded-lg p-6 backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                   theme === 'dark' 
                     ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                     : 'bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 shadow-lg hover:shadow-slate-200/20'
                 }`}>
                   {dashboardData && <TrafficChart data={dashboardData.monthlyMetrics} theme={theme} />}
                 </div>
               </TabsContent>

               <TabsContent value="videos" className="mt-0">
                 <div className={`h-64 w-full relative rounded-lg overflow-hidden p-4 backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                   theme === 'dark' 
                     ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                     : 'bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 shadow-lg hover:shadow-slate-200/20'
                 }`}>
                   {dashboardData && <VideoPerformanceTable videos={dashboardData.videos.slice(0, 5)} />}
                 </div>
               </TabsContent>

               <TabsContent value="emails" className="mt-0">
                 <div className={`w-full relative rounded-lg backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                   theme === 'dark' 
                     ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                     : 'bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 shadow-lg hover:shadow-slate-200/20'
                 }`}>
                   {dashboardData && <EmailCampaignTracker campaigns={dashboardData.kajabiData.emailCampaigns} theme={theme} />}
                 </div>
               </TabsContent>

               <TabsContent value="sources" className="mt-0">
                 <div className={`w-full relative rounded-lg backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                   theme === 'dark' 
                     ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                     : 'bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 shadow-lg hover:shadow-slate-200/20'
                 }`}>
                   {dashboardData && <TrafficSourceAnalytics trafficSources={dashboardData.trafficSources} theme={theme} />}
                 </div>
               </TabsContent>

               <TabsContent value="alerts" className="mt-0">
                 <div className={`w-full relative rounded-lg backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                   theme === 'dark' 
                     ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                     : 'bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 shadow-lg hover:shadow-slate-200/20'
                 }`}>
                   {dashboardData && <RealTimeAlerts 
                     alerts={dashboardData.realTimeAlerts} 
                     thresholds={dashboardData.performanceThresholds}
                     theme={theme}
                     onMarkAsRead={(alertId) => {
                       console.log('Marking alert as read:', alertId);
                       // Update alert state
                     }}
                     onDismiss={(alertId) => {
                       console.log('Dismissing alert:', alertId);
                       // Remove alert
                     }}
                   />}
                 </div>
               </TabsContent>

               <TabsContent value="detailed-funnel" className="mt-0">
                 <div className={`w-full relative rounded-lg backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                   theme === 'dark' 
                     ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                     : 'bg-white/50 border border-white/40 hover:bg-white/70 hover:border-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_16px_64px_rgba(0,0,0,0.12)]'
                 }`}>
                   {dashboardData && <DetailedFunnelOverview 
                     monthlyMetrics={dashboardData.monthlyMetrics}
                     videos={dashboardData.videos}
                     sales={dashboardData.sales}
                     theme={theme}
                   />}
                 </div>
               </TabsContent>

               <TabsContent value="attribution" className="mt-0">
                 <div className={`w-full relative rounded-lg backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                   theme === 'dark' 
                     ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                     : 'bg-white/50 border border-white/40 hover:bg-white/70 hover:border-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_16px_64px_rgba(0,0,0,0.12)]'
                 }`}>
                   {dashboardData && <VideoAttributionAnalytics 
                     videos={dashboardData.videos}
                     calls={dashboardData.calls}
                     sales={dashboardData.sales}
                     theme={theme}
                   />}
                 </div>
               </TabsContent>

               <TabsContent value="trends" className="mt-0">
                 <div className={`w-full relative rounded-lg backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                   theme === 'dark' 
                     ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                     : 'bg-white/50 border border-white/40 hover:bg-white/70 hover:border-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_16px_64px_rgba(0,0,0,0.12)]'
                 }`}>
                   {dashboardData && <TrendsComparison 
                     monthlyMetrics={dashboardData.monthlyMetrics}
                     videos={dashboardData.videos}
                     theme={theme}
                   />}
                 </div>
               </TabsContent>

               <TabsContent value="geography" className="mt-0">
                 <div className={`w-full relative rounded-lg backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
                   theme === 'dark' 
                     ? 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/30 hover:border-slate-600/40' 
                     : 'bg-white/50 border border-white/40 hover:bg-white/70 hover:border-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_16px_64px_rgba(0,0,0,0.12)]'
                 }`}>
                   {dashboardData && <CountryBreakdown 
                     sales={dashboardData.sales}
                     calls={dashboardData.calls}
                     theme={theme}
                   />}
                 </div>
               </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Initialize client-side only values
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Update time
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted]);

  // Simulate changing data
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      // System status simulation removed
    }, 3000);

    return () => clearInterval(interval);
  }, [mounted]);

  // Particle effect
  useEffect(() => {
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: ParticleType[] = [];
    const particleCount = 100;

    class Particle implements ParticleType {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.5 + 0.2})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        const width = canvas?.width || 800;
        const height = canvas?.height || 600;
        
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        particle.update();
        particle.draw(ctx);
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!mounted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      
      // Cmd/Ctrl + R to refresh data
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        fetchDashboardData();
      }
      
      // Cmd/Ctrl + D to toggle theme
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
      }
      
      // Cmd/Ctrl + L to toggle loading state (for demo)
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        setIsLoading(!isLoading);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted, isLoading, fetchDashboardData, toggleTheme]);

  const formatTime = (date: Date | null) => {
    if (!date) return "--:--:--";
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Loading...";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!dashboardData && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">COACHING SYSTEM INITIALIZING</div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">Failed to load coaching analytics</p>
          <Button 
            onClick={fetchDashboardData}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const currentMonth = dashboardData?.monthlyMetrics?.[selectedMonth] || dashboardData?.monthlyMetrics?.[dashboardData.monthlyMetrics.length - 1];
  const previousMonth = dashboardData?.monthlyMetrics?.[dashboardData.monthlyMetrics.length - 2];
  
  // Add fallback values if currentMonth is undefined
  const safeCurrentMonth = currentMonth || {
    youtubeViews: 0,
    youtubeUniqueViews: 0,
    newCashCollected: { total: 0 },
    totalCashCollected: 0,
    callsBooked: 0,
    conversionRates: { acceptedToSale: 0 }
  };
  


  const formatMonth = (month: string) => {
    return new Date(month + '-01').toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Modal Component
  const DetailModal = () => {
    if (!showDetailModal || !selectedMetric) return null;

    const currentSectionData = mockSectionData[activeSection as keyof typeof mockSectionData];
    
    return (
      <div className={`fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 ${
        theme === 'dark' ? 'bg-black/50' : 'bg-slate-900/20'
      }`}>
        <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl ${
          theme === 'dark' 
            ? 'bg-slate-900/95 border border-slate-700/50' 
            : 'bg-white/95 border border-slate-200/50'
        }`}>
          <div className="p-3 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className={`text-lg sm:text-xl font-bold ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>{selectedMetric} Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className={`transition-colors p-1 ${
                  theme === 'dark' 
                    ? 'text-slate-400 hover:text-slate-100' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {currentSectionData?.metrics.map((metric, index) => (
                  <div key={index} className={`p-3 sm:p-4 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-slate-800/50 border-slate-700/50' 
                      : 'bg-slate-50/50 border-slate-200/50'
                  }`}>
                    <div className={`text-xs sm:text-sm mb-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>{metric.label}</div>
                    <div className={`text-xl sm:text-2xl font-bold mb-1 ${
                      theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                    }`}>{metric.value}</div>
                    <div className={`text-xs ${
                      metric.change.startsWith('+') 
                        ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        : metric.change.startsWith('-') 
                        ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {metric.change} from last month
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-6 p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-slate-800/30 border-slate-700/50' 
                  : 'bg-slate-50/30 border-slate-200/50'
              }`}>
                <h3 className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleQuickAction('View Report', 'Generating detailed analytics report...')}
                    disabled={quickActionLoading === 'View Report'}
                    className={`px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-md text-xs hover:bg-cyan-500/30 transition-all duration-200 hover:scale-105 flex items-center gap-1 ${
                      quickActionLoading === 'View Report' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {quickActionLoading === 'View Report' ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <BarChart3 className="w-3 h-3" />
                    )}
                    View Report
                  </button>
                  <button 
                    onClick={() => handleQuickAction('Export Data', 'Preparing CSV export with current metrics...')}
                    disabled={quickActionLoading === 'Export Data'}
                    className={`px-3 py-1 rounded-md text-xs transition-all duration-200 hover:scale-105 flex items-center gap-1 ${
                      theme === 'dark' 
                        ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
                    } ${quickActionLoading === 'Export Data' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {quickActionLoading === 'Export Data' ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3" />
                    )}
                    Export Data
                  </button>
                  <button 
                    onClick={() => handleQuickAction('Set Alert', 'Creating performance monitoring alert...')}
                    disabled={quickActionLoading === 'Set Alert'}
                    className={`px-3 py-1 rounded-md text-xs transition-all duration-200 hover:scale-105 flex items-center gap-1 ${
                      theme === 'dark' 
                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                    } ${quickActionLoading === 'Set Alert' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {quickActionLoading === 'Set Alert' ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Bell className="w-3 h-3" />
                    )}
                    Set Alert
                  </button>
                  <button 
                    onClick={() => handleQuickAction('Schedule Review', 'Scheduling weekly performance review...')}
                    disabled={quickActionLoading === 'Schedule Review'}
                    className={`px-3 py-1 rounded-md text-xs transition-all duration-200 hover:scale-105 flex items-center gap-1 ${
                      theme === 'dark' 
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                    } ${quickActionLoading === 'Schedule Review' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {quickActionLoading === 'Schedule Review' ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Calendar className="w-3 h-3" />
                    )}
                    Schedule Review
                  </button>
                  <button 
                    onClick={() => handleQuickAction('Refresh Data', 'Fetching latest analytics data...')}
                    disabled={quickActionLoading === 'Refresh Data'}
                    className={`px-3 py-1 rounded-md text-xs transition-all duration-200 hover:scale-105 flex items-center gap-1 ${
                      theme === 'dark' 
                        ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200'
                    } ${quickActionLoading === 'Refresh Data' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {quickActionLoading === 'Refresh Data' ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    Refresh Data
                  </button>
                  <button 
                    onClick={() => handleQuickAction('AI Analysis', 'Running AI-powered performance analysis...')}
                    disabled={quickActionLoading === 'AI Analysis'}
                    className={`px-3 py-1 rounded-md text-xs transition-all duration-200 hover:scale-105 flex items-center gap-1 ${
                      theme === 'dark' 
                        ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200'
                    } ${quickActionLoading === 'AI Analysis' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {quickActionLoading === 'AI Analysis' ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Zap className="w-3 h-3" />
                    )}
                    AI Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${theme} min-h-screen transition-all duration-700 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-800'
    } relative overflow-hidden`}>
      {/* Premium Background Effects */}
      <div className={`absolute inset-0 ${
        theme === 'dark' 
          ? 'bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.15),transparent_70%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.15),transparent_70%),radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.1),transparent_70%)]' 
          : 'bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.08),transparent_70%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.08),transparent_70%),radial-gradient(circle_at_40%_40%,rgba(16,185,129,0.06),transparent_70%)]'
      }`}></div>
      <div className={`absolute inset-0 opacity-40 ${
        theme === 'dark' 
          ? 'bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.05)_50%,transparent_75%),linear-gradient(-45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)]' 
          : 'bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.03)_50%,transparent_75%),linear-gradient(-45deg,transparent_25%,rgba(139,92,246,0.03)_50%,transparent_75%)]'
      }`} style={{ backgroundSize: '60px 60px' }}></div>
      
      {/* Animated Background Particles */}
      <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${theme === 'dark' ? 'opacity-40' : 'opacity-25'}`} />
      
      {/* Detail Modal */}
      <DetailModal />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-scale">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-10 w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-pulse-glow"></div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-2">NextGen Dashboard</div>
              <div className="text-cyan-400 font-mono text-sm tracking-wider animate-shimmer">
                INITIALIZING WORLD-CLASS ANALYTICS
              </div>
              <div className="mt-4 flex space-x-1">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-none px-2 sm:px-4 lg:px-6 xl:px-8 relative z-10">
        {/* Premium Header */}
        <header className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:py-6 mb-6 sm:mb-8 gap-3 sm:gap-0 backdrop-blur-xl rounded-2xl transition-all duration-500 ${
          theme === 'dark' 
            ? 'bg-slate-900/20 border border-slate-700/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
            : 'bg-white/40 border border-white/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.06)]'
        } px-4 sm:px-6 hover:shadow-2xl hover:scale-[1.01]`}>
          <div className="flex items-center space-x-3 animate-fade-in-scale">
            <DashboardIcon className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-500 animate-premium-float drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black gradient-text tracking-tight animate-card-entrance">
                NextGen Dashboard
              </span>
              <span className={`text-xs font-medium tracking-wider transition-all duration-500 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                ENTERPRISE ANALYTICS PLATFORM
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
            <AdvancedSearch 
              isOpen={searchOpen}
              onClose={() => setSearchOpen(false)}
              onSearch={(query) => {
                console.log('Search:', query);
                setSearchOpen(false);
              }}
            />

            <div className="flex items-center space-x-2 sm:space-x-3">
              <NotificationCenter theme={theme} />

              <button
                onClick={toggleTheme}
                className={`relative group overflow-hidden rounded-xl h-8 w-8 sm:h-10 sm:w-10 transition-all duration-500 transform hover:scale-110 active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-yellow-500/50 shadow-lg hover:shadow-yellow-500/25'
                    : 'bg-white/70 border border-white/50 hover:border-white/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_8px_32px_rgba(0,0,0,0.12)]'
                } backdrop-blur-sm hover:backdrop-blur-md`}
              >
                {/* Background glow effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20'
                    : 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20'
                }`}></div>
                
                {/* Rotating background effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:rotate-180 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-yellow-400/10 via-transparent to-orange-400/10'
                    : 'bg-gradient-to-r from-blue-400/10 via-transparent to-indigo-400/10'
                }`}></div>
                
                {/* Icon container */}
                <div className="relative z-10 flex items-center justify-center h-full w-full">
                  {theme === "dark" ? (
                    <Sun className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500 transform group-hover:rotate-180 group-hover:scale-110 ${
                      'text-yellow-400 group-hover:text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]'
                    }`} />
                  ) : (
                    <Moon className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500 transform group-hover:-rotate-12 group-hover:scale-110 ${
                      'text-indigo-600 group-hover:text-indigo-500 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(79,70,229,0.8)]'
                    }`} />
                  )}
                </div>
                
                {/* Pulse effect on click */}
                <div className={`absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 transition-opacity duration-150 ${
                  theme === 'dark'
                    ? 'bg-yellow-400/30'
                    : 'bg-indigo-400/30'
                } animate-ping`}></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
                    theme === 'dark' ? 'via-yellow-200/30' : 'via-blue-200/30'
                  }`}></div>
                </div>
              </button>

              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-slate-700 text-cyan-500 text-xs sm:text-sm">CH</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Responsive Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
          {/* Mobile/Tablet Navigation */}
          <div className="lg:hidden col-span-1">
            <Card className={`backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
              theme === 'dark' 
                ? 'bg-slate-900/20 border-slate-700/20 hover:bg-slate-900/30 hover:border-slate-600/30' 
                : 'bg-white/60 border-white/40 hover:bg-white/80 hover:border-white/60 shadow-lg hover:shadow-blue-200/30'
            }`}>
              <CardContent className="p-2 sm:p-3">
                <nav className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2 min-w-0">
                  <NavItem 
                    icon={Command} 
                    label="Dashboard" 
                    active={activeSection === "Dashboard"} 
                    onClick={() => handleSectionClick("Dashboard")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={PlayIcon} 
                    label="YouTube" 
                    active={activeSection === "YouTube"}
                    onClick={() => handleSectionClick("YouTube")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={PhoneIcon} 
                    label="Calls" 
                    active={activeSection === "Calls"}
                    onClick={() => handleSectionClick("Calls")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={CurrencyDollarIcon} 
                    label="Revenue" 
                    active={activeSection === "Revenue"}
                    onClick={() => handleSectionClick("Revenue")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={UserGroupIcon} 
                    label="Leads" 
                    active={activeSection === "Leads"}
                    onClick={() => handleSectionClick("Leads")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={BarChart3} 
                    label="Analytics" 
                    active={activeSection === "Analytics"}
                    onClick={() => handleSectionClick("Analytics")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={Terminal} 
                    label="AI Insights" 
                    active={activeSection === "AI Insights"}
                    onClick={() => handleSectionClick("AI Insights")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={Settings} 
                    label="Settings" 
                    active={activeSection === "Settings"}
                    onClick={() => handleSectionClick("Settings")}
                    theme={theme}
                  />
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-2">
            <Card className={`backdrop-blur-xl h-full transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl ${
              theme === 'dark' 
                ? 'bg-slate-900/20 border-slate-700/20 hover:bg-slate-900/30 hover:border-slate-600/30' 
                : 'bg-white/60 border-white/40 hover:bg-white/80 hover:border-white/60 shadow-lg hover:shadow-blue-200/30'
            }`}>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem 
                    icon={Command} 
                    label="Dashboard" 
                    active={activeSection === "Dashboard"} 
                    onClick={() => handleSectionClick("Dashboard")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={PlayIcon} 
                    label="YouTube" 
                    active={activeSection === "YouTube"}
                    onClick={() => handleSectionClick("YouTube")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={PhoneIcon} 
                    label="Calls" 
                    active={activeSection === "Calls"}
                    onClick={() => handleSectionClick("Calls")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={CurrencyDollarIcon} 
                    label="Revenue" 
                    active={activeSection === "Revenue"}
                    onClick={() => handleSectionClick("Revenue")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={UserGroupIcon} 
                    label="Leads" 
                    active={activeSection === "Leads"}
                    onClick={() => handleSectionClick("Leads")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={BarChart3} 
                    label="Analytics" 
                    active={activeSection === "Analytics"}
                    onClick={() => handleSectionClick("Analytics")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={Terminal} 
                    label="AI Insights" 
                    active={activeSection === "AI Insights"}
                    onClick={() => handleSectionClick("AI Insights")}
                    theme={theme}
                  />
                  <NavItem 
                    icon={Settings} 
                    label="Settings" 
                    active={activeSection === "Settings"}
                    onClick={() => handleSectionClick("Settings")}
                    theme={theme}
                  />
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard content */}
          <div className="col-span-1 lg:col-span-7">
            <div className="grid gap-3 sm:gap-4 lg:gap-6">
              {activeSection === "Dashboard" ? renderDefaultDashboard() : renderSectionContent()}
            </div>
          </div>

          {/* Right sidebar - responsive */}
          <div className="col-span-1 lg:col-span-3">
            <div className="grid gap-6">
              {/* AI Insights */}
              <Card className={`backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl hover:scale-[1.02] ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30 hover:from-indigo-800/40 hover:to-purple-800/30 hover:border-indigo-400/40 hover:shadow-indigo-500/30' 
                  : 'bg-gradient-to-br from-white/70 to-indigo-50/70 border-white/50 hover:from-white/80 hover:to-indigo-50/80 hover:border-white/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_8px_32px_rgba(99,102,241,0.08)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_16px_64px_rgba(99,102,241,0.12)]'
              }`}>
                <CardHeader 
                  className={`pb-3 cursor-pointer transition-colors ${
                    theme === 'dark' 
                      ? 'border-b border-indigo-500/30 hover:bg-indigo-800/20' 
                      : 'border-b border-white/40 hover:bg-white/20'
                  }`}
                  onClick={() => handleSectionClick("AI Insights")}
                >
                  <CardTitle className={`flex items-center text-sm ${
                    theme === 'dark' ? 'text-indigo-100' : 'text-slate-800'
                  }`}>
                    <Terminal className={`mr-2 h-4 w-4 ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                    AI Insights
                    <svg className={`w-4 h-4 ml-auto ${
                      theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {dashboardData.aiInsights.slice(0, 3).map((insight, index) => (
                      <AlertItem
                        key={`insight-${insight.title}-${index}`}
                        title={insight.title}
                        time="2m ago"
                        description={insight.description}
                        type={insight.type === 'alert' ? 'warning' : insight.type === 'trend' ? 'success' : 'info'}
                        onClick={() => handleMetricClick(`AI Insight: ${insight.title}`)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className={`backdrop-blur-xl transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-xl hover:scale-[1.02] ${
                theme === 'dark' 
                  ? 'bg-slate-900/20 border-slate-700/20 hover:bg-slate-900/30 hover:border-slate-600/30' 
                  : 'bg-white/70 border-green-200/40 hover:bg-white/90 hover:border-green-300/60 shadow-lg hover:shadow-green-200/30'
              }`}>
                <CardHeader 
                  className={`pb-3 cursor-pointer transition-colors ${
                    theme === 'dark' 
                      ? 'border-b border-slate-700/50 hover:bg-slate-800/30' 
                      : 'border-b border-slate-200/50 hover:bg-slate-100/30'
                  }`}
                  onClick={() => handleSectionClick("Analytics")}
                >
                  <CardTitle className={`flex items-center text-sm ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    <BarChart3 className="mr-2 h-4 w-4 text-green-500" />
                    Key Performance
                    <svg className={`w-4 h-4 ml-auto ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div 
                      className={`cursor-pointer p-2 rounded-md transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-md hover:scale-105 ${
                        theme === 'dark' 
                          ? 'hover:bg-slate-800/40 hover:shadow-lg hover:shadow-slate-900/50' 
                          : 'hover:bg-white/40 hover:shadow-lg hover:shadow-slate-200/30'
                      }`}
                      onClick={() => handleMetricClick("Show-up Rate")}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>Show-up Rate</span>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                        }`}>{(safeCurrentMonth.showUpRate || 0).toFixed(1)}%</span>
                      </div>
                      <Progress value={safeCurrentMonth.showUpRate || 0} className="h-2 mt-2" />
                    </div>
                    
                    <div 
                      className={`cursor-pointer p-2 rounded-md transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-md hover:scale-105 ${
                        theme === 'dark' 
                          ? 'hover:bg-slate-800/40 hover:shadow-lg hover:shadow-slate-900/50' 
                          : 'hover:bg-white/40 hover:shadow-lg hover:shadow-slate-200/30'
                      }`}
                      onClick={() => handleMetricClick("Call to Sale Rate")}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>Call → Sale Rate</span>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                        }`}>{(safeCurrentMonth.conversionRates?.acceptedToSale || 0).toFixed(1)}%</span>
                      </div>
                      <Progress value={safeCurrentMonth.conversionRates?.acceptedToSale || 0} className="h-2 mt-2" />
                    </div>
                    
                    <div 
                      className={`cursor-pointer p-2 rounded-md transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-md hover:scale-105 ${
                        theme === 'dark' 
                          ? 'hover:bg-slate-800/40 hover:shadow-lg hover:shadow-slate-900/50' 
                          : 'hover:bg-white/40 hover:shadow-lg hover:shadow-slate-200/30'
                      }`}
                      onClick={() => handleMetricClick("Website to Call Rate")}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>Website → Call Rate</span>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                        }`}>{(safeCurrentMonth.conversionRates?.websiteToCall || 0).toFixed(1)}%</span>
                      </div>
                      <Progress value={safeCurrentMonth.conversionRates?.websiteToCall || 0} className="h-2 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Display */}
              <Card 
                className={`backdrop-blur-xl cursor-pointer hover:scale-105 transition-all duration-300 hover:backdrop-blur-2xl hover:shadow-2xl ${
                  theme === 'dark' 
                    ? 'bg-slate-900/20 border-slate-700/20 hover:bg-slate-900/30 hover:border-slate-600/30 hover:shadow-cyan-500/30' 
                    : 'bg-white/70 border-cyan-200/40 hover:bg-white/90 hover:border-cyan-300/60 shadow-lg hover:shadow-cyan-200/30'
                }`}
                onClick={() => handleMetricClick("Time & Analytics")}
              >
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-mono mb-1 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>
                    {formatTime(currentTime)}
                  </div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {formatDate(currentTime)}
                  </div>
                  <div className={`text-xs mt-2 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    {formatMonth(safeCurrentMonth.month || new Date().toISOString().slice(0, 7))} Analytics
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ 
  icon: Icon, 
  label, 
  active, 
  onClick,
  theme 
}: { 
  icon: LucideIcon; 
  label: string; 
  active?: boolean; 
  onClick?: () => void; 
  theme?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 lg:w-full flex items-center space-x-1 lg:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 hover:scale-105 backdrop-blur-sm hover:backdrop-blur-md ${
        active
          ? theme === 'dark'
            ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
            : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-300/50 shadow-lg shadow-blue-200/30 hover:shadow-xl hover:shadow-blue-300/40"
          : theme === 'dark'
            ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/30 hover:shadow-lg hover:shadow-slate-900/50"
            : "text-slate-700 hover:text-slate-900 hover:bg-white/70 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.08)] hover:border hover:border-white/60"
      }`}
    >
      <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
      <span className="font-medium whitespace-nowrap lg:whitespace-normal">{label}</span>
    </button>
  );
}



// Coaching Metric Card Component
function CoachingMetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
  onClick,
  theme,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend: "up" | "down" | "stable";
  color: string;
  detail: string;
  onClick?: () => void;
  theme?: string;
}) {
  const getColor = () => {
    if (theme === 'dark') {
      switch (color) {
        case "cyan":
          return "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30";
        case "purple":
          return "from-purple-500/20 to-purple-600/20 border-purple-500/30";
        case "blue":
          return "from-blue-500/20 to-blue-600/20 border-blue-500/30";
        default:
          return "from-slate-500/20 to-slate-600/20 border-slate-500/30";
      }
    } else {
      switch (color) {
        case "cyan":
          return "from-white/70 to-cyan-50/70 border-white/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_8px_32px_rgba(6,182,212,0.08)]";
        case "purple":
          return "from-white/70 to-purple-50/70 border-white/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_8px_32px_rgba(147,51,234,0.08)]";
        case "blue":
          return "from-white/70 to-blue-50/70 border-white/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_8px_32px_rgba(59,130,246,0.08)]";
        default:
          return "from-white/70 to-gray-50/70 border-white/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.06)]";
      }
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowTrendingUpIcon className="h-3 w-3 text-green-400" />;
      case "down":
        return <ArrowTrendingDownIcon className="h-3 w-3 text-red-400" />;
      default:
        return <div className="h-3 w-3 rounded-full bg-slate-400" />;
    }
  };

  const getIconColor = () => {
    if (theme === 'dark') {
      switch (color) {
        case "cyan": return "text-cyan-400";
        case "purple": return "text-purple-400";
        case "blue": return "text-blue-400";
        default: return "text-slate-400";
      }
    } else {
      switch (color) {
        case "cyan": return "text-cyan-600";
        case "purple": return "text-purple-600";
        case "blue": return "text-blue-600";
        default: return "text-slate-600";
      }
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br ${getColor()} rounded-xl border p-4 backdrop-blur-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:backdrop-blur-2xl ${
        theme === 'dark' 
          ? `hover:shadow-2xl hover:shadow-${color}-500/30 ${onClick ? 'hover:border-' + color + '-400/60' : ''}` 
          : `hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_16px_64px_rgba(0,0,0,0.12)] ${onClick ? 'hover:border-white/70' : ''}`
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Icon className={`h-4 w-4 ${getIconColor()}`} />
            <p className={`text-xs font-medium ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>{title}</p>
          </div>
          <p className={`text-xl font-bold ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
          }`}>
            {title.includes("Revenue") ? `$${value.toLocaleString()}` : value.toLocaleString()}
          </p>
          <div className="flex items-center space-x-1 mt-1">
            {getTrendIcon()}
            <p className={`text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>{detail}</p>
          </div>
        </div>
        {onClick && (
          <div className={`transition-colors ${
            theme === 'dark' 
              ? 'text-slate-400 hover:text-slate-200' 
              : 'text-slate-600 hover:text-slate-900'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// Alert Item Component
function AlertItem({
  title,
  time,
  description,
  type,
  onClick,
}: {
  title: string;
  time: string;
  description: string;
  type: "info" | "warning" | "error" | "success" | "update";
  onClick?: () => void;
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-500/10 border-red-500/20",
          icon: "text-red-400",
          text: "text-red-300",
        };
      case "warning":
        return {
          bg: "bg-amber-500/10 border-amber-500/20",
          icon: "text-amber-400",
          text: "text-amber-300",
        };
      case "success":
        return {
          bg: "bg-green-500/10 border-green-500/20",
          icon: "text-green-400",
          text: "text-green-300",
        };
      case "info":
        return {
          bg: "bg-blue-500/10 border-blue-500/20",
          icon: "text-blue-400",
          text: "text-blue-300",
        };
      default:
        return {
          bg: "bg-slate-500/10 border-slate-500/20",
          icon: "text-slate-400",
          text: "text-slate-300",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      onClick={onClick}
      className={`${styles.bg} border rounded-lg p-3 ${onClick ? 'cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-md' : ''}`}
    >
      <div className="flex items-start space-x-2">
        <AlertCircle className={`h-4 w-4 ${styles.icon} mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-xs font-medium ${styles.text}`}>{title}</p>
            <span className="text-xs text-slate-500">{time}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
        {onClick && (
          <div className="text-slate-400 hover:text-slate-200 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
