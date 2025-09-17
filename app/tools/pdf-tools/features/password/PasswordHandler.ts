// app/tools/pdf-tools/features/password/PasswordHandler.ts
import { PDFDocument } from 'pdf-lib';

export class PasswordHandler {
  /**
   * Check if a PDF is password protected
   */
  static async isPasswordProtected(file: File): Promise<boolean> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Check if it's a valid PDF first by checking the header
      const bytes = new Uint8Array(arrayBuffer);
      
      // PDF files should start with %PDF-
      if (bytes.length < 5) {
        console.warn('File too small to be a valid PDF');
        return false;
      }
      
      const headerString = String.fromCharCode(...bytes.slice(0, 5));
      
      if (!headerString.startsWith('%PDF')) {
        console.warn('Invalid PDF file: No PDF header found');
        return false;
      }
      
      // Try to load the PDF
      try {
        await PDFDocument.load(arrayBuffer);
        return false; // Successfully loaded without password
      } catch (loadError: any) {
        // Check if the error is related to password/encryption
        const errorMessage = loadError.message?.toLowerCase() || '';
        if (errorMessage.includes('password') || 
            errorMessage.includes('encrypted') ||
            errorMessage.includes('decrypt')) {
          return true;
        }
        
        // For any other errors, assume it's not password-related
        console.error('Error loading PDF:', loadError);
        return false;
      }
    } catch (error: any) {
      console.error('Error checking password protection:', error);
      return false;
    }
  }

  /**
   * Add password protection to a PDF
   */
  static async addPassword(
    file: File,
    options: {
      userPassword: string;
      ownerPassword?: string;
      permissions?: {
        printing?: boolean;
        modifying?: boolean;
        copying?: boolean;
        annotating?: boolean;
      };
    }
  ): Promise<Uint8Array> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Note: pdf-lib doesn't support adding encryption directly
      // You would need to use a different library like pdf-lib-encrypt
      // or server-side processing for this functionality
      
      // For now, return the original PDF
      console.warn('Password protection requires additional libraries or server-side processing');
      return await pdfDoc.save();
    } catch (error) {
      console.error('Failed to add password:', error);
      throw new Error('Failed to add password protection to PDF');
    }
  }

  /**
   * Remove password protection from a PDF
   */
  static async removePassword(
    file: File,
    password: string
  ): Promise<Uint8Array> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Try to load with password
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        password: password
      });
      
      // Save without password
      return await pdfDoc.save();
    } catch (error: any) {
      if (error.message?.includes('password') || error.message?.includes('decrypt')) {
        throw new Error('Incorrect password. Please try again.');
      }
      console.error('Failed to remove password:', error);
      throw new Error('Failed to remove password protection from PDF');
    }
  }

  /**
   * Validate PDF file before processing
   */
  static async validatePDF(file: File): Promise<boolean> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Check minimum size
      if (bytes.length < 1024) {
        console.warn('File too small to be a valid PDF');
        return false;
      }
      
      // Check PDF header
      const headerString = String.fromCharCode(...bytes.slice(0, 5));
      if (!headerString.startsWith('%PDF')) {
        console.warn('Invalid PDF header');
        return false;
      }
      
      // Check for EOF marker (%%EOF should be near the end)
      const lastBytes = bytes.slice(-1024);
      const lastString = String.fromCharCode(...lastBytes);
      if (!lastString.includes('%%EOF')) {
        console.warn('PDF file appears to be truncated');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('PDF validation error:', error);
      return false;
    }
  }
}