import { RefObject } from 'react';
import { 
  Upload, 
  Download, 
  Printer, 
  Maximize2, 
  Info, 
  HelpCircle, 
  Undo, 
  Redo, 
  X
} from 'lucide-react';
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
  handleClearFile
}: ToolbarProps) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left side - File operations */}
        <div className="flex items-center gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition text-sm flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {!isMobile && <span>Upload</span>}
          </button>

          {file && (
            <>
              {/* Separator */}
              <div className="w-px h-6 bg-gray-600 mx-1" />
              
              {/* Undo/Redo */}
              <div className="flex items-center gap-1">
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

              {/* Separator */}
              <div className="w-px h-6 bg-gray-600 mx-1" />

              {/* Clear button */}
              <button
                onClick={handleClearFile}
                className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition text-sm flex items-center gap-2"
                title="Clear current file"
              >
                <X className="w-4 h-4" />
                {!isMobile && <span>Clear</span>}
              </button>

              {/* Print button */}
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition text-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                {!isMobile && <span>Print</span>}
              </button>

              {/* Fullscreen button - desktop only */}
              {!isMobile && (
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded hover:bg-gray-700 transition"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4 text-gray-300" />
                </button>
              )}

              {/* Page counter */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded text-sm">
                <span className="text-gray-400">{pages.length} pages</span>
                <span className="text-gray-600">•</span>
                <span className={`${selectedPages.size > 0 ? 'text-cyan-400' : 'text-gray-400'}`}>
                  {selectedPages.size} selected
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right side - Info and actions */}
        <div className="flex items-center gap-2">
          {/* Help Link */}
          <Link
            href="/tools/pdf-tools/help"
            className="p-2 text-gray-400 hover:text-gray-300 transition"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>

          {/* Download Button */}
          {file && (
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded hover:from-cyan-600 hover:to-blue-600 transition text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {!isMobile && <span>Download</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}