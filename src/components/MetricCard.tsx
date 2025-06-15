'use client';

import { LucideIcon } from 'lucide-react/dist/lucide-react.js';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline/index.js';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: LucideIcon;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  prefix = '',
  suffix = '',
  className = ''
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(0)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {prefix}{formatValue(value)}{suffix}
            </p>
          </div>
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
            changeType === 'increase' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {changeType === 'increase' ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 