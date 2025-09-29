// app/tools/pdf-tools/features/watermark/WatermarkHandler.ts
import { PDFDocument, rgb, degrees, StandardFonts, PDFPage } from 'pdf-lib';

export interface WatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  imageData?: Uint8Array;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'diagonal';
  opacity: number; // 0-1
  fontSize?: number;
  rotation?: number;
  color?: { r: number; g: number; b: number };
  scale?: number; // For images
}

export class WatermarkHandler {
  static async addWatermark(
    file: File,
    options: WatermarkOptions
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    if (options.type === 'text' && options.text) {
      await this.addTextWatermark(pages, options);
    } else if (options.type === 'image' && options.imageData) {
      await this.addImageWatermark(pdfDoc, pages, options);
    }
    
    return await pdfDoc.save();
  }
  
  private static async addTextWatermark(
    pages: PDFPage[],
    options: WatermarkOptions
  ) {
    const text = options.text || 'WATERMARK';
    const fontSize = options.fontSize || 50;
    const opacity = options.opacity || 0.3;
    const rotation = options.rotation || (options.position === 'diagonal' ? 45 : 0);
    const color = options.color || { r: 0.5, g: 0.5, b: 0.5 };
    
    for (const page of pages) {
      const { width, height } = page.getSize();
      const font = await page.doc.embedFont(StandardFonts.Helvetica);
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);
      
      let x: number, y: number;
      
      switch (options.position) {
        case 'center':
        case 'diagonal':
          x = (width - textWidth) / 2;
          y = (height - textHeight) / 2;
          break;
        case 'top-left':
          x = 50;
          y = height - 50 - textHeight;
          break;
        case 'top-right':
          x = width - textWidth - 50;
          y = height - 50 - textHeight;
          break;
        case 'bottom-left':
          x = 50;
          y = 50;
          break;
        case 'bottom-right':
          x = width - textWidth - 50;
          y = 50;
          break;
        default:
          x = (width - textWidth) / 2;
          y = (height - textHeight) / 2;
      }
      
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity,
        rotate: degrees(rotation),
      });
    }
  }
  
  private static async addImageWatermark(
    pdfDoc: PDFDocument,
    pages: PDFPage[],
    options: WatermarkOptions
  ) {
    if (!options.imageData) return;
    
    // Detect image type and embed
    let image;
    try {
      // Try PNG first
      image = await pdfDoc.embedPng(options.imageData);
    } catch {
      try {
        // Try JPEG
        image = await pdfDoc.embedJpg(options.imageData);
      } catch (error) {
        throw new Error('Unsupported image format. Please use PNG or JPEG.');
      }
    }
    
    const scale = options.scale || 0.2;
    const opacity = options.opacity || 0.3;
    const rotation = options.rotation || 0;
    
    for (const page of pages) {
      const { width, height } = page.getSize();
      const imgWidth = image.width * scale;
      const imgHeight = image.height * scale;
      
      let x: number, y: number;
      
      switch (options.position) {
        case 'center':
        case 'diagonal':
          x = (width - imgWidth) / 2;
          y = (height - imgHeight) / 2;
          break;
        case 'top-left':
          x = 50;
          y = height - imgHeight - 50;
          break;
        case 'top-right':
          x = width - imgWidth - 50;
          y = height - imgHeight - 50;
          break;
        case 'bottom-left':
          x = 50;
          y = 50;
          break;
        case 'bottom-right':
          x = width - imgWidth - 50;
          y = 50;
          break;
        default:
          x = (width - imgWidth) / 2;
          y = (height - imgHeight) / 2;
      }
      
      page.drawImage(image, {
        x,
        y,
        width: imgWidth,
        height: imgHeight,
        opacity,
        rotate: degrees(rotation),
      });
    }
  }
  
  // Batch processing for multiple files
  static async batchAddWatermark(
    files: File[],
    options: WatermarkOptions
  ): Promise<{ filename: string; data: Uint8Array }[]> {
    const results = [];
    
    for (const file of files) {
      const watermarkedPdf = await this.addWatermark(file, options);
      results.push({
        filename: `watermarked_${file.name}`,
        data: watermarkedPdf
      });
    }
    
    return results;
  }
}