'use client';

import './styles/pdf-tools.css';

import {useState,useEffect,useRef} from 'react';
import {PDFDocument,degrees} from 'pdf-lib';
import {Menu,ChevronLeft} from 'lucide-react';

// Hooks
import {usePDFLoader} from './hooks/usePDFLoader';
import {usePageSelection} from './hooks/usePageSelection';
import {useLicenseManager} from './hooks/useLicenseManager';
import {usePDFEditor} from './hooks/usePDFEditor';
import {usePDFToolHandlers} from './hooks/usePDFToolHandlers';

// Components
import PWAInstaller from './components/PWAInstaller';
import {ToolPanel} from './components/ToolPanel';
import {Toolbar} from './components/Toolbar';
import {PDFViewer} from './components/PDFViewer';
import {UpgradeModal} from './components/UpgradeModal';
import {LicenseStatusModal} from './components/LicenseStatusModal';

// Features
import {PasswordHandler} from './features/password/PasswordHandler';
import {PasswordUI} from './features/password/PasswordUI';
import {WatermarkUI} from './features/watermark/WatermarkUI';
import {SignatureUI} from './features/signature/SignatureUI';
import {ConvertUI} from './features/convert/ConvertUI';

// Constants
import {availableTools,MAX_FREE_SLOTS} from './constants/tools';
import {Tool} from './types';

// Helpers
import { uint8ArrayToBlob } from './utils/pdfHelpers';

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_PAGES = 100;

export default function PDFStudioClient() {
  // Core PDF hooks
  const {
    file,
    pages: initialPages,
    setPages: setInitialPages,
    isProcessing,
    setIsProcessing,
    loadPDF,
    setFile
  } = usePDFLoader();
  
  const {selectedPages, handlePageSelect, clearSelection} = usePageSelection();
  
  const {
    isPremium,
    isLoadingPayment,
    showUpgradeModal,
    setShowUpgradeModal,
    handleUpgradeToPremium,
    showLicenseStatus
  } = useLicenseManager();
  
  const {
    pages,
    updatePages,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory
  } = usePDFEditor(initialPages);

  // UI States
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [draggedPage, setDraggedPage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [convertFormat, setConvertFormat] = useState<'word' | 'excel'>('word');
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [isSelectingTool, setIsSelectingTool] = useState<number | null>(null);
  const [keepSelection, setKeepSelection] = useState(true);

  // Tool slots initialization
  const [activeToolSlots, setActiveToolSlots] = useState<(Tool | null)[]>(() => {
    const defaultSlots = Array(6).fill(null);
    defaultSlots[0] = availableTools.find(t => t.id === 'rotate') || null;
    defaultSlots[1] = availableTools.find(t => t.id === 'merge') || null;
    defaultSlots[2] = availableTools.find(t => t.id === 'split') || null;
    return defaultSlots;
  });

  // Helper functions
  const downloadPDF = (pdfBytes: Uint8Array, filename: string) => {
    const buffer = new Uint8Array(pdfBytes);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProcessComplete = (blob: Blob) => {
    // Process completion handler (for future use)
  };

  // Tool handlers hook
  const {
    showPasswordUI,
    setShowPasswordUI,
    showWatermarkUI,
    setShowWatermarkUI,
    showSignatureUI,
    setShowSignatureUI,
    showConvertUI,
    setShowConvertUI,
    isPasswordProtected,
    setIsPasswordProtected,
    handleRotateSelected,
    handleDeleteSelected,
    handleSplit,
    handleMerge,
    handleCompress,
    handleAddPageNumbers,
    handleInsertBlankPage,
    handleDuplicatePages,
    handlePassword,
    handleAddPassword,
    handleRemovePassword,
    handleWatermark,
    handleApplyWatermark,
    handleSignature,
    handleApplySignature,
    handleToWord,
    handleToExcel,
    handleConvert,
    handleOCR
  } = usePDFToolHandlers({
    file,
    pages,
    selectedPages,
    updatePages,
    clearSelection,
    setIsProcessing,
    downloadPDF,
    handleProcessComplete,
    keepSelection
  });

  // Sync pages
  useEffect(() => {
    if (initialPages.length > 0 && pages.length === 0) {
      updatePages(initialPages);
    }
  }, [initialPages, pages.length, updatePages]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Before unload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (file && pages.length > 0) {
        const message = 'Your edits will be lost. Are you sure you want to leave?';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [file, pages]);

  const handleShowLicenseStatus = () => {
    setShowLicenseModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (uploadedFile.size > MAX_FILE_SIZE) {
      alert(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit. Please upload a smaller file.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(uploadedFile);
    const isProtected = await PasswordHandler.isPasswordProtected(uploadedFile);
    setIsPasswordProtected(isProtected);
    
    if (isProtected) {
      alert('This PDF is password protected. Use the Password tool to unlock it.');
    }

    clearSelection();
    clearHistory();

    try {
      const newPages = await loadPDF(uploadedFile, isMobile);
      if (newPages.length > MAX_PAGES) {
        alert(`PDF has ${newPages.length} pages. Maximum allowed is ${MAX_PAGES} pages.`);
        setFile(null);
        setInitialPages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      updatePages(newPages);
    } catch (error) {
      alert('Failed to load PDF. Please try again.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClearFile = () => {
    if (confirm('Are you sure you want to clear the current file? All changes will be lost.')) {
      setFile(null);
      setInitialPages([]);
      updatePages([]);
      clearSelection();
      clearHistory();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
      if (!keepSelection) {
        clearSelection();
      }
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
      if (!keepSelection) {
        clearSelection();
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo]);

  const handleToolSelect = (tool: Tool | null, slotIndex: number) => {
    const newSlots = [...activeToolSlots];
    newSlots[slotIndex] = tool;
    setActiveToolSlots(newSlots);
    setIsSelectingTool(null);
    
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  const handleSlotClick = (index: number) => {
    const tool = activeToolSlots[index];
    const isLocked = index >= MAX_FREE_SLOTS && !isPremium;
    
    if (isLocked) {
      setShowUpgradeModal(true);
      return;
    }

    if (tool) {
      if (!file) {
        alert('Please upload a PDF file first');
        return;
      }
      
      switch (tool.id) {
        case 'rotate':
          handleRotateSelected();
          break;
        case 'merge':
          handleMerge();
          break;
        case 'split':
          handleSplit();
          break;
        case 'delete':
          handleDeleteSelected();
          break;
        case 'compress':
          handleCompress();
          break;
        case 'pageNumbers':
          handleAddPageNumbers();
          break;
        case 'blankPage':
          handleInsertBlankPage();
          break;
        case 'duplicate':
          handleDuplicatePages();
          break;
        case 'ocr':
          handleOCR();
          break;
        case 'annotate':
          alert('Annotation coming soon!');
          break;
        case 'highlight':
          alert('Highlight coming soon!');
          break;
        case 'crop':
          alert('Crop coming soon!');
          break;
        case 'password':
          handlePassword();
          break;
        case 'watermark':
          handleWatermark();
          break;
        case 'signature':
          handleSignature();
          break;
        case 'toWord':
          setConvertFormat('word');
          handleToWord();
          break;
        case 'toExcel':
          setConvertFormat('excel');
          handleToExcel();
          break;
      }
    } else {
      setIsSelectingTool(index);
    }
  };

  const createPDFFromPages = async (): Promise<Uint8Array> => {
    if (!file) throw new Error('No file loaded');
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdfDoc = await PDFDocument.create();
    
    for (const page of pages) {
      const pageIndex = page.pageNumber - 1;
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
      
      if (page.rotation !== 0) {
        copiedPage.setRotation(degrees(page.rotation));
      }
      
      newPdfDoc.addPage(copiedPage);
    }
    
    return await newPdfDoc.save();
  };

  const handleDownload = async () => {
    if (!file || pages.length === 0) {
      alert('No file to download');
      return;
    }
    
    setIsProcessing(true);
    try {
      const pdfBytes = await createPDFFromPages();
      downloadPDF(pdfBytes, `edited_${file.name}`);
      handleProcessComplete(uint8ArrayToBlob(pdfBytes));
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to prepare download');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = async () => {
    if (!file || pages.length === 0) {
      alert('No file to print');
      return;
    }
    
    try {
      const pdfBytes = await createPDFFromPages();
      const blob = uint8ArrayToBlob(pdfBytes);
      const fileURL = URL.createObjectURL(blob);
      
      const printWindow = window.open(fileURL);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
        };
      }
    } catch (error) {
      console.error('Print error:', error);
      alert('Failed to prepare print');
    }
  };

  const handleTouchStart = (pageId: string) => {
    setDraggedPage(pageId);
  };

  const handleTouchEnd = (e: React.TouchEvent, targetPageId: string) => {
    if (!draggedPage || draggedPage === targetPageId) return;
    
    const draggedIndex = pages.findIndex(p => p.id === draggedPage);
    const targetIndex = pages.findIndex(p => p.id === targetPageId);
    
    const newPages = [...pages];
    const [removed] = newPages.splice(draggedIndex, 1);
    newPages.splice(targetIndex, 0, removed);
    
    updatePages(newPages.map((page, index) => ({
      ...page,
      pageNumber: index + 1
    })));
    setDraggedPage(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded hover:bg-gray-700"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
          <span className="text-sm text-gray-300">
            {file ? file.name : 'PDF Editor'}
          </span>
          <button 
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="p-2 rounded hover:bg-gray-700"
          >
            <ChevronLeft className={`w-5 h-5 text-gray-300 transform transition ${!showThumbnails ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

      <ToolPanel
        isMobile={isMobile}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        activeToolSlots={activeToolSlots}
        handleSlotClick={handleSlotClick}
        isPremium={isPremium}
        isLoadingPayment={isLoadingPayment}
        showLicenseStatus={handleShowLicenseStatus}
        setShowUpgradeModal={setShowUpgradeModal}
        isSelectingTool={isSelectingTool}
        setIsSelectingTool={setIsSelectingTool}
        availableTools={availableTools}
        handleToolSelect={handleToolSelect}
      />

      <div className="flex-1 flex flex-col">
        <Toolbar
          file={file}
          pages={pages}
          selectedPages={selectedPages}
          isMobile={isMobile}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
          handlePrint={handlePrint}
          handleDownload={handleDownload}
          toggleFullscreen={toggleFullscreen}
          showLicenseStatus={handleShowLicenseStatus}
          isProcessing={isProcessing}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          handleClearFile={handleClearFile}
        />

        {/* Keep Selection Toggle */}
        {file && pages.length > 0 && (
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-4">
            <button
              onClick={() => setKeepSelection(!keepSelection)}
              className={`text-sm ${keepSelection ? 'text-cyan-400' : 'text-gray-400'}`}
            >
              {keepSelection ? '🔒 Keep Selection' : '🔓 Auto Clear'}
            </button>
          </div>
        )}

        <PDFViewer
          file={file}
          pages={pages}
          selectedPages={selectedPages}
          handlePageSelect={handlePageSelect}
          isMobile={isMobile}
          showThumbnails={showThumbnails}
          fileInputRef={fileInputRef}
          isPremium={isPremium}
          setShowUpgradeModal={setShowUpgradeModal}
          isProcessing={isProcessing}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          onPagesReorder={updatePages}
        />
      </div>

      {/* Modals */}
      {showPasswordUI && (
        <PasswordUI
          onAddPassword={handleAddPassword}
          onRemovePassword={handleRemovePassword}
          onCancel={() => setShowPasswordUI(false)}
          isProtected={isPasswordProtected}
        />
      )}

      {showWatermarkUI && (
        <WatermarkUI
          onApply={handleApplyWatermark}
          onCancel={() => setShowWatermarkUI(false)}
        />
      )}

      {showSignatureUI && (
        <SignatureUI
          onApply={handleApplySignature}
          onCancel={() => setShowSignatureUI(false)}
          totalPages={pages.length}
        />
      )}

      {showConvertUI && (
        <ConvertUI
          onConvert={(format, options) => handleConvert(format, { ...options, format: convertFormat })}
          onCancel={() => setShowConvertUI(false)}
          isProcessing={isProcessing}
        />
      )}

      {showLicenseModal && (
        <LicenseStatusModal
          isOpen={showLicenseModal}
          onClose={() => setShowLicenseModal(false)}
          onUpgrade={handleUpgradeToPremium}
          isPremium={isPremium}
        />
      )}

      <UpgradeModal
        showUpgradeModal={showUpgradeModal}
        setShowUpgradeModal={setShowUpgradeModal}
        handleUpgradeToPremium={handleUpgradeToPremium}
        isLoadingPayment={isLoadingPayment}
      />

      <PWAInstaller />
    </div>
  );
}