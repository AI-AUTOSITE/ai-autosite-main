import { X, FileText, Scissors, Download } from 'lucide-react'

export const toolGuide = {
  title: 'How to Use Image Splitter',
  modes: [
    {
      name: 'Paper Size',
      desc: 'Split by standard paper dimensions',
      icon: '📄',
    },
    {
      name: 'By Height',
      desc: 'Split every X pixels',
      icon: '📏',
    },
    {
      name: 'By Count',
      desc: 'Split into N equal parts',
      icon: '🔢',
    },
    {
      name: 'Manual',
      desc: 'Click to place split lines',
      icon: '✋',
    },
  ],
  paperSizes: [
    { name: 'A4', size: '210×297mm', use: 'Standard documents' },
    { name: 'A5', size: '148×210mm', use: 'Small prints' },
    { name: 'B5', size: '182×257mm', use: 'Books, notebooks' },
  ],
  dpiGuide: [
    { dpi: 72, use: 'Web display only' },
    { dpi: 96, use: 'Standard screen' },
    { dpi: 150, use: 'Regular printing' },
    { dpi: 300, use: 'High-quality print' },
  ],
  downloadOptions: [
    {
      type: 'Merged',
      desc: 'All parts side by side in one image',
      best: 'Viewing on screen',
    },
    {
      type: 'Separate',
      desc: 'Individual image files',
      best: 'Printing each page',
    },
  ],
  troubleshooting: [
    {
      problem: 'Image not splitting',
      solution: 'Make sure image height is larger than split size',
    },
    { problem: 'Wrong paper size', solution: 'Check DPI setting - higher DPI = more pixels' },
    {
      problem: 'Manual mode not working',
      solution: 'Click on the image to add lines, click Remove to delete',
    },
  ],
}

interface ToolGuideProps {
  onClose?: () => void
}

export default function ToolGuide({ onClose }: ToolGuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-lg w-full relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close guide"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      )}

      <div className="flex items-center gap-2 mb-6">
        <Scissors className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      {/* Split Modes */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Split Modes</h4>
        <div className="grid grid-cols-2 gap-2">
          {toolGuide.modes.map((mode, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{mode.icon}</span>
                <span className="text-xs text-white font-semibold">{mode.name}</span>
              </div>
              <p className="text-xs text-gray-400">{mode.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Paper Sizes & DPI */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Paper Size Settings</h4>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {toolGuide.paperSizes.map((paper, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-2 text-center">
              <FileText className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-xs text-white font-semibold">{paper.name}</div>
              <div className="text-xs text-gray-400">{paper.size}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-xs text-gray-300 mb-2">DPI Settings:</div>
          <div className="grid grid-cols-2 gap-2">
            {toolGuide.dpiGuide.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-cyan-400 font-semibold">{item.dpi}:</span>
                <span className="text-gray-400">{item.use}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Download Options</h4>
        <div className="space-y-2">
          {toolGuide.downloadOptions.map((option, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Download className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-white font-semibold">{option.type}</span>
              </div>
              <p className="text-xs text-gray-400">{option.desc}</p>
              <p className="text-xs text-cyan-400">Best for: {option.best}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <p className="text-xs text-green-400">
          <strong>100% Private:</strong> All splitting happens in your browser. No uploads.
        </p>
      </div>
    </div>
  )
}
