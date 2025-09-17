import { RefObject } from 'react';
import { Upload, Download, Printer, Maximize2, Info, HelpCircle, Undo, Redo, X, Shield } from 'lucide-react';
import Link from 'next/link';

interface ToolbarProps {
  file: File | null;
  pages: any[];
  selectedPages: Set<string>;
  isMobile: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePrint: () => void;
  handleDownload: () => void;
  toggleFullscreen: () => void;
  showLicenseStatus: () => void;
  isProcessing: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  handleClearFile: () => void;
  togglePrivacyDashboard?: () => void; // Add this prop
}

export function Toolbar({
  file,
  pages,
  selectedPages,
  isMobile,
  fileInputRef,
  handleFileUpload,
  handlePrint,
  handleDownload,
  toggleFullscreen,
  showLicenseStatus,
  isProcessing,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo,
  handleClearFile,
  togglePrivacyDashboard
}: ToolbarProps) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition text-sm flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span className={isMobile ? 'hidden' : ''}>Upload</span>
        </button>

        {file && (
          <>
            {/* Undo/Redo buttons */}
            <div className="flex items-center gap-1 px-1 border-l border-gray-600 ml-1">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className="p-1.5 rounded hover:bg-gray-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4 text-gray-300" />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className="p-1.5 rounded hover:bg-gray-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            {/* Clear button */}
            <button
              onClick={handleClearFile}
              className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition text-sm flex items-center gap-2"
              title="Clear current file"
            >
              <X className="w-4 h-4" />
              <span className={isMobile ? 'hidden' : ''}>Clear</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition text-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span className={isMobile ? 'hidden' : ''}>Print</span>
            </button>

            {!isMobile && (
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition text-sm"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            <span className="text-sm text-gray-400 hidden sm:inline">
              {pages.length} pages • {selectedPages.size} selected
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Privacy Dashboard Toggle */}
        {togglePrivacyDashboard && (
          <button
            onClick={togglePrivacyDashboard}
            className="p-2 text-gray-400 hover:text-gray-300 transition"
            title="Privacy Dashboard"
          >
            <Shield className="w-4 h-4" />
          </button>
        )}
        
        {/* License Status */}
        <button
          onClick={showLicenseStatus}
          className="p-2 text-gray-400 hover:text-gray-300 transition"
          title="License Status"
        >
          <Info className="w-4 h-4" />
        </button>

        <Link
          href="/tools/pdf-tools/help"
          className="p-2 text-gray-400 hover:text-gray-300 transition"
          title="Help"
        >
          <HelpCircle className="w-4 h-4" />
        </Link>

        {file && (
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded hover:from-cyan-600 hover:to-blue-600 transition text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className={isMobile ? 'hidden' : ''}>Download</span>
          </button>
        )}
      </div>
    </div>
  );
}