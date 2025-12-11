import { X, Code2 } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Code Formatter',
  steps: [
    { icon: '1', text: 'Select language (JSON, HTML, CSS, JS)' },
    { icon: '2', text: 'Paste your code in the editor' },
    { icon: '3', text: 'Click Format to beautify or Minify to compress' },
    { icon: '4', text: 'Copy the result' },
  ],
  tips: ['Format adds indentation for readability', 'Minify removes whitespace for production', 'JSON validates syntax automatically'],
}

export default function ToolGuide({ onClose }: { onClose?: () => void }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full relative">
      {onClose && <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>}
      <div className="flex items-center gap-2 mb-6"><Code2 className="w-6 h-6 text-sky-400" /><h3 className="text-xl font-bold text-white">{toolGuide.title}</h3></div>
      <div className="space-y-3 mb-6">{toolGuide.steps.map((step, i) => (<div key={i} className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center"><span className="text-xs text-sky-400 font-semibold">{step.icon}</span></div><p className="text-sm text-gray-300">{step.text}</p></div>))}</div>
      <div className="bg-white/5 rounded-lg p-3 space-y-1">{toolGuide.tips.map((tip, i) => <p key={i} className="text-xs text-gray-300">• {tip}</p>)}</div>
    </div>
  )
}
