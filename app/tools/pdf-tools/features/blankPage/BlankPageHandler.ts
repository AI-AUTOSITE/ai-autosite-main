// app/tools/pdf-tools/features/blankPage/BlankPageHandler.ts
import { PDFDocument, PageSizes } from 'pdf-lib';
import { PageData } from '../../types';

export type PageSize = 'A4' | 'Letter' | 'Legal' | 'A3' | 'Same as document';

export class BlankPageHandler {
  static async insertBlankPages(
    file: File,
    insertPositions: number[], // Page numbers after which to insert
    pageSize: PageSize = 'Same as document'
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    // Get page dimensions
    let width, height;
    if (pageSize === 'Same as document' && pages.length > 0) {
      const firstPage = pages[0];
      ({ width, height } = firstPage.getSize());
    } else {
      const sizes = {
        'A4': PageSizes.A4,
        'Letter': PageSizes.Letter,
        'Legal': PageSizes.Legal,
        'A3': PageSizes.A3,
      };
      [width, height] = sizes[pageSize as keyof typeof sizes] || PageSizes.A4;
    }

    // Sort positions in descending order to insert from end
    const sortedPositions = [...insertPositions].sort((a, b) => b - a);
    
    // Create new document with blank pages inserted
    const newPdfDoc = await PDFDocument.create();
    
    for (let i = 0; i < pages.length; i++) {
      // Copy original page
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
      newPdfDoc.addPage(copiedPage);
      
      // Check if we need to insert blank page after this position
      if (insertPositions.includes(i + 1)) {
        const blankPage = newPdfDoc.addPage([width, height]);
        // Optionally add a light watermark or page number
      }
    }

    return await newPdfDoc.save();
  }

  static insertBlankPagesInMemory(
    pages: PageData[],
    afterPageNumbers: number[]
  ): PageData[] {
    const result: PageData[] = [];
    let insertCount = 0;

    pages.forEach((page, index) => {
      result.push(page);
      
      if (afterPageNumbers.includes(page.pageNumber)) {
        insertCount++;
        const blankPage: PageData = {
          id: `blank-${Date.now()}-${insertCount}`,
          pageNumber: page.pageNumber + 1,
          rotation: 0,
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSIgZm9udC1zaXplPSIxNCI+QmxhbmsgUGFnZTwvdGV4dD48L3N2Zz4='
        };
        result.push(blankPage);
      }
    });

    // Update page numbers
    return result.map((page, index) => ({
      ...page,
      pageNumber: index + 1
    }));
  }
}