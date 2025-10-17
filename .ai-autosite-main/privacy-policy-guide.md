# プライバシー・個人情報取り扱いガイド

**Version: 1.0**  
**最終更新: 2025-01-29**

## 📌 絶対原則

### Zero Tracking・Zero Collection

**AI AutoSiteでは、個人情報の取得・送信・追跡・保存を一切行いません。**

この原則は、サイトの根幹であり、絶対に妥協しません。

### 関連ドキュメント

- [master-guide.md](./master-guide.md) - 3つのZERO原則
- [api-usage-guide.md](./api-usage-guide.md) - AI API使用時の注意
- [mobile-optimization-guide.md](./mobile-optimization-guide.md) - モバイル最適化

---

## 🚫 絶対にやってはいけないこと

### 1. トラッキング・分析ツールの使用
```typescript
// ❌ 絶対禁止
import ReactGA from 'react-ga4'
ReactGA.initialize('G-XXXXXXXXXX')

// ❌ 絶対禁止
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

// ❌ 絶対禁止
import mixpanel from 'mixpanel-browser'
import * as Sentry from '@sentry/react'
import hotjar from '@hotjar/browser'
```

**禁止理由：**
- ユーザーの行動を監視することは、プライバシーの侵害
- Zero Tracking原則に反する
- ユーザーの信頼を裏切る行為

---

### 2. Cookie・ローカルストレージでの個人情報保存
```typescript
// ❌ 絶対禁止：個人情報の保存
localStorage.setItem('userEmail', email)
localStorage.setItem('userName', name)
sessionStorage.setItem('userId', id)
document.cookie = 'user_id=12345'

// ⚠️ 許可される例外（機能上必須のCookieのみ）
localStorage.setItem('theme', 'dark')              // ✅ OK：テーマ設定
localStorage.setItem('language', 'ja')             // ✅ OK：言語設定
sessionStorage.setItem('tempData', JSON.stringify(data))  // ✅ OK：一時データ
```

**ルール：**
- **個人を特定できる情報**は一切保存しない
- **機能上必須**のデータのみ保存可能
- **一時的なUI状態**は許可

---

### 3. サーバーへの個人情報送信
```typescript
// ❌ 絶対禁止
fetch('/api/log', {
  method: 'POST',
  body: JSON.stringify({
    userIP: req.ip,
    userAgent: req.headers['user-agent'],
    email: email,
    name: name
  })
})

// ❌ 絶対禁止：サーバーログへの記録
console.log(`User ${email} accessed tool ${toolName}`)

// ✅ 許可：匿名化されたエラーログ（個人情報なし）
console.error('Tool error:', {
  tool: toolName,
  error: error.message,
  timestamp: Date.now()
  // IPアドレス、メールアドレス等は含まない
})
```

---

### 4. メールアドレス・電話番号等の収集
```typescript
// ❌ 絶対禁止：サインアップフォーム
<form onSubmit={handleSignup}>
  <input type="email" name="email" required />
  <button>Sign Up</button>
</form>

// ❌ 絶対禁止：ニュースレター登録
<input type="email" placeholder="Subscribe to newsletter" />
```

**Zero Sign-up原則：**
- ツールを使うのに、メールアドレスは不要
- ユーザー登録は一切不要
- 訪問した瞬間から全機能が使える

---

### 5. ユーザー識別
```typescript
// ❌ 絶対禁止：ユーザーIDの生成
const userId = uuidv4()
localStorage.setItem('userId', userId)

// ❌ 絶対禁止：フィンガープリンティング
import FingerprintJS from '@fingerprintjs/fingerprintjs'
const fp = await FingerprintJS.load()
const result = await fp.get()

// ❌ 絶対禁止：IPアドレスの記録
const userIP = req.headers['x-forwarded-for']
logUserActivity(userIP)
```

**理由：**
- ユーザーを識別すること自体がトラッキング
- 匿名性を保証するため、識別情報は一切扱わない

---

## ✅ 許可される処理

### 1. ローカル処理（ブラウザ内完結）
```typescript
// ✅ 許可：ブラウザ内での処理
const processData = (input: string) => {
  // 全ての処理がブラウザ内で完結
  const result = input.toUpperCase()
  return result
}

// ✅ 許可：一時的なメモリ使用
const [data, setData] = useState<string>('')

// ✅ 許可：Canvas API、FileReader等のブラウザAPI
const canvas = document.createElement('canvas')
const reader = new FileReader()
```

---

### 2. 機能上必須のローカルストレージ
```typescript
// ✅ 許可：UI設定の保存
localStorage.setItem('theme', 'dark')
localStorage.setItem('language', 'ja')
localStorage.setItem('fontSize', 'large')

// ✅ 許可：ツールの設定保存（個人情報なし）
localStorage.setItem('defaultUnit', 'metric')
localStorage.setItem('colorScheme', 'vibrant')

// ✅ 許可：一時的なデータ（セッション終了で削除）
sessionStorage.setItem('tempCalculation', result)
```

**条件：**
- 個人を特定できない
- 機能の改善に必要
- ユーザーが期待する動作

---

### 3. サーバー処理（AI API使用時）
```typescript
// ✅ 許可：AI APIへのデータ送信（明示的な説明付き）
const response = await fetch('/api/ai-summarize', {
  method: 'POST',
  body: JSON.stringify({
    text: userInput  // ユーザーが送信を承諾したデータ
  })
})

// 必須：ユーザーへの明示
<div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg mb-4">
  <p className="text-sm text-yellow-400">
    ⚠️ This tool uses AI API. Your text will be sent to Claude AI for processing.
  </p>
  <p className="text-xs text-gray-400 mt-2">
    We do not store or track your data. Processing is done in real-time only.
  </p>
</div>
```

**AI API使用時のルール：**
1. **明示的な警告**を表示する
2. **何が送信されるか**を説明する
3. **保存しないこと**を明記する
4. ユーザーが理解した上で使用できるようにする

---

### 4. エラーログ（匿名化済み）
```typescript
// ✅ 許可：匿名化されたエラーログ
console.error('API Error:', {
  tool: 'image-compress',
  error: error.message,
  timestamp: Date.now(),
  // 個人情報は含まない
})

// ❌ 禁止：個人情報を含むログ
console.error('API Error:', {
  user: userEmail,      // ❌
  ip: req.ip,           // ❌
  userAgent: req.headers['user-agent']  // ❌
})
```

---

## 📋 実装チェックリスト

### 新規ツール作成時の確認項目

#### 個人情報関連
- [ ] **トラッキングコードを含まない**（GA、Mixpanel等）
- [ ] **個人情報を保存しない**（LocalStorage、Cookie）
- [ ] **個人情報をサーバーに送信しない**
- [ ] **ユーザー識別を行わない**（UUID、Fingerprint）
- [ ] **IPアドレスを記録しない**
- [ ] **メールアドレス・電話番号を収集しない**

#### AI API使用時（該当する場合）
- [ ] **警告メッセージを表示**している
- [ ] **何が送信されるか**を説明している
- [ ] **保存しないこと**を明記している
- [ ] **ユーザーが承諾した上で**使用できる

#### ローカルストレージ使用時（該当する場合）
- [ ] **保存するデータが個人情報でない**
- [ ] **機能上必須のデータのみ**保存
- [ ] **ユーザーが削除できる**（設定リセット機能）

---

## 🎯 AI API使用時の警告テンプレート

### 標準テンプレート
```tsx
<div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg mb-6">
  <div className="flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-sm text-yellow-400 font-semibold mb-2">
        ⚠️ AI Processing Notice
      </p>
      <p className="text-sm text-gray-300 mb-2">
        This tool uses Claude AI API. Your input will be sent to Anthropic's servers for processing.
      </p>
      <p className="text-xs text-gray-400">
        • We do not store or track your data<br/>
        • Processing is done in real-time only<br/>
        • Data is not shared with third parties
      </p>
    </div>
  </div>
</div>
```

### 短縮版テンプレート
```tsx
<div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-lg mb-4">
  <p className="text-xs text-cyan-400">
    🤖 AI-powered. Your input is processed by Claude AI (not stored).
  </p>
</div>
```

---

## 🚨 違反例と正しい実装

### 例1: ツール使用回数のカウント
```typescript
// ❌ 違反例：ユーザーを識別してカウント
const userId = localStorage.getItem('userId') || uuidv4()
localStorage.setItem('userId', userId)
await fetch('/api/usage', {
  method: 'POST',
  body: JSON.stringify({ userId, tool: 'qr-code' })
})

// ✅ 正しい実装：カウント自体を行わない
// ユーザーの使用回数を追跡する必要はない
// もし必要なら、匿名化された集計のみ（サーバー側で集計、個人は識別しない）
```

---

### 例2: エラーログ
```typescript
// ❌ 違反例：個人情報を含むログ
fetch('/api/error-log', {
  method: 'POST',
  body: JSON.stringify({
    userEmail: email,
    userIP: req.ip,
    error: error.message
  })
})

// ✅ 正しい実装：匿名化されたログ
console.error('Tool Error:', {
  tool: 'image-compress',
  error: error.message,
  timestamp: Date.now()
  // 個人情報なし
})
```

---

### 例3: ユーザー設定の保存
```typescript
// ❌ 違反例：ユーザープロフィールの保存
localStorage.setItem('userProfile', JSON.stringify({
  name: 'John Doe',
  email: 'john@example.com',
  preferences: { theme: 'dark' }
}))

// ✅ 正しい実装：設定のみ保存（個人情報なし）
localStorage.setItem('theme', 'dark')
localStorage.setItem('language', 'en')
```

---

## 📊 プライバシーポリシーへの記載

### 必須項目
```markdown
## Data Collection

**We collect ZERO personal data.**

- No cookies (except essential functional cookies)
- No tracking scripts (Google Analytics, etc.)
- No email collection
- No user accounts
- No IP address logging
- No fingerprinting

## AI Tools

Some tools use AI APIs (Claude by Anthropic):
- Your input is sent to the AI provider for processing
- We do not store or log your data
- Processing is done in real-time only
- Refer to Anthropic's Privacy Policy for their data handling

## Local Processing

Most tools process data entirely in your browser:
- Data stays on your device
- No server communication
- No data storage
```

---

## ✅ 最終確認

### デプロイ前の必須チェック

- [ ] Google Analyticsコードが含まれていない
- [ ] トラッキングスクリプトが含まれていない
- [ ] 個人情報を収集する機能がない
- [ ] サインアップフォームがない
- [ ] ユーザーIDを生成していない
- [ ] IPアドレスを記録していない
- [ ] AI使用時は警告を表示している
- [ ] プライバシーポリシーが正確

---

## 🔄 更新履歴

| Ver | 日付 | 内容 |
|-----|------|------|
| 1.0 | 2025-01-29 | 初版作成 |

---

**プライバシーはユーザーの基本的権利です。この原則を絶対に妥協しないでください。** 🔒✨