// app/tools/network-checker/components/NetworkCheckerClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { Wifi, Smartphone, HelpCircle } from 'lucide-react'
import UnifiedToolLayout from '../../../components/common/UnifiedToolLayout'
import DeviceInput from './DeviceInput'
import NetworkDiagram from './NetworkDiagram'
import RuleBotChat from './RuleBotChat'
import ClaudeAIChat from './ClaudeAIChat'
import type { Device, DiagnosticResult } from '../lib/types'
import { diagnoseDevices } from '../lib/diagnostic-rules'

// Vibration helper
const vibrate = (duration: number) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

export default function NetworkCheckerClient() {
  const [isMobile, setIsMobile] = useState(false)
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Scanner', ip: '', connection: 'wired' },
    { id: '2', name: 'My Computer', ip: '', connection: 'wifi' },
  ])
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [showAI, setShowAI] = useState(false)

  // Device detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const smallScreen = window.innerWidth < 768
      setIsMobile(mobile || smallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Update device
  const updateDevice = (id: string, field: keyof Device, value: string | 'wired' | 'wifi') => {
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ))
  }

  // Add device
  const addDevice = () => {
    const newDevice: Device = {
      id: Date.now().toString(),
      name: `Device ${devices.length + 1}`,
      ip: '',
      connection: 'wired',
    }
    setDevices(prev => [...prev, newDevice])
    vibrate(30)
  }

  // Remove device
  const removeDevice = (id: string) => {
    if (devices.length <= 2) return
    setDevices(prev => prev.filter(d => d.id !== id))
    vibrate(30)
  }

  // Check connection
  const handleCheck = () => {
    const diagnosis = diagnoseDevices(devices)
    setResult(diagnosis)
    vibrate(30)

    // Show AI option if problem detected
    if (diagnosis.severity === 'warning' || diagnosis.severity === 'error') {
      setTimeout(() => setShowAI(true), 2000)
    }
  }

  // Clear all
  const handleClear = () => {
    setDevices([
      { id: '1', name: 'Scanner', ip: '', connection: 'wired' },
      { id: '2', name: 'My Computer', ip: '', connection: 'wifi' },
    ])
    setResult(null)
    setShowAI(false)
    vibrate(30)
  }

  // Load example
  const loadExample = () => {
    setDevices([
      { id: '1', name: 'Scanner', ip: '192.168.1.101', connection: 'wired' },
      { id: '2', name: 'My Computer', ip: '192.168.11.27', connection: 'wifi' },
    ])
    setResult(null)
    setShowAI(false)
    vibrate(30)
  }

  const canCheck = devices.length >= 2 && devices.every(d => d.ip.trim())

  return (
    <UnifiedToolLayout 
      toolId="network-checker"
      showToolInfo={true}
      containerWidth="xl"
    >
      {/* Mobile indicator */}
      {isMobile && (
        <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-cyan-300 font-medium text-sm">Mobile Ready</p>
            <p className="text-cyan-400/70 text-xs mt-1 leading-relaxed">
              Works offline • No data sent • Instant results
            </p>
          </div>
        </div>
      )}

      {/* Help button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-sm text-gray-400 hover:text-white"
        >
          <HelpCircle className="w-4 h-4" />
          <span>How to use</span>
        </button>
      </div>

      {/* Quick guide */}
      {showGuide && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg animate-fadeIn">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            Quick Guide
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong className="text-white">Step 1:</strong> Enter device names</p>
            <p><strong className="text-white">Step 2:</strong> Type IP addresses (find in Settings → Network)</p>
            <p><strong className="text-white">Step 3:</strong> Click "Check Connection"</p>
            <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-white/10">
              💡 Don't know your IP? Try the example first
            </p>
          </div>
        </div>
      )}

      {/* Devices */}
      <div className="mb-6">
        <DeviceInput
          devices={devices}
          onUpdateDevice={updateDevice}
          onAddDevice={addDevice}
          onRemoveDevice={removeDevice}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleCheck}
          disabled={!canCheck}
          className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl 
                   font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30"
        >
          <Wifi className="w-5 h-5" />
          <span>Check Connection</span>
        </button>
        
        <button
          onClick={loadExample}
          className="sm:w-auto px-6 py-4 bg-white/5 text-gray-300 rounded-xl font-medium
                   hover:bg-white/10 transition-all"
        >
          Try Example
        </button>
        
        {(devices.some(d => d.ip) || result) && (
          <button
            onClick={handleClear}
            className="sm:w-auto px-6 py-4 bg-white/5 text-gray-300 rounded-xl font-medium
                     hover:bg-white/10 transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Results */}
      {result && result.type && (
        <div className="space-y-6">
          {/* Diagnosis */}
          <RuleBotChat result={result} />

          {/* Network diagram */}
          {(result.type === 'same-network' || result.type === 'different-network') && (
            <NetworkDiagram devices={devices} showConnections={true} />
          )}

          {/* AI Chat (conditional) */}
          {showAI && (result.severity === 'warning' || result.severity === 'error') && (
            <ClaudeAIChat devices={devices} />
          )}
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-white/5 rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-medium mb-3 text-sm flex items-center gap-2">
          💡 Tips
        </h3>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-cyan-400">•</span>
            <span>Find IP: Settings → Network → IP Address</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-400">•</span>
            <span>Same network = First 3 numbers match (192.168.1.x)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-400">•</span>
            <span>Wired is more stable than WiFi</span>
          </div>
          {isMobile && (
            <div className="flex items-start gap-2 pt-2 border-t border-white/10">
              <span className="text-blue-400">📱</span>
              <span className="text-blue-400">Works 100% offline on your device</span>
            </div>
          )}
        </div>
      </div>
    </UnifiedToolLayout>
  )
}