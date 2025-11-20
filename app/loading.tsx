// app/loading.tsx
import SignalLogo from './components/icons/SignalLogo'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignalLogo size={80} animated={true} />
      <p className="mt-4 text-slate-600">Loading...</p>
    </div>
  )
}