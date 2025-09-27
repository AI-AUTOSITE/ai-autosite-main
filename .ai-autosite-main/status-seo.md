📝 リファクタリング版 status.md v4.0
markdown# AI AutoSite ツール作成ガイド v4.0
**理念: Zero Ads・Zero Tracking・Zero BS**
**差別化: 真の無料ツール（AIコスト以外）**
**透明性: GitHub公開・Vercelデプロイ**

## 📌 最重要原則

### 3つのZERO
🚫 Zero Ads - 広告は一切表示しない
🚫 Zero Tracking - Google Analyticsすら使わない
🚫 Zero Sign-up - メールアドレスすら要求しない

### 開発の絶対ルール

説明不要なデザイン = 見た瞬間に使い方が分かる
ツールファースト = すぐツール本体
3秒ルール = 3秒で理解・操作開始
Simple English = 10-12歳が理解できる英語
Local First = 可能な限りブラウザで完結
Transparency = GitHubで全コード公開
API Cost Only = AIコールのみ有料オプション


### 禁止事項
❌ 広告（AdSense、アフィリエイト含む）
❌ トラッキング（GA、Hotjar、Mixpanel全て）
❌ Cookie（技術的に必要なもの以外）
❌ ユーザー登録（OAuth含む）
❌ メール収集（ニュースレター含む）
❌ Next.js 15/Tailwind v4（安定版のみ）

---

## 🎯 SEO最強テンプレート（Zero Ads戦略）

### メタデータ必須フォーマット
```typescript
// app/tools/[tool-name]/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Free ${toolName} Online - No Ads, No Sign Up | AI AutoSite`,
  description: `${action} instantly. 100% free, no ads, no tracking, no email required. Open source on GitHub. Your data never leaves your browser.`,
  keywords: `free ${tool}, no ads ${tool}, no sign up, no tracking, privacy tool, open source ${tool}, github`,
  openGraph: {
    title: `${toolName} - Truly Free, No Ads Ever`,
    description: `Zero ads, zero tracking, zero BS. Just a ${tool} that works.`,
  }
}

// 構造化データ（必須）
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': toolName,
  'applicationCategory': 'UtilityApplication',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD'
  },
  'featureList': [
    'No advertisements ever',
    'No tracking or analytics',
    'No account required',
    'No data collection',
    'Open source on GitHub',
    'Runs locally in browser',
    'Works offline'
  ],
  'creator': {
    '@type': 'Organization',
    'name': 'AI AutoSite',
    'url': 'https://github.com/yourusername'
  }
}
全ツール共通プライバシーバッジ
typescript// app/components/common/TrustBadges.tsx
'use client'

import { Shield, Github, Zap, Globe } from 'lucide-react'

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
      <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 
                      border border-green-500/20 rounded-lg">
        <Shield className="w-4 h-4 text-green-400" />
        <span className="text-xs text-green-400">No Ads Ever</span>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 
                      border border-cyan-500/20 rounded-lg">
        <Globe className="w-4 h-4 text-cyan-400" />
        <span className="text-xs text-cyan-400">No Tracking</span>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 
                      border border-purple-500/20 rounded-lg">
        <Zap className="w-4 h-4 text-purple-400" />
        <span className="text-xs text-purple-400">Works Offline</span>
      </div>
      
      <a href="https://github.com/yourusername/ai-autosite"
         target="_blank"
         rel="noopener noreferrer"
         className="flex items-center gap-2 px-3 py-2 bg-gray-500/10 
                    border border-gray-500/20 rounded-lg hover:bg-gray-500/20
                    transition-colors">
        <Github className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-400">Open Source</span>
      </a>
    </div>
  )
}

💰 透明な収益化モデル
実装パターン
typescript// app/tools/[ai-tool]/components/UsageTracker.tsx
'use client'

export function UsageTracker({ feature }: { feature: string }) {
  const [usage, setUsage] = useState({
    free: 10,  // 1日10回無料
    used: 0,
    isPremium: false
  })

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white">AI Processing Credits</span>
        <span className="text-sm text-yellow-400">
          {usage.free - usage.used}/{usage.free} Free Daily
        </span>
      </div>
      
      {usage.used >= usage.free && (
        <div className="text-xs text-gray-400 mt-2">
          <p>Free daily limit reached. Options:</p>
          <ul className="mt-1 space-y-1">
            <li>• Wait 24 hours for reset</li>
            <li>• Support development: $5/month unlimited</li>
            <li>• Use your own API key (free)</li>
          </ul>
        </div>
      )}
    </div>
  )
}
APIキー持ち込みオプション
typescript// ユーザーが自分のAPIキーを使える
<details className="mb-4">
  <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">
    Have your own API key? (Advanced)
  </summary>
  <div className="mt-2 p-4 bg-white/5 rounded-lg">
    <input
      type="password"
      placeholder="sk-..."
      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
      onChange={(e) => setUserApiKey(e.target.value)}
    />
    <p className="text-xs text-gray-400 mt-2">
      Your key is never saved and only used in this session
    </p>
  </div>
</details>

🚀 ツール作成チェックリスト v4.0
必須実装
typescript- [ ] メタデータに「No Ads」「No Tracking」明記
- [ ] 構造化データ（Schema.org）実装
- [ ] TrustBadgesコンポーネント配置
- [ ] GitHubリンク設置
- [ ] プライバシーポリシーリンク（フッター）

// AIツールの場合のみ
- [ ] 無料利用枠の明示（例: 10回/日）
- [ ] APIキー持ち込みオプション
- [ ] コスト説明（なぜ有料か）
ホームページヒーロー
typescript// app/page.tsx
export default function Home() {
  return (
    <section className="text-center py-16">
      <h1 className="text-5xl font-bold text-white mb-6">
        Free Tools.<br/>
        Zero Bullsh*t.
      </h1>
      
      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        No ads. No tracking. No sign-ups. No cookies.<br/>
        Just tools that work. Check our{' '}
        <a href="https://github.com/..." 
           className="text-cyan-400 hover:text-cyan-300">
          GitHub
        </a>{' '}
        for proof.
      </p>
      
      {/* 信頼指標 */}
      <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
        <div className="bg-white/5 rounded-xl p-6">
          <div className="text-3xl font-bold text-green-400">0</div>
          <div className="text-xs text-gray-400 mt-1">Ads Forever</div>
        </div>
        <div className="bg-white/5 rounded-xl p-6">
          <div className="text-3xl font-bold text-cyan-400">0</div>
          <div className="text-xs text-gray-400 mt-1">Trackers</div>
        </div>
        <div className="bg-white/5 rounded-xl p-6">
          <div className="text-3xl font-bold text-purple-400">100%</div>
          <div className="text-xs text-gray-400 mt-1">Open Source</div>
        </div>
        <div className="bg-white/5 rounded-xl p-6">
          <div className="text-3xl font-bold text-yellow-400">∞</div>
          <div className="text-xs text-gray-400 mt-1">Free Tools</div>
        </div>
      </div>
    </section>
  )
}

📊 Vercel Analyticsの代替
typescript// プライバシー重視の分析（サーバーサイドのみ）
// app/api/log/route.ts
export async function POST(request: Request) {
  const { tool, action } = await request.json()
  
  // IPをハッシュ化（個人特定不可）
  const ip = request.headers.get('x-forwarded-for')
  const hash = crypto.createHash('sha256').update(ip || '').digest('hex')
  
  // 集計データのみ保存（個人情報なし）
  await logUsage({
    tool,
    action,
    date: new Date().toISOString().split('T')[0],  // 日付のみ
    // IPアドレスは保存しない
  })
  
  return Response.json({ success: true })
}

🌐 デプロイ設定
vercel.json
json{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-DNS-Prefetch-Control",
          "value": "off"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "no-referrer"
        },
        {
          "key": "Permissions-Policy",
          "value": "interest-cohort=()"
        }
      ]
    }
  ]
}

✅ Claudeとの共有テンプレート
markdown【プロジェクト理念】
- Zero Ads（広告なし）
- Zero Tracking（追跡なし）
- Zero Sign-up（登録不要）
- Open Source（GitHub公開）

【収益化】
- 基本機能: 永久無料
- AIコール: 10回/日無料、以降は有料
- ユーザーAPIキー持ち込み可

【技術スタック】
- Next.js 14 (not 15)
- Tailwind CSS v3 (not v4)
- Vercel + GitHub
- No Analytics
- No Cookies

【差別化ポイント】
このサイトは本当に広告がない
本当にトラッキングしない
本当に無料
コードは全てGitHubで確認可能

【作りたいツール】
[ツール名と機能を記載]