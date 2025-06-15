'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Command, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  X
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  value?: string;
  description?: string;
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const trendingSuggestions = useMemo(() => [
    'Revenue trends',
    'Conversion optimization',
    'YouTube analytics',
    'Performance metrics',
    'Growth insights'
  ], []);

  const mockResults: SearchResult[] = useMemo(() => [
    { id: '1', title: 'Total Revenue', category: 'Metrics', value: '$122,500', description: 'Current month revenue' },
    { id: '2', title: 'YouTube Views', category: 'Metrics', value: '87,500', description: 'Total video views' },
    { id: '3', title: 'Conversion Rate', category: 'Metrics', value: '28%', description: 'Lead conversion percentage' },
    { id: '4', title: 'Top Performing Video', category: 'Content', value: 'How to Scale Your Business', description: 'Highest engagement video' },
    { id: '5', title: 'Revenue Growth', category: 'Insights', description: 'Monthly revenue increased by 15%' },
    { id: '6', title: 'Audience Engagement', category: 'Insights', description: 'Video engagement up 23% this week' },
  ], []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query, mockResults, trendingSuggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (result: SearchResult) => {
    onSearch(result.title);
    addToRecentSearches(result.title);
    onClose();
  };

  const addToRecentSearches = (searchTerm: string) => {
    setRecentSearches(prev => {
      const updated = [searchTerm, ...prev.filter(item => item !== searchTerm)];
      return updated.slice(0, 5); // Keep only last 5 searches
    });
  };

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    onSearch(searchTerm);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Metrics':
        return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case 'Content':
        return <Search className="w-4 h-4 text-purple-400" />;
      case 'Insights':
        return <Command className="w-4 h-4 text-blue-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="glass-strong rounded-xl w-full max-w-2xl mx-4 overflow-hidden animate-fade-in-scale">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search metrics, insights, content..."
              className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Keyboard shortcuts */}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-700/50 rounded text-xs">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-700/50 rounded text-xs">Enter</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-700/50 rounded text-xs">Esc</kbd>
              Close
            </span>
          </div>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto">
          {query.trim() ? (
            results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      index === selectedIndex
                        ? 'bg-cyan-500/20 border border-cyan-500/30'
                        : 'hover:bg-slate-700/30'
                    }`}
                  >
                    {getCategoryIcon(result.category)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white truncate">{result.title}</h4>
                        {result.value && (
                          <span className="text-cyan-400 font-mono text-sm">{result.value}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-slate-700/50 rounded text-slate-300">
                          {result.category}
                        </span>
                        {result.description && (
                          <span className="text-xs text-slate-400 truncate">{result.description}</span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            )
          ) : (
            <div className="p-4 space-y-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={`recent-${search}-${index}`}
                        onClick={() => handleRecentSearch(search)}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-700/30 text-slate-300 text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Suggestions */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </h3>
                <div className="space-y-1">
                  {trendingSuggestions.map((suggestion, index) => (
                    <button
                      key={`trending-${suggestion}-${index}`}
                      onClick={() => handleRecentSearch(suggestion)}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-700/30 text-slate-300 text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch; 