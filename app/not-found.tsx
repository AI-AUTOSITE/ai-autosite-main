// app/not-found.tsx
import Link from 'next/link'
import SignalLogo from './components/icons/SignalLogo'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <SignalLogo size={80} />
      <h2 className="text-3xl font-bold">404 - Page Not Found</h2>
      <p className="text-slate-600">
The page you are looking for could not be found</p>
      <Link 
        href="/"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        HOME
      </Link>
    </div>
  )
}