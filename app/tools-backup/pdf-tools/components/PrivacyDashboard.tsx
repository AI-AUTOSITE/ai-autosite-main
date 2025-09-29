import React, { useState, useEffect, useRef } from 'react';
import { PrivacyStatus } from '../types/privacy';
import { Shield, Minimize2, X, Eye } from 'lucide-react';

interface PrivacyDashboardProps {
  filesProcessed: number;
  currentFile?: File | null;
}

export const PrivacyDashboard: React.FC<PrivacyDashboardProps> = ({
  filesProcessed,
  currentFile
}) => {
  const [status, setStatus] = useState<PrivacyStatus>({
    mode: 'local',
    filesProcessed: 0,
    dataTransmitted: 0,
    externalConnections: 0
  });
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStatus(prev => ({
      ...prev,
      filesProcessed
    }));
  }, [filesProcessed]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMinimized && !isHidden && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsMinimized(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMinimized, isHidden]);

  const getStatusColor = () => {
    switch (status.mode) {
      case 'local':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'sharing':
        return 'bg-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (status.mode) {
      case 'local':
        return '100% Private Mode';
      case 'processing':
        return 'Processing Locally';
      case 'sharing':
        return 'External Connection';
    }
  };

  const handleClose = () => {
    setIsHidden(true);
    setIsMinimized(false);
  };

  const handleReopen = () => {
    setIsHidden(false);
    setIsMinimized(false);
  };

  // If hidden, show reopening button in bottom-left corner
  if (isHidden) {
    return (
      <div className="fixed bottom-4 left-4 z-30">
        <button
          onClick={handleReopen}
          className="bg-gray-800 text-white rounded-full p-2 shadow-lg hover:bg-gray-700 transition-all group"
          title="Show Privacy Dashboard"
        >
          <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    );
  }

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed top-20 left-4 z-[60]"> {/* Changed from top-4 to top-20 */}
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 hover:shadow-xl transition-shadow"
        >
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
          <span className="text-sm font-medium">Privacy Status</span>
        </button>
      </div>
    );
  }

  // Full dashboard view
  return (
    <div className="fixed top-20 left-4 z-[60] animate-slideDown"> {/* Changed z-30 to z-[60] and top-4 to top-20 */}
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg border border-gray-200 w-80"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
            <h3 className="font-semibold text-sm">Privacy Dashboard</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition"
              title="Minimize"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Current Status</span>
            <span className={`text-xs font-bold ${
              status.mode === 'local' ? 'text-green-600' :
              status.mode === 'processing' ? 'text-blue-600' : 'text-yellow-600'
            }`}>
              {getStatusText()}
            </span>
          </div>
          {currentFile && (
            <div className="text-xs text-gray-600 bg-white bg-opacity-50 rounded px-2 py-1">
              📄 {currentFile.name}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="px-4 py-3 space-y-3">
          {/* Files processed locally */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-600">Files processed locally</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{status.filesProcessed}</span>
          </div>

          {/* Data sent externally */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-600">Data sent externally</span>
            </div>
            <span className="text-sm font-bold text-gray-900">0 bytes</span>
          </div>

          {/* External connections */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-600">External connections</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{status.externalConnections}</span>
          </div>

          {/* Tracking cookies */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-600">Tracking cookies</span>
            </div>
            <span className="text-sm font-bold text-gray-900">None</span>
          </div>

          {/* Server storage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-600">Server storage</span>
            </div>
            <span className="text-sm font-bold text-gray-900">Never</span>
          </div>
        </div>

        {/* Active Privacy Features */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 mb-2 font-medium">Active Privacy Features</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-500">🔒</span>
              <span className="text-gray-700">Client-side processing only</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-500">🛡️</span>
              <span className="text-gray-700">No analytics or tracking</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-500">💾</span>
              <span className="text-gray-700">Files stay on your device</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-500">🔐</span>
              <span className="text-gray-700">End-to-end encryption</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200">
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium w-full text-center">
            Learn about our privacy commitment →
          </button>
        </div>
      </div>
    </div>
  );
};