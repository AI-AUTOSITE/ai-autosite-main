'use client';

import { useState } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import FileUploader from './components/FileUploader';
import AnalysisResult from './components/AnalysisResult';
import PowerShellGuide from './components/PowerShellGuide';
import { analyzeFiles } from './lib/analyzer';
import { AnalyzedSoftware } from './lib/types';

export default function PCOptimizerPage() {
  const [analyzedData, setAnalyzedData] = useState<AnalyzedSoftware[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleFileUpload = async (fileContent: string) => {
    setIsAnalyzing(true);
    try {
      const results = await analyzeFiles(fileContent);
      setAnalyzedData(results);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred while analyzing the file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Background animation matching site theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-500/20 mb-6">
            <span className="text-sm text-cyan-400">🔧 Quick Tools</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            PC Optimizer Advisor
            <span className="block text-2xl sm:text-3xl mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Solve Storage & Performance Issues
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
            Identify which software is using your storage, find unused programs,
            and get personalized optimization recommendations for your PC.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
              <p className="text-sm text-cyan-400">🔒 100% Private Processing</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
              <p className="text-sm text-green-400">⚡ Instant Analysis</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
              <p className="text-sm text-purple-400">📊 Detailed Report</p>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            How It Works - 3 Simple Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                1️⃣
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Collect Data</h3>
              <p className="text-sm text-gray-400">
                Run PowerShell script to gather software information from your PC
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                2️⃣
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload</h3>
              <p className="text-sm text-gray-400">
                Drag & drop the generated CSV file
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                3️⃣
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Results</h3>
              <p className="text-sm text-gray-400">
                Review optimization suggestions and removal candidates
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
            >
              📋 View Data Collection Guide
            </button>
          </div>
        </div>

        {/* PowerShell Guide */}
        {showGuide && (
          <div className="mb-8">
            <PowerShellGuide onClose={() => setShowGuide(false)} />
          </div>
        )}

        {/* File Upload Section */}
        <div className="mb-8">
          <FileUploader 
            onFileUpload={handleFileUpload}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Analysis Results */}
        {analyzedData.length > 0 && (
          <div className="mb-8">
            <AnalysisResult data={analyzedData} />
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            💡 PC Optimization Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-3">Free Improvements</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Disable unnecessary startup apps</li>
                <li>• Clear temporary files and cache</li>
                <li>• Run Windows Disk Cleanup</li>
                <li>• Uninstall unused software</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-6 rounded-lg border border-orange-500/20">
              <h4 className="font-semibold text-orange-400 mb-3">Small Investment, Big Impact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Upgrade to SSD ($50+)</li>
                <li>• Add more RAM ($30+)</li>
                <li>• External HDD storage ($60+)</li>
                <li>• Cloud storage ($5/month)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            ❓ Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <details className="border border-white/10 rounded-lg p-4 bg-white/5">
              <summary className="font-semibold cursor-pointer text-white">Is this tool safe to use?</summary>
              <p className="mt-3 text-gray-400">
                Yes, it's completely safe. We don't upload executable files - only file names and size information.
                All processing happens in your browser, and no data is sent to any server.
              </p>
            </details>
            <details className="border border-white/10 rounded-lg p-4 bg-white/5">
              <summary className="font-semibold cursor-pointer text-white">Which files are candidates for removal?</summary>
              <p className="mt-3 text-gray-400">
                Large software unused for 3+ months, duplicate programs (multiple browsers),
                and outdated versions are typical candidates. Final decisions are always up to you.
              </p>
            </details>
            <details className="border border-white/10 rounded-lg p-4 bg-white/5">
              <summary className="font-semibold cursor-pointer text-white">Will I accidentally delete system files?</summary>
              <p className="mt-3 text-gray-400">
                This tool only analyzes applications in the "Program Files" folders,
                not Windows system files. Critical software is marked with warning labels.
              </p>
            </details>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}