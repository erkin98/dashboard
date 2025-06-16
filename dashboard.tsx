"use client"

import { useEffect, useState, useRef } from "react"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  CircleOff,
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [systemStatus, setSystemStatus] = useState(85)
  const [cpuUsage, setCpuUsage] = useState(42)
  const [memoryUsage, setMemoryUsage] = useState(68)
  const [networkStatus, setNetworkStatus] = useState(92)
  const [securityLevel, setSecurityLevel] = useState(75)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Apply theme to DOM and persist in localStorage
  useEffect(() => {
    document.documentElement.className = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as "dark" | "light" | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simulate changing data
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 30)
      setMemoryUsage(Math.floor(Math.random() * 20) + 60)
      setNetworkStatus(Math.floor(Math.random() * 15) + 80)
      setSystemStatus(Math.floor(Math.random() * 10) + 80)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 80

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * (canvas?.width || 800)
        this.y = Math.random() * (canvas?.height || 600)
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        
        // Theme-aware particle colors
        if (theme === 'dark') {
          this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.4 + 0.1})`
        } else {
          this.color = `rgba(${Math.floor(Math.random() * 50) + 80}, ${Math.floor(Math.random() * 50) + 120}, ${Math.floor(Math.random() * 50) + 180}, ${Math.random() * 0.2 + 0.05})`
        }
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        const width = canvas?.width || 800
        const height = canvas?.height || 600
        
        if (this.x > width) this.x = 0
        if (this.x < 0) this.x = width
        if (this.y > height) this.y = 0
        if (this.y < 0) this.y = height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [theme]) // Re-run when theme changes

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className={`${theme} min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50'
    } relative overflow-hidden`}>
      {/* Background particle effect */}
      <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${theme === 'dark' ? 'opacity-20' : 'opacity-10'}`} />

      {/* Loading overlay */}
      {isLoading && (
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/80' : 'bg-white/80'} flex items-center justify-center z-50 backdrop-blur-sm`}>
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className={`absolute inset-0 border-4 ${theme === 'dark' ? 'border-cyan-500/30' : 'border-blue-500/30'} rounded-full animate-ping`}></div>
              <div className={`absolute inset-2 border-4 ${theme === 'dark' ? 'border-t-cyan-500' : 'border-t-blue-500'} border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
              <div className={`absolute inset-4 border-4 ${theme === 'dark' ? 'border-r-purple-500' : 'border-r-indigo-500'} border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow`}></div>
              <div className={`absolute inset-6 border-4 ${theme === 'dark' ? 'border-b-blue-500' : 'border-b-emerald-500'} border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower`}></div>
              <div className={`absolute inset-8 border-4 ${theme === 'dark' ? 'border-l-green-500' : 'border-l-violet-500'} border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin`}></div>
            </div>
            <div className={`mt-4 ${theme === 'dark' ? 'text-cyan-500' : 'text-blue-600'} font-mono text-sm tracking-wider font-medium`}>
              SYSTEM INITIALIZING
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className={`flex items-center justify-between py-4 border-b ${
          theme === 'dark' ? 'border-slate-700/50' : 'border-slate-300/50'
        } mb-6`}>
          <div className="flex items-center space-x-2">
            <Hexagon className={`h-8 w-8 ${theme === 'dark' ? 'text-cyan-500' : 'text-blue-600'}`} />
            <span className={`text-xl font-bold ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
            }`}>
              NEXUS OS
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className={`hidden md:flex items-center space-x-1 ${
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-300/50'
            } rounded-full px-3 py-1.5 border backdrop-blur-sm`}>
              <Search className={`h-4 w-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search systems..."
                className={`bg-transparent border-none focus:outline-none text-sm w-40 ${
                  theme === 'dark' 
                    ? 'placeholder:text-slate-500 text-slate-100' 
                    : 'placeholder:text-slate-400 text-slate-700'
                }`}
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className={`relative ${
                      theme === 'dark' ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-700'
                    }`}>
                      <Bell className="h-5 w-5" />
                      <span className={`absolute -top-1 -right-1 h-2 w-2 ${
                        theme === 'dark' ? 'bg-cyan-500' : 'bg-blue-500'
                      } rounded-full animate-pulse`}></span>
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
                      className={`${theme === 'dark' ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                    >
                      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className={`${
                  theme === 'dark' ? 'bg-slate-700 text-cyan-500' : 'bg-slate-200 text-blue-600'
                }`}>CM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className={`${
              theme === 'dark' 
                ? 'bg-slate-900/50 border-slate-700/50' 
                : 'bg-white/70 border-slate-300/50'
            } backdrop-blur-sm h-full transition-colors duration-300`}>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem icon={Command} label="Dashboard" active theme={theme} />
                  <NavItem icon={Activity} label="Diagnostics" theme={theme} />
                  <NavItem icon={Database} label="Data Center" theme={theme} />
                  <NavItem icon={Globe} label="Network" theme={theme} />
                  <NavItem icon={Shield} label="Security" theme={theme} />
                  <NavItem icon={Terminal} label="Console" theme={theme} />
                  <NavItem icon={MessageSquare} label="Communications" theme={theme} />
                  <NavItem icon={Settings} label="Settings" theme={theme} />
                </nav>

                <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-300/50'}`}>
                  <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} mb-2 font-mono font-medium`}>
                    SYSTEM STATUS
                  </div>
                  <div className="space-y-3">
                    <StatusItem label="Core Systems" value={systemStatus} color="cyan" theme={theme} />
                    <StatusItem label="Security" value={securityLevel} color="green" theme={theme} />
                    <StatusItem label="Network" value={networkStatus} color="blue" theme={theme} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7">
            <div className="grid gap-6">
              {/* System overview */}
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700/50' 
                  : 'bg-white/70 border-slate-300/50'
              } backdrop-blur-sm overflow-hidden transition-colors duration-300`}>
                <CardHeader className={`border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-300/50'} pb-3`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} flex items-center font-semibold`}>
                      <Activity className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-cyan-500' : 'text-blue-600'}`} />
                      System Overview
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={`${
                        theme === 'dark' 
                          ? 'bg-slate-800/50 text-cyan-400 border-cyan-500/50' 
                          : 'bg-blue-50 text-blue-600 border-blue-300/50'
                      } text-xs`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${
                          theme === 'dark' ? 'bg-cyan-500' : 'bg-blue-500'
                        } mr-1 animate-pulse`}></div>
                        LIVE
                      </Badge>
                      <Button variant="ghost" size="icon" className={`h-8 w-8 ${
                        theme === 'dark' ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-700'
                      }`}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard
                      title="CPU Usage"
                      value={cpuUsage}
                      icon={Cpu}
                      trend="up"
                      color="cyan"
                      detail="3.8 GHz | 12 Cores"
                      theme={theme}
                    />
                    <MetricCard
                      title="Memory"
                      value={memoryUsage}
                      icon={HardDrive}
                      trend="stable"
                      color="purple"
                      detail="16.4 GB / 24 GB"
                      theme={theme}
                    />
                    <MetricCard
                      title="Network"
                      value={networkStatus}
                      icon={Wifi}
                      trend="down"
                      color="blue"
                      detail="1.2 GB/s | 42ms"
                      theme={theme}
                    />
                  </div>

                  <div className="mt-8">
                    <Tabs defaultValue="performance" className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-200/50'} p-1`}>
                          <TabsTrigger
                            value="performance"
                            className={`font-medium ${
                              theme === 'dark' 
                                ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400 text-slate-400 hover:text-slate-200' 
                                : 'data-[state=active]:bg-white data-[state=active]:text-blue-600 text-slate-600 hover:text-slate-800'
                            }`}
                          >
                            Performance
                          </TabsTrigger>
                          <TabsTrigger
                            value="processes"
                            className={`font-medium ${
                              theme === 'dark' 
                                ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400 text-slate-400 hover:text-slate-200' 
                                : 'data-[state=active]:bg-white data-[state=active]:text-blue-600 text-slate-600 hover:text-slate-800'
                            }`}
                          >
                            Processes
                          </TabsTrigger>
                          <TabsTrigger
                            value="storage"
                            className={`font-medium ${
                              theme === 'dark' 
                                ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400 text-slate-400 hover:text-slate-200' 
                                : 'data-[state=active]:bg-white data-[state=active]:text-blue-600 text-slate-600 hover:text-slate-800'
                            }`}
                          >
                            Storage
                          </TabsTrigger>
                        </TabsList>

                        <div className={`flex items-center space-x-2 text-xs font-medium ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                            CPU
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                            Memory
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                            Network
                          </div>
                        </div>
                      </div>

                      <TabsContent value="performance" className="mt-0">
                        <div className={`h-64 w-full relative ${
                          theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-100/70 border-slate-300/50'
                        } rounded-lg border overflow-hidden`}>
                          <PerformanceChart theme={theme} />
                          <div className={`absolute bottom-4 right-4 ${
                            theme === 'dark' ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-slate-300/50'
                          } backdrop-blur-sm rounded-md px-3 py-2 border`}>
                            <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>System Load</div>
                            <div className={`text-lg font-mono font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>{cpuUsage}%</div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="processes" className="mt-0">
                        <div className={`${
                          theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-100/70 border-slate-300/50'
                        } rounded-lg border overflow-hidden`}>
                          <div className={`grid grid-cols-12 text-xs font-medium p-3 border-b ${
                            theme === 'dark' 
                              ? 'text-slate-400 border-slate-700/50 bg-slate-800/50' 
                              : 'text-slate-600 border-slate-300/50 bg-slate-200/50'
                          }`}>
                            <div className="col-span-1">PID</div>
                            <div className="col-span-4">Process</div>
                            <div className="col-span-2">User</div>
                            <div className="col-span-2">CPU</div>
                            <div className="col-span-2">Memory</div>
                            <div className="col-span-1">Status</div>
                          </div>

                          <div className={`${theme === 'dark' ? 'divide-slate-700/30' : 'divide-slate-300/30'} divide-y`}>
                            <ProcessRow
                              pid="1024"
                              name="system_core.exe"
                              user="SYSTEM"
                              cpu={12.4}
                              memory={345}
                              status="running"
                              theme={theme}
                            />
                            <ProcessRow
                              pid="1842"
                              name="nexus_service.exe"
                              user="SYSTEM"
                              cpu={8.7}
                              memory={128}
                              status="running"
                              theme={theme}
                            />
                            <ProcessRow
                              pid="2156"
                              name="security_monitor.exe"
                              user="ADMIN"
                              cpu={5.2}
                              memory={96}
                              status="running"
                              theme={theme}
                            />
                            <ProcessRow
                              pid="3012"
                              name="network_manager.exe"
                              user="SYSTEM"
                              cpu={3.8}
                              memory={84}
                              status="running"
                              theme={theme}
                            />
                            <ProcessRow
                              pid="4268"
                              name="user_interface.exe"
                              user="USER"
                              cpu={15.3}
                              memory={256}
                              status="running"
                              theme={theme}
                            />
                            <ProcessRow
                              pid="5124"
                              name="data_analyzer.exe"
                              user="ADMIN"
                              cpu={22.1}
                              memory={512}
                              status="running"
                              theme={theme}
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="storage" className="mt-0">
                        <div className={`${
                          theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-100/70 border-slate-300/50'
                        } rounded-lg border p-4`}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <StorageItem name="System Drive (C:)" total={512} used={324} type="SSD" theme={theme} />
                            <StorageItem name="Data Drive (D:)" total={2048} used={1285} type="HDD" theme={theme} />
                            <StorageItem name="Backup Drive (E:)" total={4096} used={1865} type="HDD" theme={theme} />
                            <StorageItem name="External Drive (F:)" total={1024} used={210} type="SSD" theme={theme} />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`${
                  theme === 'dark' 
                    ? 'bg-slate-900/50 border-slate-700/50' 
                    : 'bg-white/70 border-slate-300/50'
                } backdrop-blur-sm`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} flex items-center text-base`}>
                      <Shield className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`} />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Firewall</div>
                        <Badge className={`${theme === 'dark' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}`}>Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Intrusion Detection</div>
                        <Badge className={`${theme === 'dark' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}`}>Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Encryption</div>
                        <Badge className={`${theme === 'dark' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}`}>Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Threat Database</div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>
                          Updated <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>12 min ago</span>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Security Level</div>
                          <div className={`text-sm ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>{securityLevel}%</div>
                        </div>
                        <Progress value={securityLevel} className="h-2 bg-slate-700">
                          <div
                            className={`h-full bg-gradient-to-r ${
                              theme === 'dark' 
                                ? 'from-green-500 to-cyan-500' 
                                : 'from-green-500 to-emerald-500'
                            } rounded-full`}
                            style={{ width: `${securityLevel}%` }}
                          />
                        </Progress>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${
                  theme === 'dark' 
                    ? 'bg-slate-900/50 border-slate-700/50' 
                    : 'bg-white/70 border-slate-300/50'
                } backdrop-blur-sm`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} flex items-center text-base`}>
                      <AlertCircle className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`} />
                      System Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <AlertItem
                        title="Security Scan Complete"
                        time="14:32:12"
                        description="No threats detected in system scan"
                        type="info"
                      />
                      <AlertItem
                        title="Bandwidth Spike Detected"
                        time="13:45:06"
                        description="Unusual network activity on port 443"
                        type="warning"
                      />
                      <AlertItem
                        title="System Update Available"
                        time="09:12:45"
                        description="Version 12.4.5 ready to install"
                        type="update"
                      />
                      <AlertItem
                        title="Backup Completed"
                        time="04:30:00"
                        description="Incremental backup to drive E: successful"
                        type="success"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Communications */}
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700/50' 
                  : 'bg-white/70 border-slate-300/50'
              } backdrop-blur-sm`}>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className={`${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} flex items-center text-base`}>
                    <MessageSquare className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-blue-500' : 'text-blue-600'}`} />
                    Communications Log
                  </CardTitle>
                  <Badge variant="outline" className={`${
                    theme === 'dark' 
                      ? 'bg-slate-800/50 text-cyan-400 border-cyan-500/50' 
                      : 'bg-blue-50 text-blue-600 border-blue-300/50'
                  } text-xs`}>
                    4 New Messages
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <CommunicationItem
                      sender="System Administrator"
                      time="15:42:12"
                      message="Scheduled maintenance will occur at 02:00. All systems will be temporarily offline."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                    <CommunicationItem
                      sender="Security Module"
                      time="14:30:45"
                      message="Unusual login attempt blocked from IP 192.168.1.45. Added to watchlist."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                    <CommunicationItem
                      sender="Network Control"
                      time="12:15:33"
                      message="Bandwidth allocation adjusted for priority services during peak hours."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                    <CommunicationItem
                      sender="Data Center"
                      time="09:05:18"
                      message="Backup verification complete. All data integrity checks passed."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700/50 pt-4">
                  <div className="flex items-center w-full space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className={`flex-1 bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-sm ${
                        theme === 'dark' ? 'focus:outline-none focus:ring-1 focus:ring-cyan-500' : 'focus:outline-none focus:ring-1 focus:ring-blue-500'
                      }`}
                    />
                    <Button size="icon" className={`bg-blue-600 hover:bg-blue-700 ${
                      theme === 'dark' ? 'text-slate-100' : 'text-slate-500'
                    }`}>
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className={`bg-cyan-600 hover:bg-cyan-700 ${
                      theme === 'dark' ? 'text-slate-100' : 'text-slate-500'
                    }`}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              {/* System time */}
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700/50' 
                  : 'bg-white/70 border-slate-300/50'
              } backdrop-blur-sm overflow-hidden`}>
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1 font-mono">SYSTEM TIME</div>
                      <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
                      <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Uptime</div>
                        <div className="text-sm font-mono text-slate-200">14d 06:42:18</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                        <div className="text-sm font-mono text-slate-200">UTC-08:00</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700/50' 
                  : 'bg-white/70 border-slate-300/50'
              } backdrop-blur-sm`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} text-base`}>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton icon={Shield} label="Security Scan" theme={theme} />
                    <ActionButton icon={RefreshCw} label="Sync Data" theme={theme} />
                    <ActionButton icon={Download} label="Backup" theme={theme} />
                    <ActionButton icon={Terminal} label="Console" theme={theme} />
                  </div>
                </CardContent>
              </Card>

              {/* Resource allocation */}
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700/50' 
                  : 'bg-white/70 border-slate-300/50'
              } backdrop-blur-sm`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} text-base`}>Resource Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Processing Power</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>42% allocated</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            theme === 'dark' 
                              ? 'from-cyan-500 to-cyan-400' 
                              : 'from-cyan-500 to-blue-500'
                          } rounded-full`}
                          style={{ width: "42%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Memory Allocation</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>68% allocated</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            theme === 'dark' 
                              ? 'from-purple-500 to-purple-400' 
                              : 'from-purple-500 to-pink-500'
                          } rounded-full`}
                          style={{ width: "68%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Network Bandwidth</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>35% allocated</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            theme === 'dark' 
                              ? 'from-blue-500 to-indigo-500' 
                              : 'from-blue-500 to-indigo-500'
                          } rounded-full`}
                          style={{ width: "35%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/50">
                      <div className="flex items-center justify-between text-sm">
                        <div className={`text-slate-400 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Priority Level</div>
                        <div className="flex items-center">
                          <Slider defaultValue={[3]} max={5} step={1} className="w-24 mr-2" />
                          <span className={`text-cyan-400 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>3/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environment controls */}
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700/50' 
                  : 'bg-white/70 border-slate-300/50'
              } backdrop-blur-sm`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} text-base`}>Environment Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Radio className={`text-cyan-500 mr-2 h-4 w-4 ${theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'}`} />
                        <Label className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Power Management</Label>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Lock className={`text-cyan-500 mr-2 h-4 w-4 ${theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'}`} />
                        <Label className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Security Protocol</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Zap className={`text-cyan-500 mr-2 h-4 w-4 ${theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'}`} />
                        <Label className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Power Saving Mode</Label>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CircleOff className={`text-cyan-500 mr-2 h-4 w-4 ${theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'}`} />
                        <Label className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Auto Shutdown</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for nav items
function NavItem({ icon: Icon, label, active, theme }: { icon: LucideIcon; label: string; active?: boolean; theme: string }) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start transition-colors ${
        active 
          ? (theme === 'dark' ? "bg-slate-800/70 text-cyan-400" : "bg-blue-100 text-blue-700")
          : (theme === 'dark' ? "text-slate-400 hover:text-slate-100" : "text-slate-500 hover:text-slate-700")
      }`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

// Component for status items
function StatusItem({ label, value, color, theme }: { label: string; value: number; color: string; theme: string }) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500"
      case "green":
        return "from-green-500 to-emerald-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "purple":
        return "from-purple-500 to-pink-500"
      default:
        return "from-cyan-500 to-blue-500"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
        <div className={`text-xs ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>{value}%</div>
      </div>
      <div className={`h-1.5 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} rounded-full overflow-hidden`}>
        <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

// Component for metric cards
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
  theme,
}: {
  title: string
  value: number
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: string
  detail: string
  theme: string
}) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30"
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30"
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30"
      default:
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-amber-500" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-green-500" />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`${
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/60'
    } rounded-lg border ${getColor()} p-4 relative overflow-hidden transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className={`text-2xl font-bold mb-1 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300'
          : 'text-slate-800'
      }`}>
        {value}%
      </div>
      <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className={`absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r ${
        theme === 'dark' ? 'opacity-20' : 'opacity-10'
      } blur-xl from-cyan-500 to-blue-500`}></div>
    </div>
  )
}

// Performance chart component
function PerformanceChart({ theme }: { theme: string }) {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>100%</div>
        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>75%</div>
        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>50%</div>
        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>25%</div>
        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>0%</div>
      </div>

      {/* X-axis grid lines */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
        <div className={`border-b w-full ${theme === 'dark' ? 'border-slate-700/30' : 'border-slate-400/30'}`}></div>
        <div className={`border-b w-full ${theme === 'dark' ? 'border-slate-700/30' : 'border-slate-400/30'}`}></div>
        <div className={`border-b w-full ${theme === 'dark' ? 'border-slate-700/30' : 'border-slate-400/30'}`}></div>
        <div className={`border-b w-full ${theme === 'dark' ? 'border-slate-700/30' : 'border-slate-400/30'}`}></div>
        <div className={`border-b w-full ${theme === 'dark' ? 'border-slate-700/30' : 'border-slate-400/30'}`}></div>
      </div>

      {/* Chart bars */}
      <div className="flex-1 h-full flex items-end justify-between px-2 z-10">
        {Array.from({ length: 24 }).map((_, i) => {
          const cpuHeight = Math.floor(Math.random() * 60) + 20
          const memHeight = Math.floor(Math.random() * 40) + 40
          const netHeight = Math.floor(Math.random() * 30) + 30

          return (
            <div key={i} className="flex space-x-0.5">
              <div
                className="w-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm"
                style={{ height: `${cpuHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm"
                style={{ height: `${memHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                style={{ height: `${netHeight}%` }}
              ></div>
            </div>
          )
        })}
      </div>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>00:00</div>
        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>06:00</div>
        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>12:00</div>
        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>18:00</div>
        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>24:00</div>
      </div>
    </div>
  )
}

// Process row component
function ProcessRow({
  pid,
  name,
  user,
  cpu,
  memory,
  status,
  theme,
}: {
  pid: string
  name: string
  user: string
  cpu: number
  memory: number
  status: string
  theme: string
}) {
  return (
    <div className={`grid grid-cols-12 py-2 px-3 text-sm transition-colors ${
      theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100/50'
    }`}>
      <div className={`col-span-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>{pid}</div>
      <div className={`col-span-4 font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{name}</div>
      <div className={`col-span-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{user}</div>
      <div className={`col-span-2 font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>{cpu}%</div>
      <div className={`col-span-2 font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{memory} MB</div>
      <div className="col-span-1">
        <Badge variant="outline" className={`text-xs ${
          theme === 'dark' 
            ? 'bg-green-500/10 text-green-400 border-green-500/30' 
            : 'bg-green-500/15 text-green-600 border-green-500/40'
        }`}>
          {status}
        </Badge>
      </div>
    </div>
  )
}

// Storage item component
function StorageItem({
  name,
  total,
  used,
  type,
  theme,
}: {
  name: string
  total: number
  used: number
  type: string
  theme: string
}) {
  const percentage = Math.round((used / total) * 100)

  return (
    <div className={`${
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/60 border-slate-300/50'
    } rounded-md p-3 border transition-colors`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{name}</div>
        <Badge variant="outline" className={`text-xs ${
          theme === 'dark' 
            ? 'bg-slate-700/50 text-slate-300 border-slate-600/50' 
            : 'bg-slate-100 text-slate-600 border-slate-400/50'
        }`}>
          {type}
        </Badge>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
            {used} GB / {total} GB
          </div>
          <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>{percentage}%</div>
        </div>
        <Progress value={percentage} className={`h-1.5 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
          <div
            className={`h-full rounded-full ${
              percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-amber-500" : "bg-cyan-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </Progress>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>Free: {total - used} GB</div>
        <Button variant="ghost" size="sm" className={`h-6 text-xs px-2 ${
          theme === 'dark' ? 'text-slate-400 hover:text-slate-100' : 'text-slate-600 hover:text-slate-800'
        }`}>
          Details
        </Button>
      </div>
    </div>
  )
}

// Alert item component
function AlertItem({
  title,
  time,
  description,
  type,
}: {
  title: string
  time: string
  description: string
  type: "info" | "warning" | "error" | "success" | "update"
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
      case "warning":
        return { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" }
      case "error":
        return { icon: AlertCircle, color: "text-red-500 bg-red-500/10 border-red-500/30" }
      case "success":
        return { icon: Check, color: "text-green-500 bg-green-500/10 border-green-500/30" }
      case "update":
        return { icon: Download, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30" }
      default:
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
    }
  }

  const { icon: Icon, color } = getTypeStyles()

  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <Icon className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-slate-200">{title}</div>
          <div className="ml-2 text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  )
}

// Communication item component
function CommunicationItem({
  sender,
  time,
  message,
  avatar,
  unread,
}: {
  sender: string
  time: string
  message: string
  avatar: string
  unread?: boolean
}) {
  return (
    <div className={`flex space-x-3 p-2 rounded-md ${unread ? "bg-slate-800/50 border border-slate-700/50" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} alt={sender} />
        <AvatarFallback className="bg-slate-700 text-cyan-500">{sender.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">{sender}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400 mt-1">{message}</div>
      </div>
      {unread && (
        <div className="flex-shrink-0 self-center">
          <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
        </div>
      )}
    </div>
  )
}

// Action button component
function ActionButton({ icon: Icon, label, theme }: { icon: LucideIcon; label: string; theme: string }) {
  return (
    <Button
      variant="outline"
      className={`h-auto py-3 px-3 ${
        theme === 'dark' 
          ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-100' 
          : 'border-slate-300 bg-white/50 hover:bg-slate-50 text-slate-600 hover:text-slate-800'
      } flex flex-col items-center justify-center space-y-1 w-full transition-colors duration-200`}
    >
      <Icon className={`h-5 w-5 ${theme === 'dark' ? 'text-cyan-500' : 'text-blue-600'}`} />
      <span className="text-xs font-medium">{label}</span>
    </Button>
  )
}

// Add missing imports
function Info(props: React.ComponentProps<typeof AlertCircle>) {
  return <AlertCircle {...props} />
}

function Check(props: React.ComponentProps<typeof Shield>) {
  return <Shield {...props} />
}
