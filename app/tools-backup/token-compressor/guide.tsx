import { X, FileText, Shield, Zap, Hash, AlertTriangle, Download } from 'lucide-react'

// プロパティの型定義を追加
interface TokenCompressorGuideProps {
  onClose?: () => void
}

export default function TokenCompressorGuide({ onClose }: TokenCompressorGuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md relative">
      {/* × ボタンにonClickハンドラーを追加 */}
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Close guide"
      >
        <X className="w-5 h-5 text-gray-400 hover:text-white" />
      </button>
      
      <h3 className="text-xl font-bold text-white mb-4">Quick Guide</h3>
      
      {/* How to Use */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
            1
          </div>
          <div>
            <p className="text-white font-medium text-sm">Upload Files</p>
            <p className="text-gray-400 text-xs">Drag & drop or click to browse</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
            2
          </div>
          <div>
            <p className="text-white font-medium text-sm">Security Check</p>
            <p className="text-gray-400 text-xs">Auto-detects sensitive data</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
            3
          </div>
          <div>
            <p className="text-white font-medium text-sm">Compress & Export</p>
            <p className="text-gray-400 text-xs">Choose format and download</p>
          </div>
        </div>
      </div>

      {/* What It Does */}
      <div className="mb-6">
        <h4 className="text-white font-medium text-sm mb-2">Features</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-green-400" />
            <span className="text-gray-300">Removes comments & whitespace</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-yellow-400" />
            <span className="text-gray-300">Detects API keys & emails</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-3 h-3 text-cyan-400" />
            <span className="text-gray-300">Counts tokens (4 chars = 1 token)</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="w-3 h-3 text-purple-400" />
            <span className="text-gray-300">Export as MD, JSON, or TXT</span>
          </div>
        </div>
      </div>

      {/* Security Detection */}
      <div className="mb-6">
        <h4 className="text-white font-medium text-sm mb-2">Security Scanning</h4>
        <div className="space-y-1 text-xs text-gray-400">
          <div>• API keys (OpenAI, Google, etc.)</div>
          <div>• Email addresses</div>
          <div>• Phone numbers</div>
          <div>• Private keys (RSA, EC)</div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-cyan-600/10 border border-cyan-600/20 rounded-lg p-3">
        <h4 className="text-cyan-400 font-medium text-sm mb-2 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Tips
        </h4>
        <ul className="space-y-1 text-xs text-gray-300">
          <li>• Best for code & text files</li>
          <li>• Compression rate varies by file type</li>
          <li>• Always review before sharing</li>
          <li>• Use "Remove & Continue" for safety</li>
        </ul>
      </div>
    </div>
  )
}