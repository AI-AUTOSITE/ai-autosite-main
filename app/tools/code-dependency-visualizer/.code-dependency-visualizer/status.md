# Code Dependency Visualizer - プロジェクトステータス

_最終更新: 2025年1月_

## 📊 プロジェクト概要

### ツール名

Code Dependency Visualizer

### 主な機能

1. **Map Tree（マップツリー）** - プロジェクト構造の可視化とエクスポート
2. **AI Share（圧縮機能）** - コード圧縮によるトークン60%削減
3. **Dependencies** - 依存関係の分析と可視化
4. **Cost Analysis** - AI API利用コストの計算
5. **Code Quality** - コード品質メトリクスの表示

### 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Deploy**: Vercel
- **React**: 18.x（安定版）

## 🚀 最近の改善内容（2025年1月）

### 1. パフォーマンス最適化 ⚡

**問題点:**

- ファイル読み込み時に5倍以上遅くなっていた
- node_modules含む全ファイルを一度処理していた
- エラー検出処理がO(n²)で重かった

**実装した改善:**

```typescript
// Before: 全ファイル処理後にフィルタリング
const allFiles = await getAllFiles()  // node_modules含む
const filtered = allFiles.filter(...)  // 後でフィルタ

// After: 最初からスキップ
if (IGNORED_FOLDERS.includes(dirName)) {
  return  // フォルダごとスキップ
}
```

**結果:**

- 処理時間: 30秒以上 → **2-3秒**（約10倍高速化）
- メモリ使用量大幅削減
- UIフリーズ解消

### 2. エラー検出機能の削除 🗑️

**理由:**

- 処理速度のボトルネック（O(n²)の計算量）
- VSCode等のIDEで既にエラー表示される
- ツールの主目的（依存関係可視化・AI共有）から外れる

**削除した機能:**

- 未解決import検出
- 型エラー検出
- 未使用変数チェック

**残した機能:**

- 循環依存検出（構造的に重要）
- 未使用ファイル検出（クリーンアップに有用）

### 3. セキュリティ強化 🔒

**実装内容:**

- .envファイルの自動除外
- APIキーを含む可能性のあるファイルの事前フィルタリング
- node_modules、.git、build、distフォルダの完全スキップ

## 📁 現在のファイル構造

```
app/tools/code-reader/
├── page.tsx                    # メインページ（簡素化済み）
├── layout.tsx                  # レイアウト
├── components/
│   ├── UnifiedViewer.tsx      # 統合ビューア（修正済み）
│   ├── GitHubFetcher.tsx      # GitHub取得（最適化済み）
│   ├── FileUploader.tsx       # ファイルアップロード（最適化済み）
│   ├── DependencyViewer.tsx   # 依存関係ビューア
│   ├── SmartFileSelector.tsx  # スマートファイル選択
│   ├── AIPricingCalculator.tsx # 料金計算
│   ├── AIPromptBuilder.tsx    # AIプロンプト生成
│   ├── AIShareMode.tsx        # AI共有モード
│   └── ...その他コンポーネント
└── lib/
    ├── smart-dependency-analyzer.ts # 依存関係分析（簡素化済み）
    ├── code-compressor.ts          # コード圧縮
    ├── types.ts                    # 型定義
    └── constants.ts                # 定数定義
```

## 🎯 推し機能

### 1. Map Tree（マップツリー）🌟

- ワンクリックでプロジェクト構造をMarkdown形式でエクスポート
- AIやドキュメントに最適な形式
- ファイル数、行数、サイズの統計情報付き

### 2. AI Share（スマート圧縮）🔥

- コード圧縮で**60%のトークン削減**
- API利用料金を大幅節約
- 圧縮前後の比較表示
- 複数AIモデルの料金比較

## 🔧 重要な設定

### 無視されるフォルダ

```typescript
const IGNORED_FOLDERS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.cache',
  'vendor',
]
```

### 対応ファイル拡張子

```typescript
const ALLOWED_EXTENSIONS = [
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
  '.css',
  '.scss',
  '.json',
  '.md',
  '.mdx',
  '.html',
  '.vue',
  '.svelte',
]
```

### ファイル制限

- 最大ファイル数: 500
- ファイルあたり最大: 10MB
- 合計最大サイズ: 50MB
- GitHub API: 50ファイルまで（レート制限対策）

## ⚠️ 重要な注意事項

### 使用してはいけない技術

- ❌ Next.js 15（実験的）
- ❌ Turbopack
- ❌ Tailwind CSS v4（実験的）
- ❌ React 19（最新版）
- ✅ 安定版のみ使用

### パッケージバージョン固定

```json
{
  "dependencies": {
    "next": "14.2.3",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

## 📈 パフォーマンス指標

| 項目             | 改善前 | 改善後    | 改善率   |
| ---------------- | ------ | --------- | -------- |
| ファイル読み込み | 30秒+  | 2-3秒     | 10倍高速 |
| メモリ使用量     | 500MB+ | 100MB以下 | 80%削減  |
| エラー検出       | O(n²)  | 削除      | -        |
| 依存関係分析     | O(n²)  | O(n)      | 大幅改善 |

## 🚧 今後の実装予定

### 短期（1-2週間）

- [ ] AI Compressタブをトップレベルに追加
- [ ] 圧縮機能の独立ツール化
- [ ] バッチ処理の最適化

### 中期（1ヶ月）

- [ ] 大規模プロジェクト対応（1000ファイル以上）
- [ ] リアルタイムプレビュー機能
- [ ] カスタムフィルタリング設定

### 長期（3ヶ月）

- [ ] VSCode拡張機能化
- [ ] CLI版の開発
- [ ] チーム共有機能

## 💡 開発時の注意

### エラー対応の基本

1. 現在のファイルを確認してから修正
2. エラーメッセージを完全に理解
3. 既存ファイルの構造を把握

### PowerShell特有のコマンド

```powershell
# ファイル削除
Remove-Item -Path ".next" -Recurse -Force

# Git Bashなら通常のLinuxコマンド
rm -rf .next
```

### よくあるエラーと対処

1. **Module not found** → `npm install [パッケージ名]`
2. **Type error** → TypeScript設定を緩める
3. **Tailwind not working** → .nextフォルダ削除して再ビルド

## 🎉 成果

- **処理速度**: 10倍高速化達成
- **コード削減**: エラー検出機能削除で約1000行削減
- **メンテナンス性**: シンプル化により大幅向上
- **ユーザー体験**: レスポンシブで快適な操作性

## 📝 メモ

- エラー検出は不要と判断し削除
- node_modulesは最初から読み込まない設計に変更
- 圧縮機能が最も価値のある機能
- シンプルさと速度を最優先

---

_このドキュメントは随時更新されます_
