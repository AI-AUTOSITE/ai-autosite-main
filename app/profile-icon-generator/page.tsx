'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Download, Check } from 'lucide-react'

export default function ProfileIconGenerator() {
  const canvasRefs = {
    small: useRef<HTMLCanvasElement>(null),
    medium: useRef<HTMLCanvasElement>(null),
    large: useRef<HTMLCanvasElement>(null),
    xlarge: useRef<HTMLCanvasElement>(null),
  }

  const [downloaded, setDownloaded] = useState<string[]>([])

  const iconSizes = [
    { 
      id: 'small', 
      size: 256, 
      name: '256x256', 
      usage: 'Twitter, Facebook',
      ref: canvasRefs.small 
    },
    { 
      id: 'medium', 
      size: 400, 
      name: '400x400', 
      usage: 'LinkedIn (推奨)',
      ref: canvasRefs.medium 
    },
    { 
      id: 'large', 
      size: 512, 
      name: '512x512', 
      usage: 'Instagram, Discord',
      ref: canvasRefs.large 
    },
    { 
      id: 'xlarge', 
      size: 1024, 
      name: '1024x1024', 
      usage: 'High Resolution',
      ref: canvasRefs.xlarge 
    },
  ]

  // Create SVG string - SignalLogo.tsxと完全同一
  const createSVGString = (size: number) => {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="signal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0052CC" stop-opacity="1" />
            <stop offset="50%" stop-color="#00A3FF" stop-opacity="1" />
            <stop offset="100%" stop-color="#00C853" stop-opacity="1" />
          </linearGradient>
        </defs>
        
        <!-- 白い円形背景 -->
        <circle cx="60" cy="60" r="59" fill="white" />
        
        <!-- 外側の円 -->
        <circle cx="60" cy="60" r="55" stroke="url(#signal-grad)" stroke-width="2" fill="none" opacity="0.3" />
        
        <!-- Wave 1 -->
        <path d="M 25 45 Q 35 40, 45 45 T 65 45 T 85 45 T 95 45" 
              stroke="url(#signal-grad)" stroke-width="3" fill="none" stroke-linecap="round" />
        
        <!-- Wave 2 (middle - thicker) -->
        <path d="M 25 60 Q 35 55, 45 60 T 65 60 T 85 60 T 95 60" 
              stroke="url(#signal-grad)" stroke-width="4" fill="none" stroke-linecap="round" />
        
        <!-- Wave 3 -->
        <path d="M 25 75 Q 35 70, 45 75 T 65 75 T 85 75 T 95 75" 
              stroke="url(#signal-grad)" stroke-width="3" fill="none" stroke-linecap="round" />
      </svg>
    `
  }

  // Draw Signal logo using SVG → Image → Canvas
  const drawSignalLogo = async (canvas: HTMLCanvasElement, size: number) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Create SVG blob
    const svgString = createSVGString(size)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    // Load SVG as image
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  // Initialize all canvases
  useEffect(() => {
    iconSizes.forEach(({ ref, size }) => {
      if (ref.current) {
        drawSignalLogo(ref.current, size)
      }
    })
  }, [])

  // Download function
  const downloadIcon = (canvas: HTMLCanvasElement | null, size: number, id: string) => {
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `signal-profile-${size}x${size}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Mark as downloaded
      setDownloaded(prev => [...prev, id])
      setTimeout(() => {
        setDownloaded(prev => prev.filter(item => item !== id))
      }, 2000)
    }, 'image/png')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Signal Profile Icon Generator
          </h1>
          <p className="text-gray-400 text-lg">
            プロフィール画像用のSignalロゴをダウンロード
          </p>
        </div>

        {/* Preview Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">プレビュー</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {iconSizes.map(({ id, size, name, usage, ref }) => (
              <div key={id} className="text-center">
                <div className="bg-white rounded-2xl p-6 mb-4 flex items-center justify-center">
                  <canvas
                    ref={ref}
                    className="max-w-full h-auto"
                    style={{ width: '150px', height: '150px' }}
                  />
                </div>
                <h3 className="text-white font-semibold mb-1">{name}</h3>
                <p className="text-gray-400 text-sm mb-3">{usage}</p>
                <button
                  onClick={() => downloadIcon(ref.current, size, id)}
                  className={`
                    w-full px-4 py-2 rounded-lg font-medium transition-all
                    flex items-center justify-center gap-2
                    ${downloaded.includes(id)
                      ? 'bg-green-500 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    }
                  `}
                >
                  {downloaded.includes(id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">使い方ガイド</h2>
          
          <div className="space-y-6">
            {/* Google */}
            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">Google プロフィール</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    推奨サイズ: 250x250px以上
                  </p>
                  <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                    <li><strong>256x256</strong> または <strong>400x400</strong> をダウンロード</li>
                    <li>Google アカウント設定を開く</li>
                    <li>「プロフィール写真を変更」をクリック</li>
                    <li>ダウンロードした画像をアップロード</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">in</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">LinkedIn プロフィール</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    推奨サイズ: 400x400px以上（最大8MB）
                  </p>
                  <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                    <li><strong>400x400</strong> または <strong>512x512</strong> をダウンロード</li>
                    <li>LinkedIn プロフィールを開く</li>
                    <li>カメラアイコンをクリック</li>
                    <li>ダウンロードした画像をアップロード</li>
                    <li>位置を調整して保存</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Twitter */}
            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">𝕏</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">Twitter (X) プロフィール</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    推奨サイズ: 400x400px（最小200x200px）
                  </p>
                  <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                    <li><strong>256x256</strong> または <strong>400x400</strong> をダウンロード</li>
                    <li>プロフィール編集を開く</li>
                    <li>プロフィール画像をクリック</li>
                    <li>ダウンロードした画像をアップロード</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Other Platforms */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">その他のプラットフォーム</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-cyan-400 font-medium mb-2">Instagram</h4>
                  <p className="text-gray-400 text-sm">推奨: 512x512 または 1024x1024</p>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-medium mb-2">Facebook</h4>
                  <p className="text-gray-400 text-sm">推奨: 256x256 または 400x400</p>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-medium mb-2">Discord</h4>
                  <p className="text-gray-400 text-sm">推奨: 512x512</p>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-medium mb-2">GitHub</h4>
                  <p className="text-gray-400 text-sm">推奨: 256x256 または 512x512</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
          <h3 className="text-cyan-400 font-semibold mb-3">💡 Tips</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>• 迷ったら <strong>400x400</strong> または <strong>512x512</strong> をダウンロード</li>
            <li>• 高解像度が必要な場合は <strong>1024x1024</strong> を使用</li>
            <li>• すべてPNG形式で透過背景に対応</li>
            <li>• 円形の背景付きなので、どのプラットフォームでも綺麗に表示されます</li>
          </ul>
        </div>

      </div>
    </div>
  )
}