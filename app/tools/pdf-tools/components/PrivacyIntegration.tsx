// pdf-tools/components/PrivacyIntegration.tsx
// これは既存のPDFStudioClientやToolPanelに統合するためのサンプルコードです

import React, { useState } from 'react';
import { TransparentShareButton } from './TransparentShareButton';
import { NetworkMonitor } from './NetworkMonitor';
import { PrivacyGate } from './PrivacyGate';
import { PrivacyDashboard } from './PrivacyDashboard';
import { SHARE_DESTINATIONS, ShareDestination } from '../types/privacy';

interface PrivacyIntegrationProps {
  processedFile: Blob | null;
  fileName: string;
  filesProcessedCount: number;
}

export const PrivacyIntegration: React.FC<PrivacyIntegrationProps> = ({
  processedFile,
  fileName,
  filesProcessedCount
}) => {
  const [showPrivacyGate, setShowPrivacyGate] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<ShareDestination | null>(null);

  const handleShareClick = (destination: ShareDestination) => {
    if (destination.id === 'download') {
      // Direct download, no privacy gate needed
      handleDownload();
    } else {
      // External service, show privacy gate
      setSelectedDestination(destination);
      setShowPrivacyGate(true);
    }
  };

  const handleDownload = () => {
    if (!processedFile) return;
    
    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExternalShare = async () => {
    if (!selectedDestination || !processedFile) return;

    // Close privacy gate
    setShowPrivacyGate(false);

    try {
      switch (selectedDestination.id) {
        case 'notion':
          await shareToNotion(processedFile);
          break;
        case 'gdrive':
          await shareToGoogleDrive(processedFile);
          break;
        case 'dropbox':
          await shareToDropbox(processedFile);
          break;
        default:
          console.warn('Unknown destination:', selectedDestination.id);
      }
    } catch (error) {
      console.error('Share failed:', error);
      alert('Failed to share file. Please try again.');
    }
  };

  // Placeholder functions for external services
  const shareToNotion = async (file: Blob) => {
    // Implementation for Notion API
    console.log('Sharing to Notion...', file);
    // This would use the Notion API directly from the browser
  };

  const shareToGoogleDrive = async (file: Blob) => {
    // Implementation for Google Drive API
    console.log('Sharing to Google Drive...', file);
    // This would use the Google Drive API directly from the browser
  };

  const shareToDropbox = async (file: Blob) => {
    // Implementation for Dropbox API
    console.log('Sharing to Dropbox...', file);
    // This would use the Dropbox API directly from the browser
  };

  return (
    <>
      {/* Privacy Dashboard - Always visible */}
      <PrivacyDashboard 
        filesProcessed={filesProcessedCount}
        currentFile={processedFile ? new File([processedFile], fileName) : null}
      />

      {/* Network Monitor - Always visible */}
      <NetworkMonitor />

      {/* Share Buttons Section */}
      {processedFile && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Export Options
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SHARE_DESTINATIONS.map(destination => (
              <TransparentShareButton
                key={destination.id}
                destination={destination}
                onClick={() => handleShareClick(destination)}
                disabled={!processedFile}
              />
            ))}
          </div>

          <div className="mt-3 text-xs text-gray-500 text-center">
            Hover over any button to see privacy details
          </div>
        </div>
      )}

      {/* Privacy Gate Modal */}
      {showPrivacyGate && selectedDestination && processedFile && (
        <PrivacyGate
          destination={selectedDestination}
          fileInfo={{
            name: fileName,
            size: processedFile.size,
            type: processedFile.type || 'application/pdf'
          }}
          onConfirm={handleExternalShare}
          onCancel={() => setShowPrivacyGate(false)}
        />
      )}
    </>
  );
};

// ========================================
// 既存のPDFStudioClientに追加する使用例
// ========================================

/*
// PDFStudioClient.tsx に以下を追加:

import { PrivacyIntegration } from './components/PrivacyIntegration';

// コンポーネント内で:
const [filesProcessedCount, setFilesProcessedCount] = useState(0);

// 処理完了時:
const handleProcessComplete = (processedBlob: Blob) => {
  setProcessedFile(processedBlob);
  setFilesProcessedCount(prev => prev + 1);
};

// JSX内で:
<PrivacyIntegration
  processedFile={processedFile}
  fileName={currentFileName}
  filesProcessedCount={filesProcessedCount}
/>
*/

// ========================================
// Tailwind CSS アニメーション設定
// ========================================

/*
// tailwind.config.js に以下を追加:

module.exports = {
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'slideDown': 'slideDown 0.3s ease-out',
        'scaleIn': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    }
  }
}
*/