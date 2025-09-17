// lib/PerformanceMonitor.tsx
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart,
  Cpu,
  HardDrive,
  Wifi,
  X
} from 'lucide-react'

// Performance Metrics Types
interface PerformanceMetrics {
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
  memoryUsage?: number
  connectionSpeed?: string
}

interface PerformanceEvent {
  name: string
  startTime: number
  duration: number
  type: 'interaction' | 'api' | 'render' | 'navigation'
}

// Performance Monitor Class
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private events: PerformanceEvent[] = []
  private observers: Map<string, PerformanceObserver> = new Map()
  private analyticsEnabled: boolean = true

  private constructor() {
    this.initializeObservers()
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Initialize Performance Observers
  private initializeObservers() {
    if (typeof window === 'undefined') return

    // Observe Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.trackMetric('LCP', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.set('lcp', lcpObserver)
    } catch (e) {
      console.log('LCP observer not supported')
    }

    // Observe First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.trackMetric('FID', entry.processingStart - entry.startTime)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.set('fid', fidObserver)
    } catch (e) {
      console.log('FID observer not supported')
    }

    // Observe Cumulative Layout Shift
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.trackMetric('CLS', clsValue)
          }
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.set('cls', clsObserver)
    } catch (e) {
      console.log('CLS observer not supported')
    }
  }

  // Track Custom Events
  trackEvent(name: string, type: PerformanceEvent['type'] = 'interaction'): () => void {
    const startTime = performance.now()
    
    return () => {
      const duration = performance.now() - startTime
      const event: PerformanceEvent = {
        name,
        startTime,
        duration,
        type
      }
      
      this.events.push(event)
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`)
      }
      
      // Send to analytics if enabled
      if (this.analyticsEnabled) {
        this.sendToAnalytics('event', event)
      }
    }
  }

  // Track API Calls
  trackAPICall(endpoint: string): () => void {
    return this.trackEvent(`API: ${endpoint}`, 'api')
  }

  // Track Component Render
  trackRender(componentName: string): () => void {
    return this.trackEvent(`Render: ${componentName}`, 'render')
  }

  // Track Page Navigation
  trackNavigation(from: string, to: string): void {
    const endTrack = this.trackEvent(`Navigate: ${from} → ${to}`, 'navigation')
    // Auto-end after navigation completes
    setTimeout(endTrack, 0)
  }

  // Track Metric
  private trackMetric(name: string, value: number) {
    if (this.analyticsEnabled) {
      this.sendToAnalytics('metric', { name, value })
    }
  }

  // Get Current Metrics
  getMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as any
    const paint = performance.getEntriesByType('paint')
    
    const metrics: PerformanceMetrics = {
      loadTime: navigation?.loadEventEnd - navigation?.fetchStart || 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.fetchStart || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: 0, // Will be updated by observer
      firstInputDelay: 0, // Will be updated by observer
      cumulativeLayoutShift: 0, // Will be updated by observer
      timeToInteractive: navigation?.domInteractive - navigation?.fetchStart || 0
    }

    // Memory usage (if available)
    if ('memory' in performance) {
      metrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576 // Convert to MB
    }

    // Connection speed
    if ('connection' in navigator) {
      metrics.connectionSpeed = (navigator as any).connection.effectiveType
    }

    return metrics
  }

  // Get Performance Score
  getPerformanceScore(): number {
    const metrics = this.getMetrics()
    let score = 100

    // Penalize based on metrics
    if (metrics.loadTime > 3000) score -= 20
    else if (metrics.loadTime > 2000) score -= 10
    else if (metrics.loadTime > 1000) score -= 5

    if (metrics.firstContentfulPaint > 2000) score -= 15
    else if (metrics.firstContentfulPaint > 1000) score -= 7

    if (metrics.largestContentfulPaint > 2500) score -= 15
    else if (metrics.largestContentfulPaint > 1500) score -= 7

    if (metrics.firstInputDelay > 100) score -= 10
    else if (metrics.firstInputDelay > 50) score -= 5

    if (metrics.cumulativeLayoutShift > 0.1) score -= 10
    else if (metrics.cumulativeLayoutShift > 0.05) score -= 5

    return Math.max(0, score)
  }

  // Send to Analytics Service
  private sendToAnalytics(type: string, data: any) {
    // In production, send to real analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Google Analytics, Mixpanel, etc.
      console.log('Analytics:', type, data)
    }
  }

  // Clear Events
  clearEvents() {
    this.events = []
  }

  // Get Events
  getEvents(): PerformanceEvent[] {
    return this.events
  }

  // Cleanup
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    this.events = []
  }
}

// React Hook for Performance Monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [score, setScore] = useState<number>(100)
  const monitor = useRef<PerformanceMonitor>()

  useEffect(() => {
    monitor.current = PerformanceMonitor.getInstance()
    
    // Initial metrics after page load
    const updateMetrics = () => {
      setMetrics(monitor.current!.getMetrics())
      setScore(monitor.current!.getPerformanceScore())
    }

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      updateMetrics()
    } else {
      window.addEventListener('load', updateMetrics)
      return () => window.removeEventListener('load', updateMetrics)
    }
  }, [])

  const trackEvent = useCallback((name: string, type?: PerformanceEvent['type']) => {
    return monitor.current?.trackEvent(name, type)
  }, [])

  const trackAPICall = useCallback((endpoint: string) => {
    return monitor.current?.trackAPICall(endpoint)
  }, [])

  const trackRender = useCallback((componentName: string) => {
    return monitor.current?.trackRender(componentName)
  }, [])

  return {
    metrics,
    score,
    trackEvent,
    trackAPICall,
    trackRender
  }
}

// Performance Dashboard Component
export function PerformanceDashboard({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const { metrics, score } = usePerformanceMonitor()
  const [showDetails, setShowDetails] = useState(false)

  if (!isOpen) return null

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-slate-900 rounded-xl border border-white/10 shadow-2xl z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="text-purple-400" size={20} />
          <h3 className="font-semibold text-white">Performance Monitor</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-all"
        >
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Score Display */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Performance Score</div>
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}/100
            </div>
          </div>
          <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {getScoreGrade(score)}
          </div>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="p-4 space-y-3">
          {/* Core Web Vitals */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase">Core Web Vitals</h4>
            
            <MetricRow
              icon={<Zap size={14} />}
              label="First Contentful Paint"
              value={`${metrics.firstContentfulPaint.toFixed(0)}ms`}
              status={metrics.firstContentfulPaint < 1000 ? 'good' : metrics.firstContentfulPaint < 2000 ? 'warning' : 'error'}
            />
            
            <MetricRow
              icon={<Clock size={14} />}
              label="Time to Interactive"
              value={`${metrics.timeToInteractive.toFixed(0)}ms`}
              status={metrics.timeToInteractive < 2000 ? 'good' : metrics.timeToInteractive < 3000 ? 'warning' : 'error'}
            />
            
            {metrics.largestContentfulPaint > 0 && (
              <MetricRow
                icon={<BarChart size={14} />}
                label="Largest Contentful Paint"
                value={`${metrics.largestContentfulPaint.toFixed(0)}ms`}
                status={metrics.largestContentfulPaint < 1500 ? 'good' : metrics.largestContentfulPaint < 2500 ? 'warning' : 'error'}
              />
            )}
          </div>

          {/* System Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase">System Info</h4>
            
            {metrics.memoryUsage && (
              <MetricRow
                icon={<HardDrive size={14} />}
                label="Memory Usage"
                value={`${metrics.memoryUsage.toFixed(1)} MB`}
                status={metrics.memoryUsage < 50 ? 'good' : metrics.memoryUsage < 100 ? 'warning' : 'error'}
              />
            )}
            
            {metrics.connectionSpeed && (
              <MetricRow
                icon={<Wifi size={14} />}
                label="Connection"
                value={metrics.connectionSpeed}
                status="info"
              />
            )}
          </div>

          {/* Recommendations */}
          {score < 90 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-yellow-400 mt-0.5" size={14} />
                <div className="text-xs text-yellow-400">
                  <strong>Optimization Tips:</strong>
                  <ul className="mt-1 ml-3 list-disc">
                    {metrics.firstContentfulPaint > 1000 && <li>Optimize initial render</li>}
                    {metrics.timeToInteractive > 2000 && <li>Reduce JavaScript bundle size</li>}
                    {metrics.memoryUsage && metrics.memoryUsage > 100 && <li>Check for memory leaks</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Metric Row Component
function MetricRow({ 
  icon, 
  label, 
  value, 
  status 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  status: 'good' | 'warning' | 'error' | 'info'
}) {
  const statusColors = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    info: 'text-blue-400'
  }

  const statusIcons = {
    good: <CheckCircle size={14} className="text-green-400" />,
    warning: <AlertTriangle size={14} className="text-yellow-400" />,
    error: <AlertTriangle size={14} className="text-red-400" />,
    info: null
  }

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2 text-gray-300">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${statusColors[status]}`}>
          {value}
        </span>
        {statusIcons[status]}
      </div>
    </div>
  )
}