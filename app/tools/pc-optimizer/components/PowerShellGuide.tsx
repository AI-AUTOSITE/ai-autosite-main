import React, { useState } from 'react';
import { X, Copy, Check, AlertCircle, Terminal } from 'lucide-react';

interface PowerShellGuideProps {
  onClose: () => void;
}

export default function PowerShellGuide({ onClose }: PowerShellGuideProps) {
  const [copied, setCopied] = useState(false);

  const powershellScript = `# PC Optimizer Data Collection Script
# This script collects file information from Program Files

$outputFile = "$env:USERPROFILE\\Desktop\\pc_files_info.csv"

Get-ChildItem -Path "C:\\Program Files", "C:\\Program Files (x86)" -Recurse -Include *.exe -ErrorAction SilentlyContinue | 
    Select-Object Name, DirectoryName, Length, LastAccessTime, LastWriteTime | 
    Export-Csv -Path $outputFile -NoTypeInformation -Encoding UTF8

Write-Host "File created: $outputFile" -ForegroundColor Green`;

  const handleCopy = () => {
    navigator.clipboard.writeText(powershellScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Terminal className="w-8 h-8 text-cyan-400" />
        <h3 className="text-2xl font-bold text-white">
          How to Collect File Data
        </h3>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">About Security</p>
              <p>This script only collects file metadata (name, size, date).</p>
              <p>No executable content or personal information is included.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">PowerShell Script</h4>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-300" />
                  <span className="text-sm text-gray-300">Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="bg-gray-900/50 backdrop-blur text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-800">
            {powershellScript}
          </pre>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Steps to Run</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Open PowerShell as Administrator</p>
                <p className="text-sm text-gray-400 mt-1">
                  Press Windows + X → Select "Windows PowerShell (Admin)"
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Paste and Run the Script</p>
                <p className="text-sm text-gray-400 mt-1">
                  Copy the script above, right-click in PowerShell to paste → Press Enter
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Upload the Generated CSV File</p>
                <p className="text-sm text-gray-400 mt-1">
                  Find "pc_files_info.csv" on your Desktop
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-sm text-amber-300">
            <strong>Processing Time:</strong>
            May take 1-5 minutes depending on the number of files.
            Wait for "File created" message to appear.
          </p>
        </div>
      </div>
    </div>
  );
}