// app/tools/ai-dev-dictionary/components/core/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  fullScreen?: boolean
  message?: string
}

export default function LoadingSpinner({ fullScreen = false, message }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
          {message && <p className="text-white mt-4">{message}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        {message && <p className="text-gray-400 mt-2 text-sm">{message}</p>}
      </div>
    </div>
  )
}