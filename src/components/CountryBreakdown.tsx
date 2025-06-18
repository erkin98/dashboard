'use client';

import { useState, useMemo } from 'react';
import { Sale, CallBooking } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  GlobeAltIcon,
  TrophyIcon,
  ChartBarIcon,
  MapIcon
} from '@heroicons/react/24/outline';

interface CountryBreakdownProps {
  sales: Sale[];
  calls: CallBooking[];
  className?: string;
  theme?: 'dark' | 'light';
}

interface CountryMetrics {
  country: string;
  countryCode: string;
  flag: string;
  totalSales: number;
  totalRevenue: number;
  totalCalls: number;
  conversionRate: number;
  avgDealSize: number;
  marketShare: number;
  growth: number;
}

const countryInfo = {
  'US': { name: 'United States', flag: '🇺🇸', code: 'US' },
  'CA': { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  'UK': { name: 'United Kingdom', flag: '🇬🇧', code: 'UK' },
  'AU': { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  'DE': { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  'FR': { name: 'France', flag: '🇫🇷', code: 'FR' },
  'NL': { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
  'SG': { name: 'Singapore', flag: '🇸🇬', code: 'SG' },
};

export function CountryBreakdown({ 
  sales, 
  calls, 
  className = '', 
  theme = 'dark' 
}: CountryBreakdownProps) {
  const [sortBy, setSortBy] = useState<'revenue' | 'sales' | 'conversion' | 'growth'>('revenue');
  const [timeframe, setTimeframe] = useState<'current' | 'last3' | 'last6'>('current');

  // Calculate country metrics
  const countryMetrics = useMemo(() => {
    const metrics: Record<string, CountryMetrics> = {};
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);

    // Process each country in our data
    Object.keys(countryInfo).forEach(countryCode => {
      const countrySales = sales.filter(sale => sale.country === countryCode);
      const countryCalls = calls.filter(call => call.country === countryCode);
      
      const totalSales = countrySales.length;
      const totalRevenue = countrySales.reduce((sum, sale) => sum + sale.amount, 0);
      const totalCalls = countryCalls.length;
      const conversionRate = totalCalls > 0 ? (totalSales / totalCalls) * 100 : 0;
      const avgDealSize = totalSales > 0 ? totalRevenue / totalSales : 0;
      const marketShare = totalRevenue > 0 ? (totalRevenue / sales.reduce((sum, sale) => sum + sale.amount, 0)) * 100 : 0;
      
      // Mock growth calculation (would be real data in production)
      const growth = Math.random() * 40 - 10; // -10% to +30% growth

      metrics[countryCode] = {
        country: countryInfo[countryCode as keyof typeof countryInfo].name,
        countryCode,
        flag: countryInfo[countryCode as keyof typeof countryInfo].flag,
        totalSales,
        totalRevenue,
        totalCalls,
        conversionRate,
        avgDealSize,
        marketShare,
        growth,
      };
    });

    return Object.values(metrics)
      .filter(metric => metric.totalCalls > 0) // Only show countries with activity
      .sort((a, b) => {
        switch (sortBy) {
          case 'revenue':
            return b.totalRevenue - a.totalRevenue;
          case 'sales':
            return b.totalSales - a.totalSales;
          case 'conversion':
            return b.conversionRate - a.conversionRate;
          case 'growth':
            return b.growth - a.growth;
          default:
            return b.totalRevenue - a.totalRevenue;
        }
      });
  }, [sales, calls, sortBy]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) {
      return theme === 'dark' ? 'text-green-400' : 'text-green-600';
    } else if (growth < 0) {
      return theme === 'dark' ? 'text-red-400' : 'text-red-600';
    }
    return theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <TrophyIcon className="h-4 w-4 text-yellow-500" />;
    if (index === 1) return <div className="h-4 w-4 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white font-bold">2</div>;
    if (index === 2) return <div className="h-4 w-4 rounded-full bg-amber-600 flex items-center justify-center text-xs text-white font-bold">3</div>;
    return <div className="h-4 w-4 rounded-full bg-slate-500 flex items-center justify-center text-xs text-white font-bold">{index + 1}</div>;
  };

  const topCountry = countryMetrics[0];
  const totalGlobalRevenue = countryMetrics.reduce((sum, country) => sum + country.totalRevenue, 0);
  const totalGlobalSales = countryMetrics.reduce((sum, country) => sum + country.totalSales, 0);

  return (
    <Card className={`w-full ${className} ${
      theme === 'dark' 
        ? 'bg-slate-900/40 border-slate-700/50' 
        : 'bg-white/80 border-slate-200/50'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              <GlobeAltIcon className="h-5 w-5 text-blue-500" />
              Country Breakdown
            </CardTitle>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Geographic performance analysis across {countryMetrics.length} markets
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <ChartBarIcon className={`h-4 w-4 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`} />
              <div className="flex gap-1">
                {[
                  { key: 'revenue', label: 'Revenue' },
                  { key: 'sales', label: 'Sales' },
                  { key: 'conversion', label: 'CVR' },
                  { key: 'growth', label: 'Growth' },
                ].map((sort) => (
                  <Button
                    key={sort.key}
                    variant={sortBy === sort.key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy(sort.key as 'revenue' | 'sales' | 'conversion' | 'growth')}
                    className={`h-8 px-3 text-xs ${
                      sortBy === sort.key
                        ? theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                        : theme === 'dark'
                          ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {sort.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Global Summary */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white/50 border-slate-200/50'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            <MapIcon className="h-5 w-5 text-cyan-500" />
            Global Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {countryMetrics.length}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Active Markets
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {formatNumber(totalGlobalSales)}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total Sales
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {formatCurrency(totalGlobalRevenue)}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total Revenue
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {topCountry ? topCountry.flag : '🌍'}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Top Market
              </div>
            </div>
          </div>
        </div>

        {/* Top Performer Highlight */}
        {topCountry && (
          <div className={`p-4 rounded-lg border-2 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30' 
              : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300/50'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <TrophyIcon className="h-6 w-6 text-yellow-500" />
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-yellow-100' : 'text-yellow-900'
              }`}>
                Top Performing Market
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-3xl">{topCountry.flag}</div>
              <div className="flex-1">
                <h4 className={`font-semibold text-lg ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {topCountry.country}
                </h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {formatPercentage(topCountry.marketShare)} of global revenue
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(topCountry.totalRevenue)}
                  </div>
                  <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                    Revenue
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600">
                    {formatPercentage(topCountry.conversionRate)}
                  </div>
                  <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                    Conversion
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Country Rankings */}
        <div className="space-y-3">
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Market Performance Rankings
          </h3>
          
          <div className="space-y-2">
            {countryMetrics.map((country, index) => (
              <div 
                key={country.countryCode}
                className={`p-4 rounded-lg border transition-all hover:shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50' 
                    : 'bg-white/50 border-slate-200/50 hover:bg-white/80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Rank & Country */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {getRankBadge(index)}
                      <div className="text-2xl">{country.flag}</div>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {country.country}
                      </h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {formatPercentage(country.marketShare)} market share
                      </p>
                    </div>
                  </div>
                  
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        {formatCurrency(country.totalRevenue)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Revenue
                      </div>
                    </div>
                    
                    <div>
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {formatNumber(country.totalSales)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Sales
                      </div>
                    </div>
                    
                    <div>
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                      }`}>
                        {formatNumber(country.totalCalls)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Calls
                      </div>
                    </div>
                    
                    <div>
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {formatPercentage(country.conversionRate)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Conversion
                      </div>
                    </div>
                    
                    <div>
                      <div className={`font-semibold ${getGrowthColor(country.growth)}`}>
                        {country.growth > 0 ? '+' : ''}{formatPercentage(country.growth)}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Growth
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Market Share Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Market Share
                    </span>
                    <span className={`text-xs font-mono ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {formatPercentage(country.marketShare)}
                    </span>
                  </div>
                  <Progress 
                    value={country.marketShare} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {countryMetrics.length === 0 && (
            <div className={`text-center py-8 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              No country data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 