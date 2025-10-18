// app/hooks/useAIToolWarning.ts
'use client'

import { useState, useEffect } from 'react'

export function useAIToolWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isChecking, setIsChecking] = useState(true) // ✅ 追加

  useEffect(() => {
    // localStorageから同意状態を確認
    const agreed = localStorage.getItem('ai_tool_warning_agreed')
    if (agreed === 'true') {
      setHasAgreed(true)
    } else {
      // 未同意なら自動的にモーダル表示
      setShowWarning(true)
    }
    setIsChecking(false) // ✅ チェック完了
  }, [])

  const handleAgree = () => {
    localStorage.setItem('ai_tool_warning_agreed', 'true')
    setHasAgreed(true)
    setShowWarning(false)
  }

  const handleDisagree = () => {
    setShowWarning(false)
  }

  const resetAgreement = () => {
    localStorage.removeItem('ai_tool_warning_agreed')
    setHasAgreed(false)
    setShowWarning(true)
  }

  return {
    showWarning,
    hasAgreed,
    isChecking, // ✅ 追加
    handleAgree,
    handleDisagree,
    resetAgreement,
    setShowWarning,
  }
}