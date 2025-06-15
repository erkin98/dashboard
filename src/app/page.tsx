'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  PlayIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  UserGroupIcon,
  ChartBarIcon,
  EyeIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Command,
  Cpu,
  Database,
  Download,
  Globe,
  HardDrive,
  Hexagon,
  LineChart,
  Lock,
  type LucideIcon,
  MessageSquare,
  Mic,
  Moon,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sun,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { MetricCard } from '@/components/MetricCard';
import { FunnelChart } from '@/components/FunnelChart';
import { TrendsChart } from '@/components/TrendsChart';
import { VideoPerformanceTable } from '@/components/VideoPerformanceTable';
import { AIInsights } from '@/components/AIInsights';
import { DashboardData } from '@/types';

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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth] = useState(-1);
  const [timeRange, setTimeRange] = useState<string>('all');
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState(85);
  const [isLoading, setIsLoading] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard', {
        method: timeRange === 'all' ? 'GET' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: timeRange !== 'all' ? JSON.stringify({ timeRange }) : undefined,
      });
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate changing data
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(Math.floor(Math.random() * 10) + 80);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Particle effect
  useEffect(() => {
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
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!data && loading) {
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

  if (!data) {
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

  const currentMonth = data.monthlyMetrics[selectedMonth] || data.monthlyMetrics[data.monthlyMetrics.length - 1];
  const previousMonth = data.monthlyMetrics[data.monthlyMetrics.length - 2];
  
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatMonth = (month: string) => {
    return new Date(month + '-01').toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`}>
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Loading overlay */}
      {isLoading && (
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
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Hexagon className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              COACHING NEXUS
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search metrics..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-slate-700 text-cyan-500">CH</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem icon={Command} label="Dashboard" active />
                  <NavItem icon={PlayIcon} label="YouTube" />
                  <NavItem icon={PhoneIcon} label="Calls" />
                  <NavItem icon={CurrencyDollarIcon} label="Revenue" />
                  <NavItem icon={UserGroupIcon} label="Leads" />
                  <NavItem icon={BarChart3} label="Analytics" />
                  <NavItem icon={Terminal} label="AI Insights" />
                  <NavItem icon={Settings} label="Settings" />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 font-mono">SYSTEM STATUS</div>
                  <div className="space-y-3">
                    <StatusItem label="YouTube API" value={92} color="cyan" />
                    <StatusItem label="Sales Funnel" value={85} color="green" />
                    <StatusItem label="Lead Network" value={78} color="blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7">
            <div className="grid gap-6">
              {/* System overview */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                      Coaching Business Overview
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                        LIVE
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={fetchDashboardData}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CoachingMetricCard
                      title="YouTube Views"
                      value={currentMonth.youtubeViews}
                      icon={PlayIcon}
                      trend={previousMonth && currentMonth.youtubeViews > previousMonth.youtubeViews ? "up" : "down"}
                      color="cyan"
                      detail={`${currentMonth.youtubeUniqueViews.toLocaleString()} unique`}
                    />
                    <CoachingMetricCard
                      title="Revenue"
                      value={currentMonth.newCashCollected.total}
                      icon={CurrencyDollarIcon}
                      trend={previousMonth && currentMonth.newCashCollected.total > previousMonth.newCashCollected.total ? "up" : "stable"}
                      color="purple"
                      detail={`$${currentMonth.totalCashCollected.toLocaleString()} total`}
                    />
                    <CoachingMetricCard
                      title="Conversion Rate"
                      value={Math.round(currentMonth.conversionRates.acceptedToSale)}
                      icon={TrophyIcon}
                      trend="up"
                      color="blue"
                      detail={`${currentMonth.callsBooked} calls booked`}
                    />
                  </div>

                  <div className="mt-8">
                    <Tabs defaultValue="funnel" className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-slate-800/50 p-1">
                          <TabsTrigger
                            value="funnel"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Sales Funnel
                          </TabsTrigger>
                          <TabsTrigger
                            value="trends"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Revenue Trends
                          </TabsTrigger>
                          <TabsTrigger
                            value="videos"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Top Videos
                          </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                            Views
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                            Revenue
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                            Calls
                          </div>
                        </div>
                      </div>

                      <TabsContent value="funnel" className="mt-0">
                        <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <FunnelChart data={currentMonth} />
                        </div>
                      </TabsContent>

                      <TabsContent value="trends" className="mt-0">
                        <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <TrendsChart data={data.monthlyMetrics} metric="revenue" />
                        </div>
                      </TabsContent>

                      <TabsContent value="videos" className="mt-0">
                        <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden p-4">
                          <VideoPerformanceTable videos={data.videos.slice(0, 5)} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              {/* AI Insights */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <CardTitle className="text-slate-100 flex items-center text-sm">
                    <Terminal className="mr-2 h-4 w-4 text-purple-500" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {data.aiInsights.slice(0, 3).map((insight, index) => (
                      <AlertItem
                        key={index}
                        title={insight.title}
                        time="2m ago"
                        description={insight.description}
                        type={insight.type === 'alert' ? 'warning' : insight.type === 'trend' ? 'success' : 'info'}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <CardTitle className="text-slate-100 flex items-center text-sm">
                    <BarChart3 className="mr-2 h-4 w-4 text-green-500" />
                    Key Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Show-up Rate</span>
                      <span className="text-sm font-medium text-slate-200">{currentMonth.showUpRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={currentMonth.showUpRate} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Call → Sale Rate</span>
                      <span className="text-sm font-medium text-slate-200">{currentMonth.conversionRates.acceptedToSale.toFixed(1)}%</span>
                    </div>
                    <Progress value={currentMonth.conversionRates.acceptedToSale} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Website → Call Rate</span>
                      <span className="text-sm font-medium text-slate-200">{currentMonth.conversionRates.websiteToCall.toFixed(1)}%</span>
                    </div>
                    <Progress value={currentMonth.conversionRates.websiteToCall} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Time Display */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-mono text-cyan-400 mb-1">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDate(currentTime)}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    {formatMonth(currentMonth.month)} Analytics
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
function NavItem({ icon: Icon, label, active }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-slate-800/50 text-cyan-400 border border-slate-700/50"
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/30"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

// Status Item Component
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "text-cyan-400";
      case "green":
        return "text-green-400";
      case "blue":
        return "text-blue-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-medium ${getColor()}`}>{value}%</span>
        <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${
              color === "cyan" ? "from-cyan-500 to-cyan-400" :
              color === "green" ? "from-green-500 to-green-400" :
              "from-blue-500 to-blue-400"
            }`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
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
}: {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  trend: "up" | "down" | "stable";
  color: string;
  detail: string;
}) {
  const getColor = () => {
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
    switch (color) {
      case "cyan": return "text-cyan-400";
      case "purple": return "text-purple-400";
      case "blue": return "text-blue-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getColor()} rounded-lg border p-4 backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Icon className={`h-4 w-4 ${getIconColor()}`} />
            <p className="text-xs text-slate-400 font-medium">{title}</p>
          </div>
          <p className="text-xl font-bold text-slate-100">
            {title.includes("Revenue") ? `$${value.toLocaleString()}` : value.toLocaleString()}
          </p>
          <div className="flex items-center space-x-1 mt-1">
            {getTrendIcon()}
            <p className="text-xs text-slate-400">{detail}</p>
          </div>
        </div>
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
}: {
  title: string;
  time: string;
  description: string;
  type: "info" | "warning" | "error" | "success" | "update";
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
          bg: "bg-yellow-500/10 border-yellow-500/20",
          icon: "text-yellow-400",
          text: "text-yellow-300",
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
    <div className={`${styles.bg} border rounded-lg p-3`}>
      <div className="flex items-start space-x-2">
        <AlertCircle className={`h-4 w-4 ${styles.icon} mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-xs font-medium ${styles.text}`}>{title}</p>
            <span className="text-xs text-slate-500">{time}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
