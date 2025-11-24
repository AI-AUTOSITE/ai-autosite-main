// ============================================
// QR Type Selector Component
// ============================================

import { FileText, Link2, Wifi, User } from 'lucide-react'
import { QRType } from '../lib/types'

interface QRTypeSelectorProps {
  qrType: QRType
  onTypeChange: (type: QRType) => void
}

const QR_TYPES: { type: QRType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Text', icon: <FileText className="w-4 h-4" /> },
  { type: 'url', label: 'URL', icon: <Link2 className="w-4 h-4" /> },
  { type: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
  { type: 'vcard', label: 'Contact', icon: <User className="w-4 h-4" /> },
]

export function QRTypeSelector({ qrType, onTypeChange }: QRTypeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {QR_TYPES.map((item) => (
        <button
          key={item.type}
          onClick={() => onTypeChange(item.type)}
          className={`py-2.5 sm:py-3 px-2 rounded-lg transition-all flex flex-col items-center gap-1 sm:gap-1.5 ${
            qrType === item.type
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          {item.icon}
          <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
