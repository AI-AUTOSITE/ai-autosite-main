// components/ErrorBoundary.tsx
'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Copy,
  Check,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorCount: number
  showDetails: boolean
  copiedError: boolean
  attemptedRecovery: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      showDetails: false,
      copiedError: false,
      attemptedRecovery: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to analytics/monitoring service
    this.logErrorToService(error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
    
    // Update state with error details
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }))
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      console.error('Error logged to monitoring service:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      })
    } else {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copiedError: false,
      attemptedRecovery: false
    })
  }

  handleRecovery = () => {
    // Try to recover by clearing state and localStorage
    try {
      localStorage.clear()
      sessionStorage.clear()
      this.setState({ attemptedRecovery: true })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      console.error('Recovery failed:', err)
    }
  }

  copyErrorToClipboard = async () => {
    if (!this.state.error) return
    
    const errorReport = `
Error Report
============
Time: ${new Date().toISOString()}
Message: ${this.state.error.message}
Stack: ${this.state.error.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
User Agent: ${navigator.userAgent}
    `.trim()
    
    try {
      await navigator.clipboard.writeText(errorReport)
      this.setState({ copiedError: true })
      setTimeout(() => this.setState({ copiedError: false }), 2000)
    } catch (err) {
      console.error('Failed to copy error:', err)
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-red-500/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 p-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="text-red-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-2">
                      Oops! Something went wrong
                    </h1>
                    <p className="text-gray-300">
                      Don't worry, your work is safe. This is a temporary issue.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Info */}
              <div className="p-6 space-y-4">
                {/* Simple Error Message */}
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <Bug size={16} />
                    <span className="text-sm font-medium">Error Message</span>
                  </div>
                  <p className="text-white font-mono text-sm">
                    {this.state.error?.message || 'An unexpected error occurred'}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={this.handleReset}
                    className="px-4 py-3 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2 border border-purple-500/30"
                  >
                    <RefreshCw size={18} />
                    Try Again
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2 border border-blue-500/30"
                  >
                    <Home size={18} />
                    Go Home
                  </button>
                </div>

                {/* Advanced Recovery (if multiple errors) */}
                {this.state.errorCount > 2 && !this.state.attemptedRecovery && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-orange-400 mt-0.5" size={16} />
                      <div className="flex-1">
                        <p className="text-sm text-orange-400 mb-2">
                          Multiple errors detected. Try clearing cache?
                        </p>
                        <button
                          onClick={this.handleRecovery}
                          className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded text-sm hover:bg-orange-500/30 transition-all"
                        >
                          Clear Cache & Reload
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attempted Recovery Message */}
                {this.state.attemptedRecovery && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400">
                      <Check size={16} />
                      <span className="text-sm">Clearing cache... Page will reload shortly.</span>
                    </div>
                  </div>
                )}

                {/* Technical Details (Collapsible) */}
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                    className="w-full px-4 py-3 bg-black/20 hover:bg-black/30 transition-all flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-400">Technical Details</span>
                    {this.state.showDetails ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </button>
                  
                  {this.state.showDetails && (
                    <div className="p-4 bg-black/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Stack Trace</span>
                        <button
                          onClick={this.copyErrorToClipboard}
                          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          {this.state.copiedError ? (
                            <>
                              <Check size={12} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              Copy Error
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-xs text-gray-400 overflow-auto max-h-40 font-mono">
                        {this.state.error?.stack}
                      </pre>
                      {this.state.errorInfo?.componentStack && (
                        <>
                          <div className="text-xs text-gray-400 mt-4 mb-2">Component Stack</div>
                          <pre className="text-xs text-gray-400 overflow-auto max-h-40 font-mono">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Help Section */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="text-blue-400 mt-0.5" size={16} />
                    <div className="text-sm text-blue-300">
                      <strong>Need help?</strong>
                      <ul className="mt-2 space-y-1 ml-4 list-disc">
                        <li>Try refreshing the page</li>
                        <li>Check your internet connection</li>
                        <li>Clear browser cache (Ctrl+Shift+Delete)</li>
                        <li>Try a different browser</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support (Optional) */}
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Still having issues?{' '}
                <a 
                  href="mailto:support@example.com" 
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Simplified hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error handled:', error, errorInfo)
    // Send to monitoring service
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
}