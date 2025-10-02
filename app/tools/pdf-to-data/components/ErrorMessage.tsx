'use client'

interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null
  
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 
                  bg-red-500/90 text-white rounded-lg text-sm 
                  animate-fadeIn shadow-lg z-10">
      {message}
    </div>
  )
}