# モバイル最適化ガイド

**Version: 1.0**  
**最終更新: 2025-10-17**

## 📌 最重要原則

### 機能 > デザイン

**絶対に守るべきこと：**
- ✅ **機能的にモバイルで動作すること**（最優先）
- ⚠️ デザインの崩れは後から修正可能
- ❌ 動かないツールは絶対にNG（ユーザーを失望させる）

### 確認の義務

**新規ツール作成時：**
1. スマートフォン実機で動作確認（必須）
2. タブレットで動作確認（推奨）
3. 各ブラウザで確認（iOS Safari、Android Chrome）

### 関連ドキュメント

- [master-guide.md](./master-guide.md) - 開発の基本方針
- [ux-performance-guide.md](./ux-performance-guide.md) - PC/モバイル共通のUX
- [privacy-policy-guide.md](./privacy-policy-guide.md) - プライバシー保護

---

## 🔍 5項目チェックリスト

新規ツール作成時、以下の5項目を必ず確認してください。

---

### 1. ライブラリ互換性チェック

#### 確認内容
- 使用しているnpmライブラリがモバイルブラウザで動作するか
- ブラウザAPI依存の有無（FileReader, Canvas API等）

#### 判定基準
| 判定 | 状態 | 対応 |
|------|------|------|
| ✅ | 全ライブラリがモバイル対応 | そのまま実装OK |
| ⚠️ | 一部制限あり | polyfillや代替手段で対応 |
| ❌ | モバイル非対応 | ツール自体を見直し |

#### 要注意ライブラリ例
```typescript
// ❌ モバイルで重い
import Tesseract from 'tesseract.js'  // OCR - メモリ消費大

// ⚠️ ファイルサイズ制限に注意
import { PDFDocument } from 'pdf-lib'  // PDF編集 - 10MB以下推奨

// ✅ モバイル対応OK
import QRCode from 'qrcode'           // 軽量
import JSZip from 'jszip'              // 軽量
```

---

### 2. ファイル処理チェック

#### モバイルでの制限
```typescript
// iOS Safariのメモリ制限
const MAX_FILE_SIZE = 10 * 1024 * 1024  // 10MB

if (file.size > MAX_FILE_SIZE) {
  alert('File too large for mobile devices (max 10MB)')
  return
}
```

**プラットフォーム別制限：**
- **iOS Safari**: 約1GB（厳しい）
- **Android Chrome**: デバイス依存（比較的緩い）
- **推奨**: 10MB以下のファイルサイズ制限

#### 判定基準
| 判定 | ファイルサイズ | メモリ処理 |
|------|--------------|-----------|
| ✅ | < 5MB | ストリーム処理 |
| ⚠️ | 5-10MB | 一括処理（警告表示） |
| ❌ | > 10MB | モバイル非推奨 |

---

### 3. メモリ消費チェック

#### 判定基準
| 判定 | 処理内容 | 例 |
|------|---------|-----|
| ✅ | 軽量処理 | テキスト変換、簡単な計算 |
| ⚠️ | 中程度 | 画像圧縮、小規模OCR |
| ❌ | 重い処理 | 動画編集、大量データ分析 |

#### 最適化のヒント
```typescript
// ✅ Web Workerでメインスレッドを守る
const worker = new Worker('/worker.js')
worker.postMessage({ data })
worker.onmessage = (e) => {
  setResult(e.data)
}

// ✅ 段階的処理でメモリを解放
const processInChunks = async (items: any[], chunkSize = 100) => {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    await processChunk(chunk)
    await new Promise(r => setTimeout(r, 0))  // メモリ解放
  }
}

// ✅ プログレスバーでUX改善
const [progress, setProgress] = useState(0)
setProgress((i / total) * 100)
```

---

### 4. タッチ操作対応チェック

#### タップ領域の最小サイズ（最重要）
```tsx
// ❌ 小さすぎる（タップしづらい）
<button className="p-1">  // 約8x8px
  <X size={16} />
</button>

// ⚠️ ギリギリ（推奨しない）
<button className="p-2">  // 約32x32px
  <X size={20} />
</button>

// ✅ 適切なサイズ
<button className="p-3">  // 約48x48px（推奨）
  <X size={20} />
</button>
```

**タップ領域の推奨サイズ：**
- **最小**: 44x44px（Apple HIG）
- **推奨**: 48x48px（Material Design）
- **理想**: 56x56px以上

#### 要注意パターン
```typescript
// ❌ hoverに依存（モバイルでは無意味）
onMouseEnter={() => setTooltip(true)}
onMouseLeave={() => setTooltip(false)}

// ✅ タップで表示
onClick={() => setTooltip(!tooltip)}
```

---

### 5. レスポンシブ対応チェック

#### モバイル最適化のポイント
```tsx
// ✅ 段階的レイアウト
<div className="
  grid
  grid-cols-1           // モバイル: 1列
  sm:grid-cols-2        // タブレット: 2列
  lg:grid-cols-3        // PC: 3列
  gap-4
">

// ✅ フォントサイズ調整
<h1 className="
  text-2xl              // モバイル
  sm:text-3xl           // タブレット
  lg:text-4xl           // PC
">

// ✅ パディング調整
<div className="
  p-4                   // モバイル: 狭め
  sm:p-6                // タブレット
  lg:p-8                // PC: 広め
">

// ✅ 横スクロール許可（テーブルなど）
<div className="overflow-x-auto">
  <table className="min-w-[600px]">
    {/* ... */}
  </table>
</div>
```

---

## 🎨 UI/UXベストプラクティス

### 1. エラー表示のタイミング

**最重要ルール：入力中にエラーを表示しない**
```tsx
// ❌ 悪い例：入力中に即座にエラー
{phoneNumber.length < 8 && (
  <p className="text-red-400">Too short</p>
)}

// ✅ 良い例：適切なタイミングでエラー
const [showError, setShowError] = useState(false)
const [touched, setTouched] = useState(false)

<input
  value={phoneNumber}
  onChange={(e) => {
    setPhoneNumber(e.target.value)
    if (touched && showError) {
      setShowError(!isValid(e.target.value))
    }
  }}
  onBlur={() => {
    setTouched(true)
    if (phoneNumber && !isValid(phoneNumber)) {
      setShowError(true)
    }
  }}
  onFocus={() => setShowError(false)}
/>

{showError && touched && (
  <p className="text-red-400">
    Too short (min 8 digits, current: {phoneNumber.length})
  </p>
)}
```

#### エラー表示のタイミング表

| エラー種類 | 表示タイミング | 理由 |
|-----------|--------------|------|
| 不正な文字入力 | **即座** | 重要なエラー、すぐに知らせる |
| 最大文字数超過 | **即座** | これ以上入力できない |
| 必須項目未入力 | **onBlur後** | 入力中は邪魔しない |
| フォーマット不正 | **onBlur後** | 入力完了後にチェック |
| 最小文字数不足 | **onBlur後** | まだ入力中かもしれない |

---

### 2. フォーカス管理

**問題：ボタンクリックでフォーカスが外れる**
```tsx
// ❌ 悪い例：フォーカスが外れてonBlurが発火
<button onClick={() => setCountryCode('+81')}>
  Japan
</button>

// ✅ 良い例：フォーカスを維持
<button 
  onMouseDown={(e) => {
    e.preventDefault()  // ✅ フォーカスを維持
    setCountryCode('+81')
  }}
>
  Japan
</button>
```

---

### 3. バイブレーションフィードバック
```tsx
const vibrate = (duration: number | number[]) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

// ✅ 成功時：短く軽く
const handleCopy = () => {
  navigator.clipboard.writeText(text)
  vibrate(30)  // 30ms
}

// ⚠️ エラー時：少し長め
const handleError = () => {
  vibrate(50)  // 50ms
}

// ❌ 絶対NG：長すぎる
vibrate(200)  // ユーザーが不快
```

**バイブレーションのルール：**
- **成功アクション**: 20-30ms
- **エラー**: 50ms
- **重要な警告**: 2回振動 `[50, 100, 50]`
- **絶対にやらない**: 100ms以上

---

### 4. 入力欄の最適化

#### inputModeの設定（最重要）
```tsx
// ✅ 電話番号入力
<input
  type="tel"
  inputMode="tel"           // ✅ 数字キーパッド
  pattern="[0-9+\s]*"
  maxLength={20}
  autoComplete="tel"
/>

// ✅ 数値入力
<input
  type="text"
  inputMode="numeric"       // ✅ 数字のみ
  pattern="[0-9]*"
/>

// ✅ メールアドレス
<input
  type="email"
  inputMode="email"         // ✅ @と.が簡単に
/>
```

#### inputModeの種類

| inputMode | 用途 | キーボード |
|-----------|------|-----------|
| `text` | 通常テキスト | 標準キーボード |
| `tel` | 電話番号 | 数字キーパッド（+記号あり） |
| `numeric` | 整数 | 数字のみ |
| `decimal` | 小数 | 数字+小数点 |
| `email` | メールアドレス | @と.が簡単に |
| `url` | URL | /と.が簡単に |

#### autoFocusの扱い
```tsx
// ❌ モバイルではNG（キーボードが自動で開いて邪魔）
<input autoFocus={true} />

// ✅ モバイルでは無効化
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)
<input autoFocus={!isMobile} />
```

---

### 5. エラーメッセージの書き方
```tsx
// ❌ 技術的すぎる
"Error: Invalid format. Expected E.164 standard."

// ❌ 曖昧すぎる
"入力エラー"

// ✅ 具体的でアクション可能
"Only numbers, +, and spaces allowed"
"Too short (min 8 digits, current: 5)"
```

**良いエラーメッセージの条件：**
1. **具体的**: 何が問題かを明示
2. **現在の状態を表示**: `(current: 5)`
3. **解決方法を示唆**: 例を示す
4. **簡潔**: 1行で収まる
5. **フレンドリー**: 責めない表現

---

### 6. 文字数カウンター
```tsx
const MAX_LENGTH = 15
const count = text.length

<p className={`text-xs mt-1 ${
  count > MAX_LENGTH
    ? 'text-red-400'              // 超過: 赤
    : count > MAX_LENGTH * 0.9
    ? 'text-yellow-400'           // 90%以上: 黄色
    : 'text-gray-400'             // 通常: グレー
}`}>
  {count}/{MAX_LENGTH} characters
  {count <= MAX_LENGTH && ' ✓'}
</p>
```

---

## ✅ 実装チェックリスト

### 新規ツール作成時の必須確認項目

#### 機能面（最優先）
- [ ] **実機で動作確認済み**（スマートフォン）
- [ ] タブレットで動作確認済み
- [ ] iOS Safariで確認
- [ ] Android Chromeで確認
- [ ] ライブラリがモバイル対応
- [ ] メモリ消費が許容範囲（< 100MB）
- [ ] ファイルサイズ制限設定（< 10MB）
- [ ] タッチ操作が可能

#### UI/UX面
- [ ] タップ領域は44x44px以上
- [ ] `inputMode`を適切に設定
- [ ] モバイルでは`autoFocus={false}`
- [ ] プレースホルダーに具体例
- [ ] エラーは`onBlur`後に表示
- [ ] 不正文字は即座にエラー
- [ ] フォーカス時にエラーをクリア
- [ ] バイブレーションは控えめに（30-50ms）
- [ ] 文字数カウンターを表示
- [ ] エラーメッセージは具体的に
- [ ] Quick fillボタンは`onMouseDown` + `preventDefault()`

#### レスポンシブ面
- [ ] `sm:`, `md:`, `lg:`プレフィックス使用
- [ ] 固定幅指定なし（`w-[1000px]`等）
- [ ] フォントサイズが段階的
- [ ] パディング・マージンが段階的
- [ ] 横スクロール対応（必要な箇所）
- [ ] 画像が画面幅に収まる

---

## 🚨 よくある失敗例

### 1. タップ領域が小さすぎる
```tsx
// ❌ 失敗例
<button className="p-1">
  <X size={16} />
</button>

// ✅ 正解
<button className="p-3">
  <X size={20} />
</button>
```

---

### 2. 入力中にエラー表示
```tsx
// ❌ 失敗例
{text.length < 5 && <Error>Too short</Error>}

// ✅ 正解
const [touched, setTouched] = useState(false)
{touched && text.length < 5 && <Error>Too short</Error>}
```

---

### 3. autoFocusでキーボードが開く
```tsx
// ❌ 失敗例
<input autoFocus={true} />

// ✅ 正解
<input autoFocus={false} />
```

---

### 4. inputModeの未設定
```tsx
// ❌ 失敗例
<input type="text" placeholder="+1234567890" />

// ✅ 正解
<input
  type="tel"
  inputMode="tel"
  placeholder="+1234567890"
/>
```

---

### 5. hover依存のUI
```tsx
// ❌ 失敗例
<button className="hover:bg-white/10">
  {/* hoverでしか見えない */}
</button>

// ✅ 正解
<button onClick={() => setShowInfo(!showInfo)}>
  {showInfo && <Info />}
</button>
```

---

## 🔄 更新履歴

| Ver | 日付 | 内容 |
|-----|------|------|
| 1.0 | 2025-10-27 | 初版作成 |

---

**新規ツール作成時は必ずこのガイドを確認し、実機でテストしてください！** 📱✨