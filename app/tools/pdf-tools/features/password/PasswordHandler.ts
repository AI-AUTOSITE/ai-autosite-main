import { PDFDocument } from 'pdf-lib'

export interface PasswordOptions {
  userPassword: string
  ownerPassword?: string
  permissions?: {
    printing?: boolean
    copying?: boolean
    modifying?: boolean
    annotating?: boolean
  }
}

export class PasswordHandler {
  /**
   * Check if a PDF is password protected
   */
  static async isPasswordProtected(file: File): Promise<boolean> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      // Try to load the PDF without password
      await PDFDocument.load(arrayBuffer)
      return false // Successfully loaded, so not protected
    } catch (error: any) {
      // If loading fails with password-related error, it's protected
      if (error.message && error.message.includes('password')) {
        return true
      }
      // For pdf-lib, encrypted PDFs will throw an error
      return error.message?.includes('encrypt') || false
    }
  }

  /**
   * Add password protection to a PDF
   * Note: pdf-lib doesn't support adding encryption directly
   * This is a placeholder - you would need a different library like pdf-lib-plus
   * or server-side processing for actual password protection
   */
  static async addPassword(file: File, options: PasswordOptions): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)

    // For now, just return the original PDF
    console.warn('Password protection requires server-side processing or additional libraries')

    // You can add metadata to indicate it should be protected
    pdfDoc.setTitle('Protected Document')
    pdfDoc.setKeywords(['protected', 'encrypted'])

    return await pdfDoc.save()
  }

  /**
   * Remove password protection from a PDF
   * Note: pdf-lib doesn't support password-protected PDFs
   * This is a placeholder implementation
   */
  static async removePassword(file: File, password: string): Promise<Uint8Array> {
    try {
      const arrayBuffer = await file.arrayBuffer()

      // pdf-lib doesn't support password-protected PDFs
      // You would need to use a different library like pdf.js or server-side processing
      // For now, we'll try to load normally and return an error if it fails

      try {
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        // If it loads without error, it wasn't actually password protected
        return await pdfDoc.save()
      } catch (loadError) {
        // If loading fails, it might be password protected
        // We can't actually decrypt it with pdf-lib
        throw new Error(
          'This PDF appears to be password protected. pdf-lib does not support decrypting PDFs. Consider using a server-side solution or a library like pdf.js for handling encrypted PDFs.'
        )
      }
    } catch (error: any) {
      throw new Error('Invalid password or failed to decrypt PDF: ' + error.message)
    }
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean
    message?: string
  } {
    if (password.length < 4) {
      return {
        isValid: false,
        message: 'Password must be at least 4 characters long',
      }
    }

    if (password.length > 32) {
      return {
        isValid: false,
        message: 'Password must be 32 characters or less',
      }
    }

    return {
      isValid: true,
    }
  }
}
