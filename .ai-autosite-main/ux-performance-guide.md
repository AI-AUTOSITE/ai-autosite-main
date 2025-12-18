# 📄 ファイル4: ux-performance-guide.md

````markdown
# UX・パフォーマンス最適化ガイド

# UX・パフォーマンス最適化ガイド

**Version: 1.1**  
**最終更新: 2025-10-17**

## ⚠️ 重要な関連ガイド

### モバイル対応について
本ガイドはPC/モバイル共通のUXを扱います。
**モバイル特有の最適化は [mobile-optimization-guide.md](./mobile-optimization-guide.md) を必ず確認してください。**

**最重要原則：機能 > デザイン**
- デザインの崩れは後から修正可能
- 動かないツールは絶対にNG

### プライバシーについて
個人情報の取り扱いについては [privacy-policy-guide.md](./privacy-policy-guide.md) を必ず確認してください。

**絶対原則：Zero Tracking・Zero Collection**
- トラッキングコード禁止
- 個人情報の保存・送信禁止


## 📌 概要
（以降は既存のまま）

**Version: 1.0**  
**最終更新: 2025-10-17**

## 📌 概要

本ドキュメントは、ユーザー体験とパフォーマンスを最適化するための実装パターンをまとめたものです。
実際の開発で遭遇する問題と解決策を網羅しています。

### 関連ドキュメント

- [master-guide.md](./master-guide.md) - 開発の基本方針
- [tool-properties-guide.md](./tool-properties-guide.md) - ツール定義

---

## 🎨 ファイルアップロード処理

### 問題: OSダイアログ後の待機時間

ブラウザのセキュリティサンドボックスでファイルオブジェクトを準備する2-5秒は制御不可能

### 解決策: 視覚的フィードバック

````typescript
// ❌ 悪い例：何も表示しない
<input type="file" onChange={handleFiles} />

// ✅ 良い例：カーソル + メッセージ
const [isWaitingForFiles, setIsWaitingForFiles] = useState(false)

useEffect(() => {
  if (isWaitingForFiles) {
    document.body.style.cursor = 'wait'
    return () => { document.body.style.cursor = '' }
  }
}, [isWaitingForFiles])

const handleButtonClick = () => {
  setIsWaitingForFiles(true)
  fileInputRef.current?.click()
}

// UI表示
{isWaitingForFiles && (
  <>
    <Loader2 className="animate-spin" />
    <p>Preparing files...</p>
    <p className="text-sm">This may take a few seconds for large folders</p>
  </>
)}

📊 大量データのレンダリング最適化
問題
数万件のデータを一度に表示すると重い
例: 61,343件の依存関係を全てレンダリング → タブ切り替えが数秒かかる
解決策: ページネーション + 検索
typescript// 初期表示件数を制限
const [displayedCount, setDisplayedCount] = useState(100)
const [searchQuery, setSearchQuery] = useState('')

// フィルタリング
const filteredData = data.filter(item =>
  searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
)

// 表示データをスライス
const visibleData = filteredData.slice(0, displayedCount)
const hasMore = filteredData.length > displayedCount

// Load Moreボタン
{hasMore && (
  <button onClick={() => setDisplayedCount(prev => prev + 100)}>
    Load More ({filteredData.length - displayedCount} remaining)
  </button>
)}
目安
データ件数対応~100件そのまま表示OK100-1000件ページネーション推奨1000件~検索 + ページネーション必須

🔄 ファイル重複処理
問題
同名ファイルの衝突（page.tsx, component.tsx等）
解決策: 自動リネーム + 通知
typescriptconst handleAddFiles = (newFiles: File[]) => {
  const existingPaths = new Set(files.map(f => f.webkitRelativePath || f.name))
  const renamedFiles: Array<{ original: string; renamed: string }> = []

  newFiles.forEach(newFile => {
    const originalPath = newFile.webkitRelativePath || newFile.name
    let path = originalPath
    let counter = 1

    // 重複チェック
    while (existingPaths.has(path)) {
      const lastDotIndex = originalPath.lastIndexOf('.')
      const baseName = lastDotIndex > 0 ? originalPath.substring(0, lastDotIndex) : originalPath
      const ext = lastDotIndex > 0 ? originalPath.substring(lastDotIndex) : ''
      path = `${baseName}(${counter})${ext}`
      counter++
    }

    if (path !== originalPath) {
      renamedFiles.push({ original: originalPath, renamed: path })
    }
  })

  // 通知表示
  if (renamedFiles.length > 0) {
    showNotification({
      type: 'warning',
      message: `${renamedFiles.length} duplicate file(s) were renamed`
    })
  }
}
リネームパターン:

page.tsx → page(1).tsx → page(2).tsx
my.component.tsx → my.component(1).tsx


🔔 通知システム
実装パターン
typescriptconst [notification, setNotification] = useState<{
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
} | null>(null)

// 自動非表示
const showNotification = (notif: typeof notification) => {
  setNotification(notif)
  setTimeout(() => setNotification(null),
    notif.type === 'warning' ? 5000 : 3000
  )
}

// UI表示
{notification && (
  <div className={`animate-slide-down ${
    notification.type === 'warning'
      ? 'bg-yellow-500/10 border-yellow-500/30'
      : 'bg-cyan-500/10 border-cyan-500/30'
  }`}>
    <AlertCircle />
    <p>{notification.message}</p>
    <button onClick={() => setNotification(null)}>×</button>
  </div>
)}
自動消去時間
種類時間成功3秒情報3秒警告5秒エラー手動のみ

⚠️ エラーハンドリング
ファイル読み取りエラー
typescriptconst failedFiles: string[] = []

for (const file of files) {
  try {
    // タイムアウト付き読み取り
    const content = await Promise.race([
      file.text(),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
    ])

    processFile(content)
  } catch (error) {
    console.warn(`Failed to read: ${file.name}`, error)
    failedFiles.push(file.name)
    // エラーでも処理を継続
  }
}

// 警告表示
if (failedFiles.length > 0) {
  showNotification({
    type: 'warning',
    message: `${failedFiles.length} file(s) could not be read and were skipped`
  })
}

⏳ ローディング状態の管理
多段階表示
typescriptconst [isSelecting, setIsSelecting] = useState(false)    // ファイル選択中
const [isProcessing, setIsProcessing] = useState(false)   // 解析中

// フルスクリーンオーバーレイ（処理中）
{isProcessing && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-wait">
    <Loader2 className="animate-spin" />
    <p>Processing files...</p>
  </div>
)}
表示タイミング
処理時間対応~500ms表示不要500ms-2秒インラインスピナー2秒~フルスクリーンオーバーレイ

🎯 UI簡素化の原則
情報の表示タイミング

常時表示: ユーザーの行動に必要な情報のみ
エラー時表示: 失敗した時に初めて必要な情報
オンデマンド: ガイドやツールチップに隠す

ファイルアップロードの例
typescript// ❌ 悪い例：全ての情報を常時表示
<p>Supports: TS, TSX, JS, JSX, JSON, CSS, MD</p>
<p>Auto-skips: node_modules, .git</p>
<p>Max size: 100MB</p>

// ✅ 良い例：必要な情報のみ表示
<p>Drop files or folder here</p>
<button>Select Files</button>
<div className="text-sm text-gray-400">
  <span>• Max 100MB</span>
  <span>• Max 1000 files</span>
</div>

// サポート形式はエラー時のみ
{error && (
  <p className="text-xs">Supported: TS, TSX, JS, JSX, JSON, CSS, MD</p>
)}

⚠️ よくある実装ミス
1. 文字色の視認性
typescript// ❌ 読めない
text-gray-600  // 背景と同化
text-gray-500  // 薄すぎる

// ✅ 最低限の視認性
text-gray-400  // 補助テキストの限界
text-gray-300  // メインテキスト
text-white     // 重要テキスト
2. セレクトボックス
typescript// ❌ オプションが見えない
<select className="bg-white/5 text-white">
  <option>選択肢</option>
</select>

// ✅ オプションも視認可能
<select className="bg-white/5 text-white [&>option]:bg-gray-800 [&>option]:text-white">
  <option>選択肢</option>
</select>

✅ パフォーマンスチェックリスト
ファイルアップロード機能

 ボタンクリック時に即座にローディング表示
 document.body.style.cursor = 'wait' でカーソル変更
 "Preparing files..." メッセージ表示
 大容量フォルダ用の注意書き追加

大量データ表示

 初期表示100件に制限
 検索ボックス実装
 Load Moreボタンで追加読み込み
 合計件数を表示
 スクロールバーにカスタムスタイル

エラー対策

 個別ファイルのエラーハンドリング
 5秒タイムアウト設定
 失敗ファイル数の通知
 処理は継続（全体を止めない）

ユーザー通知

 成功時: 情報通知（3秒後自動消去）
 警告時: 警告通知（5秒後自動消去）
 手動閉じるボタン（×）
 アニメーション（animate-slide-down）


📊 判断基準まとめ
ページネーション使用
データ件数対応~100件そのまま表示100-1000件ページネーション推奨1000件~検索 + ページネーション必須
ローディング表示
処理時間対応~500ms表示不要500ms-2秒インラインスピナー2秒~フルスクリーンオーバーレイ
通知の自動消去
種類時間成功3秒情報3秒警告5秒エラー手動のみ

🔄 更新履歴
Ver日付内容1.02025-10-17初版作成（master-guideから分離）

良いUXは細部へのこだわりから生まれます

---

## 📝 実装手順

### 1. 既存ファイルのバックアップ
```bash
cp .ai-autosite-main/master-guide.md .ai-autosite-main/master-guide.md.backup
2. 新規ファイルの作成
bashtouch .ai-autosite-main/tool-properties-guide.md
touch .ai-autosite-main/metadata-seo-guide.md
touch .ai-autosite-main/ux-performance-guide.md
3. 内容のコピー
各ファイルに上記のマークダウンをコピーしてください。
4. クロスリファレンスの確認
各ファイルの「関連ドキュメント」セクションで相互参照できます。

以上で、マスターガイドの完全なリファクタリングが完了します！
````
````
