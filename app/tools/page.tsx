'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ToolsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page with developer category pre-selected
    router.push('/?category=developer')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to tools...</p>
      </div>
    </div>
  )
}