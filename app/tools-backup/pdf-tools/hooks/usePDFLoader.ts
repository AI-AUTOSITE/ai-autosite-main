// app/tools/pdf-tools/hooks/usePDFLoader.ts
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PageData } from '../types';

// PDF.js worker setup
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export function usePDFLoader() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const loadPDF = async (pdfFile: File, isMobile: boolean) => {
    setIsProcessing(true);
    setFile(pdfFile);
    
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const newPages: PageData[] = [];
      
      const scale = isMobile ? 0.2 : 0.3;
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
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
      return newPages;
    } catch (error) {
      console.error('Error loading PDF:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    file,
    pages,
    setPages,
    isProcessing,
    setIsProcessing,  
    loadPDF,
    setFile
  };
}