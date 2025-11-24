// ============================================
// Features Component
// ============================================

import { Shield, RefreshCw, Image as ImageIcon, Download } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      bgColor: 'bg-emerald-500/20',
      title: 'No server, no tracking',
      description: '100% client-side. Data never leaves your device.',
    },
    {
      icon: <RefreshCw className="w-4 h-4 text-cyan-400" />,
      bgColor: 'bg-cyan-500/20',
      title: 'No expiration',
      description: 'Your QR codes work forever. No 14-day limits.',
    },
    {
      icon: <ImageIcon className="w-4 h-4 text-purple-400" />,
      bgColor: 'bg-purple-500/20',
      title: 'Logo embedding free',
      description: 'Add your logo at no cost. Others charge $60+.',
    },
    {
      icon: <Download className="w-4 h-4 text-blue-400" />,
      bgColor: 'bg-blue-500/20',
      title: 'SVG + PNG + JPEG',
      description: 'Vector & raster formats. Print at any size.',
    },
  ]

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
      <h3 className="text-white font-medium text-sm mb-3">What makes this different?</h3>
      <div className="space-y-2.5">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2.5">
            <div className={`w-7 h-7 rounded-lg ${feature.bgColor} flex items-center justify-center flex-shrink-0`}>
              {feature.icon}
            </div>
            <div>
              <p className="text-white text-xs font-medium">{feature.title}</p>
              <p className="text-gray-400 text-[10px]">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
