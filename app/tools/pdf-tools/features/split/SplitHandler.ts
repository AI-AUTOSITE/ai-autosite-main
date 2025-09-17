import { PDFDocument } from 'pdf-lib';
import { PageData } from '../../types';

export class SplitHandler {
  static async extractPages(
    file: File,
    pageNumbers: number[]
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();
    
    // Copy selected pages to new PDF
    const pages = await newPdf.copyPages(
      srcPdf, 
      pageNumbers.map(n => n - 1) // Convert to 0-based index
    );
    
    pages.forEach(page => newPdf.addPage(page));
    
    return await newPdf.save();
  }
  
  static async splitIntoSingle(file: File): Promise<Uint8Array[]> {
    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(arrayBuffer);
    const pageCount = srcPdf.getPageCount();
    const results: Uint8Array[] = [];
    
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(srcPdf, [i]);
      newPdf.addPage(page);
      results.push(await newPdf.save());
    }
    
    return results;
  }
}