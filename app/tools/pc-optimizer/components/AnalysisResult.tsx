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
  browser: 'ブラウザ',
  gaming: 'ゲーム',
  productivity: '仕事効率化',
  development: '開発ツール',
  media: 'メディア・クリエイティブ',
  communication: 'コミュニケーション',
  security: 'セキュリティ',
  utility: 'ユーティリティ',
  system: 'システム',
  unknown: 'その他',
};

const priorityColors: Record<Priority, string> = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-orange-100 text-orange-800 border-orange-200',
  removable: 'bg-gray-100 text-gray-800 border-gray-200',
};

const priorityLabels: Record<Priority, string> = {
  critical: 'システム必須',
  high: 'よく使用',
  medium: 'たまに使用',
  low: 'ほとんど使わない',
  removable: '削除候補',
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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">分析結果サマリー</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">合計サイズ</p>
            <p className="text-2xl font-bold text-blue-900">{formatBytes(stats.totalSize)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">キャッシュ推定</p>
            <p className="text-2xl font-bold text-purple-900">{formatBytes(stats.totalCache)}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-600 mb-1">削除可能</p>
            <p className="text-2xl font-bold text-orange-900">{formatBytes(stats.removableSize)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 mb-1">ソフト数</p>
            <p className="text-2xl font-bold text-green-900">{stats.count}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">カテゴリ:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as SoftwareCategory | 'all')}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">すべて ({data.length})</option>
              {Array.from(categories.entries()).map(([cat, count]) => (
                <option key={cat} value={cat}>
                  {categoryNames[cat]} ({count})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">並び替え:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'size' | 'lastUsed')}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="size">サイズ順</option>
              <option value="lastUsed">最終利用日順</option>
            </select>
          </div>
        </div>
      </div>

      {/* Software List */}
      <div className="space-y-4">
        {filteredData.map((software) => (
          <div
            key={software.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
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
                      <h4 className="text-lg font-semibold text-gray-900">
                        {software.displayName}
                      </h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${priorityColors[software.priority]}`}>
                        {priorityLabels[software.priority]}
                      </span>
                      {software.isStartup && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          <Zap className="w-3 h-3 inline mr-1" />
                          スタートアップ
                        </span>
                      )}
                    </div>
                    {software.description && (
                      <p className="text-sm text-gray-600 mb-2">{software.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-gray-700">
                        <HardDrive className="w-4 h-4 mr-1" />
                        <span className="font-medium">{software.sizeFormatted}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>最終利用: {software.lastUsedFormatted}</span>
                      </div>
                      {software.cacheSizeFormatted && (
                        <div className="flex items-center text-gray-700">
                          <HardDrive className="w-4 h-4 mr-1" />
                          <span>キャッシュ: {software.cacheSizeFormatted}</span>
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
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      詳細情報
                    </h5>
                    <dl className="space-y-2 text-sm">
                      <div className="flex">
                        <dt className="font-medium text-gray-600 w-24">パス:</dt>
                        <dd className="text-gray-800 break-all">{software.path}</dd>
                      </div>
                      <div className="flex">
                        <dt className="font-medium text-gray-600 w-24">カテゴリ:</dt>
                        <dd className="text-gray-800">{categoryNames[software.category]}</dd>
                      </div>
                      <div className="flex">
                        <dt className="font-medium text-gray-600 w-24">優先度:</dt>
                        <dd className="text-gray-800">{priorityLabels[software.priority]}</dd>
                      </div>
                    </dl>
                  </div>

                  {software.tips && software.tips.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        最適化のヒント
                      </h5>
                      <ul className="space-y-2">
                        {software.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {software.priority === 'removable' && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">削除候補</p>
                        <p>
                          このソフトウェアは3ヶ月以上使用されていません。
                          アンインストールを検討してください。
                        </p>
                        <p className="mt-2">
                          削除方法: 設定 → アプリ → アプリと機能 → {software.displayName} → アンインストール
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {software.priority === 'critical' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-800">
                        <p className="font-semibold mb-1">システム必須</p>
                        <p>
                          このソフトウェアはシステムの動作に必要です。
                          削除しないでください。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    タスクマネージャーで確認
                  </button>
                  {software.isStartup && (
                    <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      スタートアップを管理
                    </button>
                  )}
                  {software.priority === 'removable' && (
                    <button className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      アンインストール方法
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
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <h3 className="text-xl font-bold text-green-900 mb-4">
            🎯 最適化の推奨アクション
          </h3>
          <div className="space-y-3 text-sm text-green-800">
            <p>
              <strong>{filteredData.filter(s => s.priority === 'removable').length}個</strong>
              のソフトウェアが削除候補です。
              これらを削除すると約
              <strong className="text-lg mx-1">{formatBytes(stats.removableSize)}</strong>
              の空き容量を確保できます。
            </p>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-2">推奨される順番:</h4>
              <ol className="space-y-1">
                <li>1. 削除候補のソフトをアンインストール</li>
                <li>2. ブラウザのキャッシュをクリア</li>
                <li>3. 不要なスタートアップアプリを無効化</li>
                <li>4. Windowsのディスククリーンアップを実行</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}