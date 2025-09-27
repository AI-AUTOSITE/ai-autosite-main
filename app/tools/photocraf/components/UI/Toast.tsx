'use client'

import React, { useState, useEffect } from 'react'

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

// Global toast state (in production, use Context or state management)
let toastListeners: ((messages: ToastMessage[]) => void)[] = []
let toastMessages: ToastMessage[] = []

export const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
  const newToast: ToastMessage = {
    id: `toast-${Date.now()}`,
    type,
    message,
  }
  
  toastMessages = [...toastMessages, newToast]
  toastListeners.forEach(listener => listener(toastMessages))
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    toastMessages = toastMessages.filter(t => t.id !== newToast.id)
    toastListeners.forEach(listener => listener(toastMessages))
  }, 5000)
}

export default function Toast() {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  useEffect(() => {
    const listener = (newMessages: ToastMessage[]) => {
      setMessages(newMessages)
    }
    
    toastListeners.push(listener)
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  const removeToast = (id: string) => {
    toastMessages = toastMessages.filter(t => t.id !== id)
    toastListeners.forEach(listener => listener(toastMessages))
  }

  const getToastStyles = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white'
      case 'error':
        return 'bg-red-600 text-white'
      case 'warning':
        return 'bg-yellow-600 text-white'
      case 'info':
      default:
        return 'bg-blue-600 text-white'
    }
  }

  const getToastIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
      default:
        return 'ℹ'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${getToastStyles(
            toast.type
          )} animate-slide-in`}
        >
          <span className="text-lg">{getToastIcon(toast.type)}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}