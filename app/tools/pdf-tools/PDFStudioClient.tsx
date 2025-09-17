// app/tools/pdf-tools/PDFStudioClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Menu, ChevronLeft } from 'lucide-react';
import PWAInstaller from './components/PWAInstaller';

// Import hooks
import { usePDFLoader } from './hooks/usePDFLoader';
import { usePageSelection } from './hooks/usePageSelection';
import { useLicenseManager } from './hooks/useLicenseManager';
import { usePDFEditor } from './hooks/usePDFEditor';

// Import components - Check if these are default or named exports
import ToolPanel from './components/ToolPanel';  // Changed to default import
import Toolbar from './components/Toolbar';      // Changed to default import
import PDFViewer from './components/PDFViewer';   // Changed to default import
import UpgradeModal from './components/UpgradeModal';  // Changed to default import
import LicenseStatusModal from './components/LicenseStatusModal';  // Changed to default import
import PrivacyDashboard from './components/PrivacyDashboard';      // Changed to default import
import PrivacyIntegration from './components/PrivacyIntegration';  // Added import

// Import feature handlers
import { RotateHandler } from './features/rotate/RotateHandler';
import { SplitHandler } from './features/split/SplitHandler';
import { MergeHandler } from './features/merge/MergeHandler';
import { CompressHandler } from './features/compress/CompressHandler';
import { PageNumberHandler } from './features/pageNumber/PageNumberHandler';
import { BlankPageHandler } from './features/blankPage/BlankPageHandler';
import { DuplicateHandler } from './features/duplicate/DuplicateHandler';
import { OCRHandler } from './features/ocr/OCRHandler';
import { PasswordHandler } from './features/password/PasswordHandler';
import { PasswordUI } from './features/password/PasswordUI';
import { WatermarkHandler } from './features/watermark/WatermarkHandler';
import { WatermarkUI } from './features/watermark/WatermarkUI';
import { SignatureHandler } from './features/signature/SignatureHandler';
import { SignatureUI } from './features/signature/SignatureUI';
import { ConvertHandler } from './features/convert/ConvertHandler';
import { ConvertUI } from './features/convert/ConvertUI';

// Import constants
import { availableTools, MAX_FREE_SLOTS } from './constants/tools';
import { Tool } from './types';

// File constraints
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_PAGES = 100; // Maximum 100 pages
const MAX_OCR_SIZE = 10 * 1024 * 1024; // 10MB for OCR

export default function PDFStudioClient() {
  // Core hooks
  const { 
    file,
    pages: initialPages,
    setPages: setInitialPages,
    isProcessing,
    setIsProcessing,
    loadPDF,
    setFile
  } = usePDFLoader();
  
  const { selectedPages, handlePageSelect, clearSelection } = usePageSelection();
  
  const { 
    isPremium, 
    isLoadingPayment, 
    showUpgradeModal, 
    setShowUpgradeModal,
    handleUpgradeToPremium,
    showLicenseStatus // Get but don't use - we'll use our own modal handler
  } = useLicenseManager();
  
  // History management hook
  const {
    pages,
    updatePages,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory
  } = usePDFEditor(initialPages);

  // UI state
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [draggedPage, setDraggedPage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPasswordUI, setShowPasswordUI] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [showWatermarkUI, setShowWatermarkUI] = useState(false);
  const [showSignatureUI, setShowSignatureUI] = useState(false);
  const [showConvertUI, setShowConvertUI] = useState(false);
  const [convertFormat, setConvertFormat] = useState<'word' | 'excel'>('word');
  const [filesProcessedCount, setFilesProcessedCount] = useState(0);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showPrivacyDashboard, setShowPrivacyDashboard] = useState(true);

  // Tool management
  const [activeToolSlots, setActiveToolSlots] = useState<(Tool | null)[]>(
    Array(6).fill(null)
  );
  const [isSelectingTool, setIsSelectingTool] = useState<number | null>(null);

  // Update pages when initial pages change - FIXED: removed updatePages from dependencies
  useEffect(() => {
    if (initialPages.length > 0 && pages.length === 0) {
      updatePages(initialPages);
    }
  }, [initialPages]); // Removed updatePages from dependencies to prevent infinite loop

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Page leave warning
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

  // Toggle privacy dashboard visibility
  const togglePrivacyDashboard = () => {
    setShowPrivacyDashboard(prev => !prev);
  };

  // Handle license status with modal
  const handleShowLicenseStatus = () => {
    setShowLicenseModal(true);
  };

  // Handle process complete for privacy integration
  const handleProcessComplete = (blob: Blob) => {
    setProcessedFile(blob);
    setFilesProcessedCount(prev => prev + 1);
  };

  // File upload handler with size validation
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    
    if (!uploadedFile) return;
    
    // File type check
    if (uploadedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    // File size check
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
      
      // Page count check
      if (newPages.length > MAX_PAGES) {
        alert(`PDF has ${newPages.length} pages. Maximum allowed is ${MAX_PAGES} pages.`);
        setFile(null);
        setInitialPages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      // Set default tools
      const defaultSlots = [...activeToolSlots];
      defaultSlots[0] = availableTools[0]; // Rotate
      defaultSlots[1] = availableTools[3]; // Delete
      defaultSlots[2] = availableTools[2]; // Split
      setActiveToolSlots(defaultSlots);
    } catch (error) {
      alert('Failed to load PDF. Please try again.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Clear file handler
  const handleClearFile = () => {
    if (confirm('Are you sure you want to clear the current file? All changes will be lost.')) {
      setFile(null);
      setInitialPages([]);
      clearSelection();
      clearHistory();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    if (canUndo) {
      undo();
      clearSelection();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
      clearSelection();
    }
  };

  // Tool selection
  const handleToolSelect = (tool: Tool | null, slotIndex: number) => {
    const newSlots = [...activeToolSlots];
    newSlots[slotIndex] = tool;
    setActiveToolSlots(newSlots);
    setIsSelectingTool(null);
    
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  const handleWatermark = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }
    
    setShowWatermarkUI(true);
  };

  const handleApplyWatermark = async (options: any) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const watermarkedPdf = await WatermarkHandler.addWatermark(file, options);
      downloadPDF(watermarkedPdf, `watermarked_${file.name}`);
      alert('Watermark added successfully!');
      setShowWatermarkUI(false);
      handleProcessComplete(new Blob([watermarkedPdf], { type: 'application/pdf' }));
    } catch (error) {
      console.error('Watermark error:', error);
      alert('Failed to add watermark');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle slot click with tool execution
  const handleSlotClick = (index: number) => {
    const tool = activeToolSlots[index];
    const isLocked = index >= MAX_FREE_SLOTS && !isPremium;
    
    if (isLocked) {
      setShowUpgradeModal(true);
      return;
    }
    
    if (tool) {
      switch(tool.id) {
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
          handleToWord();
          break;
        case 'toExcel':
          handleToExcel();
          break;
      }
    } else {
      setIsSelectingTool(index);
    }
  };

  // Tool actions
  const handleRotateSelected = async () => {
    if (selectedPages.size === 0) {
      alert('Select pages to rotate');
      return;
    }
    
    const rotatedPages = RotateHandler.rotateInMemory(
      pages, 
      selectedPages, 
      90
    );
    updatePages(rotatedPages);
  };

  const handleDeleteSelected = () => {
    if (selectedPages.size === 0) {
      alert('Select pages to delete');
      return;
    }
    if (confirm(`Delete ${selectedPages.size} page(s)?`)) {
      const newPages = pages.filter(page => !selectedPages.has(page.id));
      updatePages(newPages);
      clearSelection();
    }
  };

  const handleSplit = async () => {
    if (!file || selectedPages.size === 0) {
      alert('Select pages to extract');
      return;
    }
    
    try {
      const pageNumbers = pages
        .filter(p => selectedPages.has(p.id))
        .map(p => p.pageNumber);
      
      const extractedPdf = await SplitHandler.extractPages(file, pageNumbers);
      downloadPDF(extractedPdf, `extracted_${file.name}`);
      handleProcessComplete(new Blob([extractedPdf], { type: 'application/pdf' }));
    } catch (error) {
      console.error('Split error:', error);
      alert('Failed to split PDF');
    }
  };

  const handleMerge = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf';
      input.multiple = true;
      input.onchange = async (e) => {
        const additionalFiles = Array.from((e.target as HTMLInputElement).files || []);
        if (file && additionalFiles.length > 0) {
          const mergedPdf = await MergeHandler.mergeFiles([file, ...additionalFiles]);
          downloadPDF(mergedPdf, `merged_${file.name}`);
          handleProcessComplete(new Blob([mergedPdf], { type: 'application/pdf' }));
        }
      };
      input.click();
    } catch (error) {
      console.error('Merge error:', error);
      alert('Failed to merge PDFs');
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    
    try {
      const compressedPdf = await CompressHandler.compress(file, 'medium');
      downloadPDF(compressedPdf, `compressed_${file.name}`);
      handleProcessComplete(new Blob([compressedPdf], { type: 'application/pdf' }));
    } catch (error) {
      console.error('Compress error:', error);
      alert('Failed to compress PDF');
    }
  };

  const handleAddPageNumbers = async () => {
    if (!file) return;
    
    try {
      const pdfWithNumbers = await PageNumberHandler.addPageNumbers(file, {
        position: 'bottom-center',
        format: 'X',
        startFrom: 1,
        fontSize: 12
      });
      downloadPDF(pdfWithNumbers, `numbered_${file.name}`);
      handleProcessComplete(new Blob([pdfWithNumbers], { type: 'application/pdf' }));
    } catch (error) {
      console.error('Page number error:', error);
      alert('Failed to add page numbers');
    }
  };

  const handleSignature = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }
    
    setShowSignatureUI(true);
  };

  const handleApplySignature = async (data: any) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      let result: Uint8Array;
      
      if (data.type === 'signature') {
        result = await SignatureHandler.addSignature(file, data.options);
        downloadPDF(result, `signed_${file.name}`);
        alert('Signature added successfully!');
      } else if (data.type === 'stamp') {
        result = await SignatureHandler.addStamp(file, data.options);
        downloadPDF(result, `stamped_${file.name}`);
        alert('Stamp added successfully!');
      }
      
      handleProcessComplete(new Blob([result], { type: 'application/pdf' }));
      setShowSignatureUI(false);
    } catch (error) {
      console.error('Signature/Stamp error:', error);
      alert('Failed to add signature or stamp');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInsertBlankPage = () => {
    const pageNumber = prompt('Insert blank page after page number:');
    if (pageNumber) {
      const newPages = BlankPageHandler.insertBlankPagesInMemory(
        pages,
        [parseInt(pageNumber)]
      );
      updatePages(newPages);
    }
  };

  const handleDuplicatePages = () => {
    if (selectedPages.size === 0) {
      alert('Select pages to duplicate');
      return;
    }
    
    const newPages = DuplicateHandler.duplicatePagesInMemory(
      pages,
      selectedPages,
      true
    );
    updatePages(newPages);
    clearSelection();
  };

  const handleToWord = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }
    
    setConvertFormat('word');
    setShowConvertUI(true);
  };

  const handleToExcel = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }
    
    setConvertFormat('excel');
    setShowConvertUI(true);
  };

  const handleConvert = async (format: string, options: any) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      let result: Blob;
      let filename: string;
      
      switch (format) {
        case 'word':
          result = await ConvertHandler.toWord(file, options);
          filename = file.name.replace('.pdf', '.docx');
          break;
        case 'excel':
          result = await ConvertHandler.toExcel(file, options);
          filename = file.name.replace('.pdf', '.xlsx');
          break;
        case 'text':
          const text = await ConvertHandler.toText(file);
          result = new Blob([text], { type: 'text/plain' });
          filename = file.name.replace('.pdf', '.txt');
          break;
        case 'html':
          const html = await ConvertHandler.toHTML(file, options.preserveFormatting);
          result = new Blob([html], { type: 'text/html' });
          filename = file.name.replace('.pdf', '.html');
          break;
        default:
          throw new Error('Unsupported format');
      }
      
      // Download the converted file
      const url = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      handleProcessComplete(result);
      alert(`Successfully converted to ${format.toUpperCase()}!`);
      setShowConvertUI(false);
    } catch (error) {
      console.error('Conversion error:', error);
      alert(`Failed to convert to ${format}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // OCR Handler with progress display
  const testOCR = async () => {
    await OCRHandler.testOCR();
  };

  const handleOCR = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }
    
    console.log('Testing OCR functionality...');

    // Size check for OCR
    if (file.size > MAX_OCR_SIZE) {
      if (!confirm('Large files may take longer to process. Continue?')) {
        return;
      }
    }
    
    // Output type selection
    const outputType = confirm(
      'Choose OCR output type:\n\n' +
      'OK = Searchable PDF (keeps original layout)\n' +
      'Cancel = Text file only'
    );
    
    setIsProcessing(true);
    
    // Create progress modal
    const progressModal = document.createElement('div');
    progressModal.className = 'fixed inset-0 z-[10000] flex items-center justify-center bg-black/50';
    progressModal.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-white text-lg font-medium mb-4">OCR Processing</h3>
        <div class="mb-4">
          <div class="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div id="ocr-progress-bar" class="bg-cyan-500 h-full transition-all duration-300" style="width: 0%"></div>
          </div>
        </div>
        <p id="ocr-status" class="text-gray-300 text-sm">Initializing...</p>
      </div>
    `;
    document.body.appendChild(progressModal);
    
    try {
      if (outputType) {
        // Create searchable PDF
        const searchablePdf = await OCRHandler.createSearchablePDF(
          file,
          'eng',
          'fast',
          (progress) => {
            const progressBar = document.getElementById('ocr-progress-bar');
            const statusText = document.getElementById('ocr-status');
            if (progressBar) progressBar.style.width = `${progress.progress}%`;
            if (statusText) statusText.textContent = progress.status;
          }
        );
        
        downloadPDF(searchablePdf, `searchable_${file.name}`);
        handleProcessComplete(new Blob([searchablePdf], { type: 'application/pdf' }));
        alert('Searchable PDF created successfully!');
      } else {
        // Extract text only
        const result = await OCRHandler.processPDF(
          file,
          {
            language: 'eng',
            mode: 'fast',
            outputFormat: 'text'
          },
          (progress) => {
            const progressBar = document.getElementById('ocr-progress-bar');
            const statusText = document.getElementById('ocr-status');
            if (progressBar) progressBar.style.width = `${progress.progress}%`;
            if (statusText) statusText.textContent = progress.status;
          }
        );
        
        // Download text file
        if (typeof result === 'string') {
          const blob = new Blob([result], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${file.name.replace('.pdf', '')}_OCR.txt`;
          a.click();
          URL.revokeObjectURL(url);
          
          handleProcessComplete(blob);
          alert('OCR text extraction completed!');
        }
      }
    } catch (error) {
      console.error('OCR error:', error);
      alert('OCR processing failed. Please try again with a smaller file.');
    } finally {
      setIsProcessing(false);
      document.body.removeChild(progressModal);
    }
  };

  const handlePrint = async () => {
    if (!file || pages.length === 0) {
      alert('No file to print');
      return;
    }
    
    try {
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
      
      const pdfBytes = await newPdfDoc.save();
      // FIXED: Wrap Uint8Array in new Uint8Array to ensure proper type
      const buffer = new Uint8Array(pdfBytes);
      const blob = new Blob([buffer], { type: 'application/pdf' });
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

  const handlePassword = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }
    
    setShowPasswordUI(true);
  };

  const handleAddPassword = async (options: any) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const protectedPdf = await PasswordHandler.addPassword(file, options);
      downloadPDF(protectedPdf, `protected_${file.name}`);
      handleProcessComplete(new Blob([protectedPdf], { type: 'application/pdf' }));
      alert('Password protection added successfully!');
      setShowPasswordUI(false);
    } catch (error) {
      console.error('Password protection error:', error);
      alert('Failed to add password protection');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePassword = async (password: string) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const unprotectedPdf = await PasswordHandler.removePassword(file, password);
      downloadPDF(unprotectedPdf, `unlocked_${file.name}`);
      handleProcessComplete(new Blob([unprotectedPdf], { type: 'application/pdf' }));
      alert('Password protection removed successfully!');
      setShowPasswordUI(false);
      setIsPasswordProtected(false);
    } catch (error) {
      console.error('Password removal error:', error);
      alert('Failed to remove password. Please check the password and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!file || pages.length === 0) return;
    
    try {
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
      
      const pdfBytes = await newPdfDoc.save();
      downloadPDF(pdfBytes, `edited_${file.name}`);
      handleProcessComplete(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to prepare download');
    }
  };

  // FIXED: downloadPDF function with proper type handling
  const downloadPDF = (pdfBytes: Uint8Array, filename: string) => {
    // Ensure proper Uint8Array type by creating new instance
    const buffer = new Uint8Array(pdfBytes);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Touch handlers
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
    
    updatePages(newPages);
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
      {/* Mobile header */}
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
          togglePrivacyDashboard={togglePrivacyDashboard}
          isProcessing={isProcessing}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          handleClearFile={handleClearFile}
        />

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
          onConvert={handleConvert}
          onCancel={() => setShowConvertUI(false)}
          isProcessing={isProcessing}
        />
      )}

      {showPrivacyDashboard && (
        <PrivacyDashboard
          filesProcessed={filesProcessedCount}
          currentFile={file}
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

      <PrivacyIntegration
        processedFile={processedFile}
        fileName={file?.name || 'processed.pdf'}
        filesProcessedCount={filesProcessedCount}
      />
      
      <PWAInstaller />
    </div>
  );
}