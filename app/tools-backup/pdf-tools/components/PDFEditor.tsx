'use client';

import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, degrees } from 'pdf-lib';
import { 
  Download, RotateCw, Trash2, Scissors, 
  FileStack, Minimize2, X, GripVertical,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Tool } from '../types';

// PDF.js workerの設定
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PageData {
  id: string;
  pageNumber: number;
  rotation: number;
  thumbnail: string;
}

interface PDFEditorProps {
  file: File;
  activeTools: Tool[];
  onFileChange: () => void;
}

export default function PDFEditor({ file, activeTools, onFileChange }: PDFEditorProps) {
  const [pages, setPages] = useState<PageData[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [draggedPage, setDraggedPage] = useState<string | null>(null);

  // PDFの読み込みとサムネイル生成
  useEffect(() => {
    const loadPDF = async () => {
      setIsProcessing(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        setPdfDoc(pdf);

        const newPages: PageData[] = [];
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d')!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          newPages.push({
            id: `page-${i}`,
            pageNumber: i,
            rotation: 0,
            thumbnail: canvas.toDataURL()
          });
        }
        
        setPages(newPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
      setIsProcessing(false);
    };

    if (file) {
      loadPDF();
    }
  }, [file]);

  // ツールアクション実行
  const executeToolAction = (toolId: string) => {
    switch (toolId) {
      case 'rotate':
        handleRotateSelected();
        break;
      case 'split':
        handleSplitSelected();
        break;
      case 'merge':
        alert('Merge feature - Upload additional PDFs');
        break;
      case 'compress':
        handleCompress();
        break;
      default:
        alert(`${toolId} feature coming soon!`);
    }
  };

  // ページ選択
  const togglePageSelection = (pageId: string) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageId)) {
      newSelected.delete(pageId);
    } else {
      newSelected.add(pageId);
    }
    setSelectedPages(newSelected);
  };

  // 回転処理
  const handleRotateSelected = () => {
    if (selectedPages.size === 0) {
      alert('Please select pages to rotate');
      return;
    }
    
    setPages(pages.map(page => 
      selectedPages.has(page.id) 
        ? { ...page, rotation: (page.rotation + 90) % 360 }
        : page
    ));
  };

  // 分割処理
  const handleSplitSelected = () => {
    if (selectedPages.size === 0) {
      alert('Please select pages to extract');
      return;
    }
    
    const selectedPageNumbers = pages
      .filter(p => selectedPages.has(p.id))
      .map(p => p.pageNumber);
    
    alert(`Extracting pages: ${selectedPageNumbers.join(', ')}`);
  };

  // 圧縮処理
  const handleCompress = async () => {
    alert('Compressing PDF...');
  };

  // ドラッグ&ドロップ
  const handleDragStart = (pageId: string) => {
    setDraggedPage(pageId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPageId: string) => {
    e.preventDefault();
    if (!draggedPage || draggedPage === targetPageId) return;

    const draggedIndex = pages.findIndex(p => p.id === draggedPage);
    const targetIndex = pages.findIndex(p => p.id === targetPageId);
    
    const newPages = [...pages];
    const [removed] = newPages.splice(draggedIndex, 1);
    newPages.splice(targetIndex, 0, removed);
    
    setPages(newPages);
    setDraggedPage(null);
  };

  // ダウンロード処理
// ダウンロード処理（型エラー修正版）
const handleDownload = async () => {
  setIsProcessing(true);
  try {
    const pdfDoc = await PDFDocument.create();
    // 実際のPDF生成処理をここに実装
    
    const pdfBytes = await pdfDoc.save();
    
    // Method 1: ArrayBufferに変換（互換性重視）
    const arrayBuffer = new ArrayBuffer(pdfBytes.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < pdfBytes.byteLength; i++) {
      view[i] = pdfBytes[i];
    }
    
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edited_${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
  }
  setIsProcessing(false);
};

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* ツールバー */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onFileChange}
              className="p-2 text-gray-400 hover:text-gray-300"
              title="Change PDF"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-400">
              {file.name} ({pages.length} pages)
            </span>
          </div>

          {/* Active Tools */}
          <div className="flex items-center gap-2">
            {activeTools.slice(0, 3).map(tool => (
              <button
                key={tool.id}
                onClick={() => executeToolAction(tool.id)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
              >
                {tool.id === 'rotate' && <RotateCw className="w-4 h-4" />}
                {tool.id === 'split' && <Scissors className="w-4 h-4" />}
                {tool.id === 'merge' && <FileStack className="w-4 h-4" />}
                {tool.id === 'compress' && <Minimize2 className="w-4 h-4" />}
                <span className="text-sm">{tool.name}</span>
              </button>
            ))}
            
            <div className="ml-4 h-8 w-px bg-gray-700" />
            
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
        
        {selectedPages.size > 0 && (
          <div className="mt-2 text-xs text-cyan-400">
            {selectedPages.size} page(s) selected
          </div>
        )}
      </div>

      {/* エディタ本体 */}
      <div className="flex-1 flex overflow-hidden">
        {/* サイドバー - ページサムネイル */}
        <div className="w-48 bg-gray-800 border-r border-gray-700 overflow-y-auto p-2">
          <div className="space-y-2">
            {pages.map((page) => (
              <div
                key={page.id}
                draggable
                onDragStart={() => handleDragStart(page.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, page.id)}
                onClick={() => togglePageSelection(page.id)}
                className={`relative cursor-pointer rounded-lg p-2 transition-all ${
                  selectedPages.has(page.id)
                    ? 'bg-cyan-500/20 ring-2 ring-cyan-400'
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="w-3 h-3 text-gray-500" />
                  <img
                    src={page.thumbnail}
                    alt={`Page ${page.pageNumber}`}
                    className="w-12 h-16 object-cover rounded"
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                  />
                  <span className="text-xs text-gray-300">
                    {page.pageNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* メインプレビューエリア */}
        <div className="flex-1 p-8 overflow-auto bg-gray-900">
          {isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Processing...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => togglePageSelection(page.id)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                    selectedPages.has(page.id)
                      ? 'ring-2 ring-cyan-400 transform scale-105'
                      : 'hover:ring-2 hover:ring-gray-600'
                  }`}
                >
                  <img
                    src={page.thumbnail}
                    alt={`Page ${page.pageNumber}`}
                    className="w-full h-auto bg-white"
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-xs text-white">Page {page.pageNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}