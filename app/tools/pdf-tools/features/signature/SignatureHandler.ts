// app/tools/pdf-tools/features/signature/SignatureHandler.ts
import { PDFDocument, rgb, PDFPage, StandardFonts } from 'pdf-lib';

export interface SignatureOptions {
  type: 'draw' | 'text' | 'image';
  signatureData: string | Uint8Array; // Base64 for draw, text for text, Uint8Array for image
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  includeDate?: boolean;
  dateFormat?: string;
  name?: string;
  title?: string;
}

export interface StampOptions {
  type: 'approved' | 'rejected' | 'reviewed' | 'confidential' | 'draft' | 'final' | 'custom';
  customText?: string;
  pageNumbers: number[];
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  color?: { r: number; g: number; b: number };
  includeDate?: boolean;
}

export class SignatureHandler {
  // Add signature to specific page
  static async addSignature(
    file: File,
    options: SignatureOptions
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    if (options.pageNumber < 1 || options.pageNumber > pages.length) {
      throw new Error('Invalid page number');
    }
    
    const page = pages[options.pageNumber - 1];
    
    if (options.type === 'draw' || options.type === 'image') {
      await this.addImageSignature(pdfDoc, page, options);
    } else if (options.type === 'text') {
      await this.addTextSignature(page, options);
    }
    
    // Add date if requested
    if (options.includeDate) {
      await this.addDateStamp(page, options);
    }
    
    return await pdfDoc.save();
  }
  
  private static async addImageSignature(
    pdfDoc: PDFDocument,
    page: PDFPage,
    options: SignatureOptions
  ) {
    let image;
    
    if (options.type === 'draw' && typeof options.signatureData === 'string') {
      // Handle drawn signature (base64 PNG)
      const base64Data = options.signatureData.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      image = await pdfDoc.embedPng(imageBytes);
    } else if (options.type === 'image' && options.signatureData instanceof Uint8Array) {
      // Handle uploaded image
      try {
        image = await pdfDoc.embedPng(options.signatureData);
      } catch {
        try {
          image = await pdfDoc.embedJpg(options.signatureData);
        } catch (error) {
          throw new Error('Unsupported image format');
        }
      }
    }
    
    if (image) {
      page.drawImage(image, {
        x: options.x,
        y: options.y,
        width: options.width,
        height: options.height,
      });
    }
  }
  
  private static async addTextSignature(
    page: PDFPage,
    options: SignatureOptions
  ) {
    if (typeof options.signatureData !== 'string') return;
    
    const font = await page.doc.embedFont(StandardFonts.Helvetica);
    const fontSize = Math.min(options.height * 0.4, 24);
    
    page.drawText(options.signatureData, {
      x: options.x,
      y: options.y + (options.height - fontSize) / 2,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    // Add name and title if provided
    if (options.name) {
      page.drawText(options.name, {
        x: options.x,
        y: options.y - fontSize - 5,
        size: fontSize * 0.7,
        font,
        color: rgb(0, 0, 0),
      });
    }
    
    if (options.title) {
      page.drawText(options.title, {
        x: options.x,
        y: options.y - (fontSize * 2) - 10,
        size: fontSize * 0.6,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }
  }
  
  private static async addDateStamp(
    page: PDFPage,
    options: SignatureOptions
  ) {
    const font = await page.doc.embedFont(StandardFonts.Helvetica);
    const date = new Date();
    const dateFormat = options.dateFormat || 'MM/DD/YYYY';
    
    const formattedDate = dateFormat
      .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
      .replace('DD', String(date.getDate()).padStart(2, '0'))
      .replace('YYYY', String(date.getFullYear()))
      .replace('YY', String(date.getFullYear()).slice(-2));
    
    page.drawText(`Date: ${formattedDate}`, {
      x: options.x,
      y: options.y - options.height - 10,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }
  
  // Add stamps to multiple pages
  static async addStamp(
    file: File,
    options: StampOptions
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    const stampText = this.getStampText(options);
    const color = options.color || { r: 1, g: 0, b: 0 };
    
    for (const pageNum of options.pageNumbers) {
      if (pageNum < 1 || pageNum > pages.length) continue;
      
      const page = pages[pageNum - 1];
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 24;
      const textWidth = font.widthOfTextAtSize(stampText, fontSize);
      
      let x: number, y: number;
      
      switch (options.position) {
        case 'top-left':
          x = 50;
          y = height - 50;
          break;
        case 'top-right':
          x = width - textWidth - 50;
          y = height - 50;
          break;
        case 'bottom-left':
          x = 50;
          y = 50;
          break;
        case 'bottom-right':
          x = width - textWidth - 50;
          y = 50;
          break;
        case 'center':
          x = (width - textWidth) / 2;
          y = height / 2;
          break;
        default:
          x = width - textWidth - 50;
          y = height - 50;
      }
      
      // Draw border
      const padding = 10;
      page.drawRectangle({
        x: x - padding,
        y: y - padding,
        width: textWidth + padding * 2,
        height: fontSize + padding * 2,
        borderColor: rgb(color.r, color.g, color.b),
        borderWidth: 2,
      });
      
      // Draw text
      page.drawText(stampText, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
      });
      
      // Add date if requested
      if (options.includeDate) {
        const date = new Date().toLocaleDateString();
        const dateFontSize = 10;
        const dateWidth = font.widthOfTextAtSize(date, dateFontSize);
        
        page.drawText(date, {
          x: x + (textWidth - dateWidth) / 2,
          y: y - 20,
          size: dateFontSize,
          font,
          color: rgb(color.r, color.g, color.b),
        });
      }
    }
    
    return await pdfDoc.save();
  }
  
  private static getStampText(options: StampOptions): string {
    switch (options.type) {
      case 'approved':
        return 'APPROVED';
      case 'rejected':
        return 'REJECTED';
      case 'reviewed':
        return 'REVIEWED';
      case 'confidential':
        return 'CONFIDENTIAL';
      case 'draft':
        return 'DRAFT';
      case 'final':
        return 'FINAL';
      case 'custom':
        return options.customText || 'STAMP';
      default:
        return 'STAMP';
    }
  }
}