// app/tools/network-checker/components/DeviceInput.tsx
'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { Device } from '../lib/types'

interface DeviceInputProps {
  devices: Device[]
  onUpdateDevice: (id: string, field: keyof Device, value: string | 'wired' | 'wifi') => void
  onAddDevice: () => void
  onRemoveDevice: (id: string) => void
}

export default function DeviceInput({
  devices,
  onUpdateDevice,
  onAddDevice,
  onRemoveDevice
}: DeviceInputProps) {
  return (
    <div className="space-y-4">
      {devices.map((device, index) => (
        <div 
          key={device.id}
          className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium text-sm">Device {index + 1}</span>
            {devices.length > 2 && (
              <button
                onClick={() => onRemoveDevice(device.id)}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-all group"
                aria-label="Remove device"
              >
                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Device name */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Name</label>
              <input
                type="text"
                value={device.name}
                onChange={(e) => onUpdateDevice(device.id, 'name', e.target.value)}
                placeholder="Scanner, PC, etc."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white 
                         placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
              />
            </div>

            {/* IP address */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">IP Address</label>
              <input
                type="text"
                value={device.ip}
                onChange={(e) => onUpdateDevice(device.id, 'ip', e.target.value)}
                placeholder="192.168.1.100"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white 
                         placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm font-mono"
              />
            </div>
          </div>

          {/* Connection type */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onUpdateDevice(device.id, 'connection', 'wired')}
              className={`flex-1 py-2 rounded-lg transition-all text-sm font-medium ${
                device.connection === 'wired'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              🔌 Wired
            </button>
            <button
              onClick={() => onUpdateDevice(device.id, 'connection', 'wifi')}
              className={`flex-1 py-2 rounded-lg transition-all text-sm font-medium ${
                device.connection === 'wifi'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              📡 WiFi
            </button>
          </div>
        </div>
      ))}

      {/* Add device button */}
      {devices.length < 5 && (
        <button
          onClick={onAddDevice}
          className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl 
                   hover:border-cyan-400 hover:bg-cyan-400/5 transition-all text-gray-400 hover:text-cyan-400
                   flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Add Device</span>
        </button>
      )}
    </div>
  )
}