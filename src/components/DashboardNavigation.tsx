'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartBarIcon, CpuChipIcon } from '@heroicons/react/24/outline';

export function DashboardNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Coaching Analytics',
      href: '/',
      icon: ChartBarIcon,
      description: 'High-ticket coaching funnel analytics'
    },
    {
      name: 'System Monitor',
      href: '/system',
      icon: CpuChipIcon,
      description: 'Advanced system monitoring dashboard'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-500">{item.description}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="text-sm text-gray-500">
            Multi-Dashboard Analytics Platform
          </div>
        </div>
      </div>
    </nav>
  );
} 