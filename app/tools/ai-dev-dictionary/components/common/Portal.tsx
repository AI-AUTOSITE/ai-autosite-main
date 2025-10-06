// app/tools/ai-dev-dictionary/components/Portal.tsx

'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: React.ReactNode
  containerId?: string
}

export default function Portal({ children, containerId = 'portal-root' }: PortalProps) {
  const [mounted, setMounted] = useState(false)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Check if the container already exists
    let portalContainer = document.getElementById(containerId)

    // If not, create it
    if (!portalContainer) {
      portalContainer = document.createElement('div')
      portalContainer.id = containerId
      document.body.appendChild(portalContainer)
    }

    setContainer(portalContainer)
    setMounted(true)

    // Cleanup function (optional - keeps portal container for reuse)
    return () => {
      // You can choose to remove the container on unmount if needed
      // if (portalContainer && portalContainer.childNodes.length === 0) {
      //   document.body.removeChild(portalContainer)
      // }
    }
  }, [containerId])

  // Only render after mounting to avoid SSR issues
  if (!mounted || !container) {
    return null
  }

  return createPortal(children, container)
}
