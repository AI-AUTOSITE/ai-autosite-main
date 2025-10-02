// app/tools/pdf-tools/features/ocr/OCRHandler.ts
import Tesseract from 'tesseract.js';
import { PDFDocument, rgb } from 'pdf-lib';
import pdfjsLib from '../../lib/pdfjs-config';

interface OCROptions {
  language?: 'eng' | 'jpn' | 'chi_sim';
  mode?: 'fast' | 'accurate' | 'balanced';
  outputFormat?: 'text' | 'searchable';
}

interface OCRProgress {
  status: string;
  progress: number;
  currentPage?: number;
  totalPages?: number;
}

export class OCRHandler {
  static async processPDF(
    file: File,
    options: OCROptions = {},
    onProgress?: (progress: OCRProgress) => void
  ): Promise<string | Uint8Array> {
    const { 
      language = 'eng',
      mode = 'fast',
      outputFormat = 'text' 
    } = options;

    console.log('Starting OCR processing...', { language, mode, outputFormat });

    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log('File loaded, size:', arrayBuffer.byteLength);
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      console.log('PDF loaded, pages:', numPages);
      
      if (outputFormat === 'text') {
        let allText = '';
        
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          onProgress?.({
            status: `Processing page ${pageNum} of ${numPages}`,
            progress: ((pageNum - 1) / numPages) * 100,
            currentPage: pageNum,
            totalPages: numPages
          });

          try {
            console.log(`Processing page ${pageNum}...`);
            
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.0 }); // Scale reduced for testing
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            if (!context) {
              throw new Error('Failed to get canvas context');
            }
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
            
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;
            
            console.log('Page rendered to canvas');
            
            // Convert to blob instead of data URL for better performance
            const blob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((blob) => resolve(blob!), 'image/png');
            });
            
            console.log('Starting Tesseract recognition...');
            
            // Simple Tesseract call without worker options
            const result = await Tesseract.recognize(blob, language);
            
            console.log(`OCR completed for page ${pageNum}`);
            allText += result.data.text + '\n\n';
            
          } catch (pageError) {
            console.error(`Error processing page ${pageNum}:`, pageError);
            // Continue with next page
          }
          
          onProgress?.({
            status: `Completed page ${pageNum}`,
            progress: (pageNum / numPages) * 100,
            currentPage: pageNum,
            totalPages: numPages
          });
        }
        
        return allText;
      } else {
        return await this.createSearchablePDF(file, language, mode, onProgress);
      }
    } catch (error) {
      console.error('OCR processing error details:', error);
      throw error;
    }
  }
  
  static async createSearchablePDF(
    file: File,
    language: string = 'eng',
    mode: string = 'fast',
    onProgress?: (progress: OCRProgress) => void
  ): Promise<Uint8Array> {
    // Simplified version for testing
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // For now, just return the original PDF
    // Full implementation would add text layer here
    console.log('Creating searchable PDF (simplified version)');
    
    return await pdfDoc.save();
  }
  
  // Test function to check if Tesseract works at all
  static async testOCR(): Promise<void> {
    console.log('Testing Tesseract...');
    
    try {
      // Create a simple test image
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext('2d')!;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 200, 50);
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.fillText('Test OCR', 10, 30);
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });
      
      const result = await Tesseract.recognize(blob, 'eng');
      console.log('Test OCR result:', result.data.text);
      alert('OCR test successful: ' + result.data.text);
    } catch (error) {
      console.error('Test OCR failed:', error);
      alert('OCR test failed. Check console for details.');
    }
  }
}