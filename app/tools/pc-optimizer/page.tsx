'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import FileUploader from './components/FileUploader';
import AnalysisResult from './components/AnalysisResult';
import PowerShellGuide from './components/PowerShellGuide';
import ErrorBoundary from './components/ErrorBoundary';
import { useFileAnalysis } from './hooks/useFileAnalysis';

/**
 * PC Optimizer Main Page Component
 * Handles file analysis workflow and UI orchestration
 */
export default function PCOptimizerPage() {
  const [showGuide, setShowGuide] = useState(false);
  const { 
    analyzedData, 
    isAnalyzing, 
    error, 
    handleFileUpload, 
    clearError 
  } = useFileAnalysis();

  return (
    <ErrorBoundary>
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-500/20 mb-6">
            <span className="text-sm text-cyan-400">Quick Tools</span>
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
            <FeatureBadge icon="🔒" text="100% Private Processing" color="cyan" />
            <FeatureBadge icon="⚡" text="Instant Analysis" color="green" />
            <FeatureBadge icon="📊" text="Detailed Report" color="purple" />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold mb-1">Analysis Error</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-3 text-red-400 hover:text-red-300"
                aria-label="Close error"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* How it Works Section */}
        <HowItWorksSection onShowGuide={() => setShowGuide(!showGuide)} />

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
        <TipsSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>
    </ErrorBoundary>
  );
}

/**
 * Feature Badge Component
 */
function FeatureBadge({ icon, text, color }: { icon: string; text: string; color: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
      <p className={`text-sm text-${color}-400`}>
        {icon} {text}
      </p>
    </div>
  );
}

/**
 * How It Works Section Component
 */
function HowItWorksSection({ onShowGuide }: { onShowGuide: () => void }) {
  const steps = [
    {
      number: '1',
      title: 'Collect Data',
      description: 'Run PowerShell script to gather software information from your PC',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      number: '2',
      title: 'Upload',
      description: 'Drag & drop the generated CSV file',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      number: '3',
      title: 'Get Results',
      description: 'Review optimization suggestions and removal candidates',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        How It Works - 3 Simple Steps
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-4`}>
              {step.number}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <button
          onClick={onShowGuide}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
        >
          View Data Collection Guide
        </button>
      </div>
    </div>
  );
}

/**
 * Tips Section Component
 */
function TipsSection() {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
      <h3 className="text-2xl font-bold text-white mb-6">
        PC Optimization Tips
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        <TipCard
          title="Free Improvements"
          color="green"
          tips={[
            'Disable unnecessary startup apps',
            'Clear temporary files and cache',
            'Run Windows Disk Cleanup',
            'Uninstall unused software'
          ]}
        />
        <TipCard
          title="Small Investment, Big Impact"
          color="orange"
          tips={[
            'Upgrade to SSD ($50+)',
            'Add more RAM ($30+)',
            'External HDD storage ($60+)',
            'Cloud storage ($5/month)'
          ]}
        />
      </div>
    </div>
  );
}

/**
 * Tip Card Component
 */
function TipCard({ title, color, tips }: { title: string; color: string; tips: string[] }) {
  return (
    <div className={`bg-gradient-to-br from-${color}-500/10 to-${color === 'green' ? 'emerald' : 'amber'}-500/10 p-6 rounded-lg border border-${color}-500/20`}>
      <h4 className={`font-semibold text-${color}-400 mb-3`}>{title}</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        {tips.map((tip, index) => (
          <li key={index}>• {tip}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * FAQ Section Component
 */
function FAQSection() {
  const faqs = [
    {
      question: 'Is this tool safe to use?',
      answer: 'Yes, it\'s completely safe. We don\'t upload executable files - only file names and size information. All processing happens in your browser, and no data is sent to any server.'
    },
    {
      question: 'Which files are candidates for removal?',
      answer: 'Large software unused for 3+ months, duplicate programs (multiple browsers), and outdated versions are typical candidates. Final decisions are always up to you.'
    },
    {
      question: 'Will I accidentally delete system files?',
      answer: 'This tool only analyzes applications in the "Program Files" folders, not Windows system files. Critical software is marked with warning labels.'
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
      <h3 className="text-2xl font-bold text-white mb-6">
        Frequently Asked Questions
      </h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="border border-white/10 rounded-lg p-4 bg-white/5">
            <summary className="font-semibold cursor-pointer text-white">
              {faq.question}
            </summary>
            <p className="mt-3 text-gray-400">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}