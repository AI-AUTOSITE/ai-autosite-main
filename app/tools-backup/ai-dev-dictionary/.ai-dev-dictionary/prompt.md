📋 AI Dev Dictionary - プロンプト版への転換設計書
1. ユーザー用語追加機能
データ保存方法（個人情報不要）
typescript// ローカルストレージのみで実装（個人情報不要）
interface UserTerm {
  id: string // UUID自動生成
  term: string
  description: string
  aiPrompts: string[]
  category: string
  createdAt: string
  // 個人情報は一切保存しない
}

// 保存先：ブラウザのlocalStorage
localStorage.setItem('userTerms', JSON.stringify(terms))
2. コード→プロンプトへの転換
現在の構造（コード中心）
typescript// Before
{
  term: "Modal",
  codeExample: `
    <div className="modal">
      <div className="modal-content">
        ...
      </div>
    </div>
  `
}
新しい構造（プロンプト中心）
typescript// After
{
  term: "Modal",
  prompts: {
    basic: "Create a modal dialog with overlay background, centered content, and close button",
    advanced: "Build a modal with: ESC key to close, click outside to dismiss, smooth fade animation, focus trap",
    tailwind: "Modal using Tailwind CSS with backdrop-blur, fixed positioning, z-50 layer",
  },
  variations: [
    "Confirmation modal with Yes/No buttons",
    "Full-screen modal for mobile",
    "Drawer modal sliding from right"
  ]
}
3. 実装計画
Phase 1: データ構造の変更
typescript// lib/terms/types.ts
export interface TechTerm {
  id: string
  term: string
  description: string
  category: string
  
  // 新規追加
  prompts: {
    basic: string      // 初心者向け
    advanced: string   // 詳細版
    tailwind?: string  // Tailwind特化
    react?: string     // React特化
  }
  
  promptTips: string[] // プロンプトのコツ
  commonMistakes: string[] // よくある間違い
  
  // 既存のcodeExampleは削除またはオプショナルに
  codeExample?: string
}
Phase 2: UI更新
typescript// components/cards/PromptCard.tsx
export default function PromptCard({ term, onCopy }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="space-y-3">
      {/* 基本プロンプト */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-cyan-400">Basic Prompt</span>
          <button onClick={() => handleCopy(term.prompts.basic)}>
            {copied ? <Check /> : <Copy />}
          </button>
        </div>
        <p className="text-sm text-gray-300">{term.prompts.basic}</p>
      </div>
      
      {/* プロンプトのコツ */}
      <div className="bg-purple-500/10 rounded-lg p-3">
        <p className="text-xs text-purple-300">
          💡 Tip: {term.promptTips[0]}
        </p>
      </div>
    </div>
  )
}
Phase 3: ユーザー用語追加
typescript// components/modals/AddTermModal.tsx
export default function AddTermModal({ onSave, onClose }) {
  const [term, setTerm] = useState({
    term: '',
    description: '',
    prompts: { basic: '', advanced: '' },
    category: 'custom'
  })
  
  const handleSave = () => {
    // localStorageに保存
    const userTerms = JSON.parse(localStorage.getItem('userTerms') || '[]')
    userTerms.push({
      ...term,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('userTerms', JSON.stringify(userTerms))
    onSave(term)
    onClose()
  }
  
  return (
    <div className="modal">
      <input 
        placeholder="用語名"
        value={term.term}
        onChange={(e) => setTerm({...term, term: e.target.value})}
      />
      <textarea 
        placeholder="説明"
        value={term.description}
        onChange={(e) => setTerm({...term, description: e.target.value})}
      />
      <textarea 
        placeholder="AIプロンプト"
        value={term.prompts.basic}
        onChange={(e) => setTerm({
          ...term, 
          prompts: {...term.prompts, basic: e.target.value}
        })}
      />
      <button onClick={handleSave}>保存</button>
    </div>
  )
}