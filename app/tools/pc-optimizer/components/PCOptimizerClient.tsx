// app/tools/pc-optimizer/components/PCOptimizerClient.tsx

'use client';

import React, { useState } from 'react';
import { Upload } from 'lucide-react';  // HelpCircle削除
import AnalysisResult from './AnalysisResult';
import ErrorBoundary from './ErrorBoundary';
import { useFileAnalysis } from '../hooks/useFileAnalysis';
// PowerShellGuideのインポート削除

export default function PCOptimizerClient() {
  const [isDragging, setIsDragging] = useState(false);
  // showGuide削除 - layout.tsxで管理されるため
  const { analyzedData, isAnalyzing, error, handleFileUpload, clearError } = useFileAnalysis();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        handleFileUpload(content);
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        handleFileUpload(content);
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  // If showing results, render results view
  if (analyzedData.length > 0) {
    return (
      <ErrorBoundary>
        <div className="container mx-auto px-4 pb-8 max-w-5xl">
          <AnalysisResult data={analyzedData} />
          <div className="text-center mt-4">
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Analyze another file
            </button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Main drop zone view - クリーンにシンプルに
  return (
    <ErrorBoundary>
      <div className="relative">
        {/* ヘルプボタン削除 - layout.tsxが管理 */}

        {/* Error message - floating */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm animate-fadeIn">
            {error}
            <button onClick={clearError} className="ml-2">✕</button>
          </div>
        )}

        {/* PowerShell Guide モーダル削除 - layout.tsxが管理 */}

        {/* GIANT drop zone */}
        <main className="flex items-center justify-center p-4 min-h-[70vh]">
          <label className="w-full max-w-3xl">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isAnalyzing}
            />
            
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`
                relative h-[60vh] min-h-[400px] rounded-3xl border-4 border-dashed
                flex flex-col items-center justify-center cursor-pointer
                transition-all duration-200
                shadow-2xl
                ${isDragging 
                  ? 'border-cyan-400 bg-cyan-400/10 scale-[1.02] shadow-cyan-400/20' 
                  : 'border-gray-500 bg-gray-800/20 hover:border-cyan-400 hover:bg-cyan-400/5 hover:shadow-cyan-400/10'
                }
                ${isAnalyzing ? 'cursor-wait opacity-70' : ''}
              `}
            >
              {isAnalyzing ? (
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-2xl font-medium text-white">Analyzing your PC data...</p>
                  <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
                </div>
              ) : (
                <>
                  <Upload className="w-24 h-24 text-gray-500 mb-6" />
                  <h2 className="text-3xl font-medium text-gray-300 mb-2">
                    Drop CSV file here
                  </h2>
                  <p className="text-base text-gray-400 mb-8">
                    or click to select
                  </p>
                  
                  {/* Mini steps inside drop zone */}
                  <div className="absolute bottom-8 flex gap-8 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center">1</span>
                      <span>Run PowerShell script</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center">2</span>
                      <span>Drop CSV here</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center">3</span>
                      <span>Get results</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </label>
        </main>

        {/* Ultra-minimal footer */}
        <div className="text-center py-2 text-xs text-gray-400">
          100% Private • No uploads • Browser-based analysis
        </div>
      </div>
    </ErrorBoundary>
  );
}