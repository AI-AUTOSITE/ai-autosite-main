// app/error.tsx
'use client'
import SignalLogo from './components/icons/SignalLogo'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <SignalLogo size={80} />
      <h2 className="text-2xl font-bold">エラーが発生しました</h2>
      <button 
        onClick={reset}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        もう一度試す
      </button>
    </div>
  )
}