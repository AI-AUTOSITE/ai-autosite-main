// app/tools/network-checker/components/NetworkDiagram.tsx
'use client'

import { Wifi, Cable } from 'lucide-react'
import type { Device } from '../lib/types'
import { getNetworkSegment, groupByNetwork } from '../lib/network-utils'

interface NetworkDiagramProps {
  devices: Device[]
  showConnections?: boolean
}

export default function NetworkDiagram({ devices, showConnections = true }: NetworkDiagramProps) {
  const groups = groupByNetwork(devices)
  const networks = Array.from(groups.entries())

  const colors = [
    'from-cyan-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
  ]

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h3 className="text-white font-medium mb-4 flex items-center gap-2">
        <Wifi className="w-5 h-5 text-cyan-400" />
        Network Map
      </h3>

      <div className="space-y-4">
        {networks.map(([segment, devicesInNetwork], networkIndex) => (
          <div key={segment} className="space-y-3">
            {/* Network label */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${colors[networkIndex % colors.length]} bg-opacity-20`}>
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span className="text-white text-sm font-mono font-medium">
                Network: {segment}.x
              </span>
            </div>

            {/* Devices in this network */}
            <div className="pl-6 space-y-2">
              {devicesInNetwork.map((device) => (
                <div 
                  key={device.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  {device.connection === 'wired' ? (
                    <Cable className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <Wifi className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{device.name}</p>
                    <p className="text-gray-400 text-xs font-mono">{device.ip}</p>
                  </div>

                  <span className={`text-xs px-2 py-1 rounded ${
                    device.connection === 'wired' 
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {device.connection}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Connection status */}
      {showConnections && networks.length > 1 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-yellow-400 flex items-center gap-2">
            <span>⚠️</span>
            <span>Devices on different networks cannot connect directly</span>
          </p>
        </div>
      )}

      {showConnections && networks.length === 1 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-green-400 flex items-center gap-2">
            <span>✓</span>
            <span>All devices on same network - can connect</span>
          </p>
        </div>
      )}
    </div>
  )
}