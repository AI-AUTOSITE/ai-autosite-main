import { PDFDocument } from 'pdf-lib';

export class CompressHandler {
  static async compress(
    file: File,
    quality: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Remove metadata
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');
    
    // Compression options based on quality
    const options = {
      low: { 
        useObjectStreams: false,
        addDefaultPage: false,
        objectsPerTick: 200
      },
      medium: {
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 100
      },
      high: {
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
        updateFieldAppearances: false
      }
    };
    
    return await pdfDoc.save(options[quality]);
  }
  
  static estimateCompression(originalSize: number, quality: string): number {
    const compressionRates = {
      low: 0.85,
      medium: 0.70,
      high: 0.55
    };
    return Math.floor(originalSize * compressionRates[quality as keyof typeof compressionRates]);
  }
}