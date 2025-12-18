# 📄 ファイル3: ai-tools-guide.md

````markdown
# AIツール・GPUツール識別・管理ガイド

**Version: 1.1**  
**最終更新: 2025-12-15**

## 📌 概要

本ドキュメントは、AI機能およびGPU処理を使用するツールの識別システムと管理方法をまとめたものです。
ユーザーへの透明性確保とコスト管理を重視した設計を推奨します。

### 関連ドキュメント

- [api-usage-guide.md](./api-usage-guide.md) - 基本実装ガイド
- [api-security-guide.md](./api-security-guide.md) - セキュリティ対策
- [privacy-policy-guide.md](./privacy-policy-guide.md) - プライバシー保護

---

## ⚡ GPUツール一覧 (NEW!)

現在、以下のツールがGPU処理を使用しています：

| ツール                   | カテゴリー    | APIエンドポイント           | 主な機能       | 使用モデル |
| ------------------------ | ------------- | --------------------------- | -------------- | ---------- |
| **Voice Transcription**  | Audio Tools   | Modal Whisper API           | 音声→テキスト  | Whisper large-v3 |
| **Background Remover**   | Image Tools   | Modal RMBG API              | 背景削除       | RMBG-2.0   |

### GPUツールのプロパティ定義

```typescript
interface GPUTool extends Tool {
  badge: 'GPU'              // UI表示用バッジ
  apiRequired: true         // API使用フラグ
  dataProcessing: 'server'  // GPUサーバー処理
  pricing: 'free'           // 無料（使用量制限あり）
}
```

### GPUツールの特徴

| 項目 | 説明 |
|------|------|
| データ送信先 | 自社管理GPUサーバー (Modal) |
| データ保存 | ❌ 処理後即座に削除 |
| ログ | ❌ ユーザーデータのログ禁止 |
| 通信 | HTTPS必須 |
| 処理速度 | ブラウザの5-10倍 |
| 精度 | 大規模AIモデルにより高精度 |

---

## 🤖 AIツール一覧

現在、以下のツールがAI機能（Claude API）を使用しています：

| ツール                   | カテゴリー  | APIエンドポイント   | 主な機能       | 使用AI |
| ------------------------ | ----------- | ------------------- | -------------- | ------ |
| **Competitive Analyzer** | Analyzers   | `/api/ai-analysis`  | 競合分析       | Claude |
| **AI Resume**            | Generators  | `/api/ai-resume`    | 履歴書生成     | Claude |
| **Code Roaster**         | Dev Tools   | `/api/code-roaster` | コードレビュー | Claude |
| **Debate Trainer**       | Learning    | `/api/debate`       | 議論練習       | Claude |
| **AI Summarizer**        | Learning    | `/api/summarize`    | 要約生成       | Claude |

---

## 🏷️ プロパティ定義

AIツールは以下のプロパティで識別されます：

````typescript
interface AITool extends Tool {
  badge: 'AI'              // UI表示用バッジ
  apiRequired: true        // API使用フラグ
  dataProcessing: 'server' // サーバー処理
  pricing: 'freemium'      // 使用量制限あり
}

💻 実装パターン
1. ツール定義での識別
typescript// app/lib/categories/[category].ts

{
  id: 'ai-tool-name',
  name: 'AI Tool Name',
  description: 'AI-powered feature description.',
  category: 'category-name',

  // AI識別プロパティ
  badge: 'AI',
  apiRequired: true,
  dataProcessing: 'server',
  pricing: 'freemium',

  // その他の必須プロパティ
  icon: '🤖',
  color: 'from-purple-500 to-pink-500',
  status: 'live',
  url: '/tools/ai-tool-name',
  tags: ['AI', 'automation'],
  difficulty: 'Simple',
  timeToUse: '2 minutes',
  featured: true,
  lastUpdated: '2025-10'
}
2. APIエンドポイントでの識別
typescript// app/api/[ai-tool]/route.ts

export async function POST(request: NextRequest) {
  const headers = {
    'X-Tool-Type': 'AI',
    'X-AI-Provider': 'Claude',
    'X-Processing-Method': 'server'
  }

  return NextResponse.json(
    {
      data: result,
      metadata: {
        toolType: 'AI',
        provider: 'claude',
        method: 'server',
        processingTime: Date.now() - startTime
      }
    },
    { headers }
  )
}
3. フロントエンドでの表示
typescript// components/AIToolIndicator.tsx

export function AIToolIndicator({ isAI }: { isAI: boolean }) {
  if (!isAI) return null

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
      <span className="text-xl">🤖</span>
      <div>
        <p className="text-sm font-semibold text-purple-300">AI-Powered</p>
        <p className="text-xs text-gray-400">
          This tool uses Claude AI for advanced processing
        </p>
      </div>
    </div>
  )
}

📊 使用量管理
AIツールの制限
typescriptconst AI_TOOL_LIMITS = {
  'ai-analysis': { daily: 10, perRequest: 5000 },
  'ai-resume': { daily: 5, perRequest: 10000 },
  'code-roaster': { daily: 20, perRequest: 3000 },
  'debate': { daily: 15, perRequest: 8000 },
  'summarize': { daily: 30, perRequest: 5000 },
  'pdf-to-data': { daily: 10, perRequest: 10000 }
}

function checkAIToolLimit(toolId: string, userId: string): boolean {
  const limit = AI_TOOL_LIMITS[toolId]
  const usage = getUserDailyUsage(userId, toolId)

  return usage.count < limit.daily
}
コスト透明性の表示
typescript// components/AIToolCost.tsx

export function AIToolCost({ toolId }: { toolId: string }) {
  const pricing = {
    'ai-analysis': { cost: 0.003, description: 'per analysis' },
    'ai-resume': { cost: 0.005, description: 'per generation' },
    'code-roaster': { cost: 0.002, description: 'per review' },
    'debate': { cost: 0.004, description: 'per session' },
    'summarize': { cost: 0.002, description: 'per summary' },
    'pdf-to-data': { cost: 0.005, description: 'per extraction' }
  }

  const info = pricing[toolId]

  return (
    <div className="text-xs text-gray-400">
      <p>API Cost: ${info.cost} {info.description}</p>
      <p className="text-gray-500">Free tier: Limited daily usage</p>
    </div>
  )
}

⚠️ エラーメッセージ
AIツール特有のエラーメッセージ：
typescriptconst AI_TOOL_ERRORS = {
  RATE_LIMIT: {
    code: 'AI_RATE_LIMIT',
    message: 'Daily AI usage limit reached. Try again tomorrow.',
    suggestion: 'Upgrade to Pro for unlimited AI features.'
  },
  API_ERROR: {
    code: 'AI_API_ERROR',
    message: 'AI service temporarily unavailable.',
    suggestion: 'Using local fallback processing with limited features.'
  },
  TOKEN_LIMIT: {
    code: 'AI_TOKEN_LIMIT',
    message: 'Input exceeds AI processing limit.',
    suggestion: 'Try with shorter content or split into smaller parts.'
  }
}

📈 モニタリング指標
指標説明目標値AI Success RateAI処理の成功率> 95%Avg AI Response TimeAI応答時間の平均< 3秒Daily AI Requests日次AI使用回数監視のみToken Usageトークン消費量予算内Fallback Rateフォールバック発生率< 5%

🔒 セキュリティ考慮事項
1. 入力サニタイゼーション
typescriptfunction sanitizeAIInput(input: string): string {
  if (input.length > 50000) {
    throw new Error('Input too long for AI processing')
  }

  const forbidden = ['<script>', 'eval(', 'onclick=']
  if (forbidden.some(f => input.toLowerCase().includes(f))) {
    throw new Error('Invalid input detected')
  }

  return input.trim()
}
2. レート制限の強化
typescript// AIツールは通常ツールより厳しい制限
const AI_RATE_LIMIT = {
  maxRequests: 5,        // 通常は10
  windowMs: 60 * 1000,
  blockDuration: 10 * 60 * 1000
}
3. コスト保護
typescriptfunction validateAIRequestCost(input: string): void {
  const estimatedTokens = input.length / 4
  const estimatedCost = estimatedTokens * 0.000003

  if (estimatedCost > 0.10) {
    throw new Error('Request too expensive. Please reduce input size.')
  }
}

✅ ベストプラクティス
AIツール開発時の必須事項

 3層フォールバックシステムを実装
 badge: 'AI' で視覚的に識別可能
 APIコスト透明性を表示
 使用量制限を適切に設定
 エラーメッセージを分かりやすく
 ローカルフォールバック処理を実装
 レスポンス時間を監視
 トークン使用量をログ記録

ユーザー体験の最適化
typescriptexport function AIProcessingIndicator({ provider }: { provider: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Loader2 className="animate-spin w-4 h-4" />
      <span>Processing with {provider} AI...</span>
      <span className="text-xs text-gray-500">(typically 2-5 seconds)</span>
    </div>
  )
}

❓ よくある質問
Q: すべてのAIツールでClaude APIを使用していますか？
A: はい、プライマリはすべてClaude Sonnet 4です。フォールバックとしてCohereを使用します。
Q: AI機能を使わないオプションはありますか？
A: 一部のツールではローカルフォールバック処理が利用可能です。ただし機能は制限されます。
Q: APIキーは誰が管理していますか？
A: サーバー側で安全に管理されており、クライアントには公開されません。
Q: AIツールの使用量制限を超えたらどうなりますか？
A: 24時間後にリセットされます。すぐに使いたい場合はProプランをご検討ください。

🔄 更新履歴
Ver日付内容1.12025-12-15GPUツールセクション追加、カテゴリー名更新1.02025-10-17初版作成（api-usage-guideから分離）

AIツールの追加・更新時は、必ずこのガイドを参照してください。

---

## 📝 実装手順

### 1. 既存ファイルのバックアップ
```bash
cp .ai-autosite-main/api-usage-guide.md .ai-autosite-main/api-usage-guide.md.backup
2. 新規ファイルの作成
bash# 上記の3つのファイルを作成
touch .ai-autosite-main/api-usage-guide.md
touch .ai-autosite-main/api-security-guide.md
touch .ai-autosite-main/ai-tools-guide.md
3. 内容のコピー
各ファイルに上記のマークダウンをコピーしてください。
4. クロスリファレンスの確認
各ファイルの冒頭に「関連ドキュメント」セクションがあり、相互参照できるようになっています。

以上で、APIガイドの完全なリファクタリングが完了します！
````
````
