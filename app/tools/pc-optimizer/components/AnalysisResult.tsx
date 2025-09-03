import React, { useState, useMemo } from 'react';
import { 
  HardDrive, Calendar, AlertTriangle, Info, ChevronDown, ChevronUp,
  Zap, Trash2, Shield, Globe, Gamepad2, Code, Image, MessageSquare,
  Wrench, HelpCircle
} from 'lucide-react';
import { AnalyzedSoftware, SoftwareCategory, Priority } from '../lib/types';
import { formatBytes } from '../lib/analyzer';

interface AnalysisResultProps {
  data: AnalyzedSoftware[];
}

const categoryIcons: Record<SoftwareCategory, JSX.Element> = {
  browser: <Globe className="w-5 h-5" />,
  gaming: <Gamepad2 className="w-5 h-5" />,
  productivity: <Wrench className="w-5 h-5" />,
  development: <Code className="w-5 h-5" />,
  media: <Image className="w-5 h-5" />,
  communication: <MessageSquare className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
  utility: <Wrench className="w-5 h-5" />,
  system: <Shield className="w-5 h-5" />,
  unknown: <HelpCircle className="w-5 h-5" />,
};

const categoryNames: Record<SoftwareCategory, string> = {
  browser: 'Browser',
  gaming: 'Gaming',
  productivity: 'Productivity',
  development: 'Development',
  media: 'Media & Creative',
  communication: 'Communication',
  security: 'Security',
  utility: 'Utility',
  system: 'System',
  unknown: 'Other',
};

const priorityColors: Record<Priority, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  removable: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const priorityLabels: Record<Priority, string> = {
  critical: 'System Critical',
  high: 'Frequently Used',
  medium: 'Occasionally Used',
  low: 'Rarely Used',
  removable: 'Safe to Remove',
};

export default function AnalysisResult({ data }: AnalysisResultProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<SoftwareCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'size' | 'lastUsed'>('size');

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const { filteredData, stats } = useMemo(() => {
    let filtered = selectedCategory === 'all' ? data : data.filter(item => item.category === selectedCategory);
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'size') return b.size - a.size;
      if (sortBy === 'lastUsed') {
        if (!a.lastUsed) return 1;
        if (!b.lastUsed) return -1;
        return b.lastUsed.getTime() - a.lastUsed.getTime();
      }
      return 0;
    });

    // Calculate stats
    const totalSize = filtered.reduce((sum, item) => sum + item.size, 0);
    const totalCache = filtered.reduce((sum, item) => sum + (item.cacheSize || 0), 0);
    const removableSize = filtered
      .filter(item => item.priority === 'removable')
      .reduce((sum, item) => sum + item.size, 0);

    return {
      filteredData: filtered,
      stats: {
        totalSize,
        totalCache,
        removableSize,
        count: filtered.length,
      },
    };
  }, [data, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const counts = new Map<SoftwareCategory, number>();
    data.forEach(item => {
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    });
    return counts;
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Analysis Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-400 mb-1">Total Size</p>
            <p className="text-2xl font-bold text-blue-300">{formatBytes(stats.totalSize)}</p>
          </div>
          <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
            <p className="text-sm text-purple-400 mb-1">Cache (Est.)</p>
            <p className="text-2xl font-bold text-purple-300">{formatBytes(stats.totalCache)}</p>
          </div>
          <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
            <p className="text-sm text-orange-400 mb-1">Removable</p>
            <p className="text-2xl font-bold text-orange-300">{formatBytes(stats.removableSize)}</p>
          </div>
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <p className="text-sm text-green-400 mb-1">Total Apps</p>
            <p className="text-2xl font-bold text-green-300">{stats.count}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as SoftwareCategory | 'all')}
              className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All ({data.length})</option>
              {Array.from(categories.entries()).map(([cat, count]) => (
                <option key={cat} value={cat}>
                  {categoryNames[cat]} ({count})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'size' | 'lastUsed')}
              className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="size">Size</option>
              <option value="lastUsed">Last Used</option>
            </select>
          </div>
        </div>
      </div>

      {/* Software List */}
      <div className="space-y-4">
        {filteredData.map((software) => (
          <div
            key={software.id}
            className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all"
          >
            <div
              className="p-6 cursor-pointer"
              onClick={() => toggleExpanded(software.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {categoryIcons[software.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">
                        {software.displayName}
                      </h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${priorityColors[software.priority]}`}>
                        {priorityLabels[software.priority]}
                      </span>
                      {software.isStartup && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          <Zap className="w-3 h-3 inline mr-1" />
                          Startup
                        </span>
                      )}
                    </div>
                    {software.description && (
                      <p className="text-sm text-gray-400 mb-2">{software.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-gray-300">
                        <HardDrive className="w-4 h-4 mr-1" />
                        <span className="font-medium">{software.sizeFormatted}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Last used: {software.lastUsedFormatted}</span>
                      </div>
                      {software.cacheSizeFormatted && (
                        <div className="flex items-center text-gray-300">
                          <HardDrive className="w-4 h-4 mr-1" />
                          <span>Cache: {software.cacheSizeFormatted}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {expandedItems.has(software.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedItems.has(software.id) && (
              <div className="border-t border-white/10 px-6 py-4 bg-white/5">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-white mb-3 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Details
                    </h5>
                    <dl className="space-y-2 text-sm">
                      <div className="flex">
                        <dt className="font-medium text-gray-400 w-24">Path:</dt>
                        <dd className="text-gray-300 break-all">{software.path}</dd>
                      </div>
                      <div className="flex">
                        <dt className="font-medium text-gray-400 w-24">Category:</dt>
                        <dd className="text-gray-300">{categoryNames[software.category]}</dd>
                      </div>
                      <div className="flex">
                        <dt className="font-medium text-gray-400 w-24">Priority:</dt>
                        <dd className="text-gray-300">{priorityLabels[software.priority]}</dd>
                      </div>
                    </dl>
                  </div>

                  {software.tips && software.tips.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-white mb-3 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Optimization Tips
                      </h5>
                      <ul className="space-y-2">
                        {software.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <span className="text-cyan-400 mr-2">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {software.priority === 'removable' && (
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-300">
                        <p className="font-semibold mb-1">Removal Candidate</p>
                        <p>
                          This software hasn't been used for over 3 months.
                          Consider uninstalling to free up space.
                        </p>
                        <p className="mt-2">
                          To uninstall: Settings → Apps → Apps & features → {software.displayName} → Uninstall
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {software.priority === 'critical' && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-300">
                        <p className="font-semibold mb-1">System Critical</p>
                        <p>
                          This software is required for system operation.
                          Do not remove.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 text-sm bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
                    View in Task Manager
                  </button>
                  {software.isStartup && (
                    <button className="px-4 py-2 text-sm bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors">
                      Manage Startup
                    </button>
                  )}
                  {software.priority === 'removable' && (
                    <button className="px-4 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      How to Uninstall
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Optimization Summary */}
      {filteredData.filter(s => s.priority === 'removable').length > 0 && (
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
          <h3 className="text-xl font-bold text-white mb-4">
            🎯 Optimization Recommendations
          </h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p>
              <strong className="text-white">{filteredData.filter(s => s.priority === 'removable').length}</strong>
              {' '}applications are safe to remove.
              Removing them would free up approximately
              <strong className="text-lg mx-1 text-white">{formatBytes(stats.removableSize)}</strong>
              of storage space.
            </p>
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-semibold mb-2 text-white">Recommended Steps:</h4>
              <ol className="space-y-1 text-gray-300">
                <li>1. Uninstall unused software marked as removable</li>
                <li>2. Clear browser cache and temporary files</li>
                <li>3. Disable unnecessary startup applications</li>
                <li>4. Run Windows Disk Cleanup</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}