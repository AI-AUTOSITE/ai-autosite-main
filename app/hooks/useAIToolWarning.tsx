// app/hooks/useAIToolWarning.tsx
'use client'

import { useState, useEffect } from 'react'
export function useAIToolWarning() {
  const [showWarning, setShowWarning] = useState(true)
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    setIsChecking(false)
  }, [])

  const handleAgree = () => {
    setHasAgreed(true)
    setShowWarning(false)
  }

  const handleDisagree = () => {
    setShowWarning(false)
  }

  const resetAgreement = () => {
    setHasAgreed(false)
    setShowWarning(true)
  }

  return {
    showWarning,
    hasAgreed,
    isChecking,
    handleAgree,
    handleDisagree,
    resetAgreement,
    setShowWarning,
  }
}