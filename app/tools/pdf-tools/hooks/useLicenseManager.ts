// app/tools/pdf-tools/hooks/useLicenseManager.ts
import { useState, useEffect } from 'react'
import { LicenseManager } from '../lib/licenseManager'

export function useLicenseManager() {
  const [isPremium, setIsPremium] = useState(false)
  const [isLoadingPayment, setIsLoadingPayment] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    const checkLicense = () => {
      const hasLicense = LicenseManager.hasValidLicense()
      setIsPremium(hasLicense)

      if (hasLicense && window.location.search.includes('upgraded=true')) {
        setTimeout(() => {
          alert('🎉 Premium activated! You now have access to 6 tool slots.')
        }, 500)
      }
    }

    checkLicense()

    const handleLicenseUpdate = () => {
      checkLicense()
    }

    window.addEventListener('license-updated', handleLicenseUpdate)
    window.addEventListener('storage', handleLicenseUpdate)

    return () => {
      window.removeEventListener('license-updated', handleLicenseUpdate)
      window.removeEventListener('storage', handleLicenseUpdate)
    }
  }, [])

  const handleUpgradeToPremium = async () => {
    setIsLoadingPayment(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: '',
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to start payment process. Please try again.')
    } finally {
      setIsLoadingPayment(false)
    }
  }

  // This function is now just a placeholder - actual modal is handled in PDFStudioClient
  const showLicenseStatus = () => {
    // This will be overridden in PDFStudioClient
    console.log('License status should show modal')
  }

  return {
    isPremium,
    isLoadingPayment,
    showUpgradeModal,
    setShowUpgradeModal,
    handleUpgradeToPremium,
    showLicenseStatus,
  }
}
