// License management for PDF Tools Premium
const LICENSE_KEY = 'pdf_tools_premium_license'

export interface License {
  token: string
  purchasedAt: string
  isActive: boolean
  productType: 'pdf_tools_premium'
  email?: string
  sessionId?: string
}

export class LicenseManager {
  // Check if user has valid premium license
  static hasValidLicense(): boolean {
    try {
      const license = this.getLicense()
      if (!license) return false

      // Verify license is active and valid
      return license.isActive && license.productType === 'pdf_tools_premium'
    } catch {
      return false
    }
  }

  // Get stored license
  static getLicense(): License | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(LICENSE_KEY)
      if (!stored) return null

      return JSON.parse(stored) as License
    } catch {
      return null
    }
  }

  // Save license after successful payment
  static saveLicense(license: License): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(LICENSE_KEY, JSON.stringify(license))
      // Trigger storage event for other tabs
      window.dispatchEvent(new Event('license-updated'))
    } catch (error) {
      console.error('Failed to save license:', error)
    }
  }

  // Clear license (for testing or reset)
  static clearLicense(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(LICENSE_KEY)
      window.dispatchEvent(new Event('license-updated'))
    } catch (error) {
      console.error('Failed to clear license:', error)
    }
  }

  // Validate license token (optional server-side verification)
  static async validateLicense(token: string): Promise<boolean> {
    try {
      // In production, you'd verify against your database
      // For now, just check if token exists and is valid format
      return token.length === 64 && /^[a-f0-9]+$/.test(token)
    } catch {
      return false
    }
  }

  // Get license status for display
  static getLicenseStatus(): {
    isPremium: boolean
    purchasedAt?: string
    email?: string
  } {
    const license = this.getLicense()

    if (!license || !license.isActive) {
      return { isPremium: false }
    }

    return {
      isPremium: true,
      purchasedAt: license.purchasedAt,
      email: license.email,
    }
  }
}
