📄 ファイル2: tool-properties-guide.md
markdown# ツールプロパティ・定義ガイド
**Version: 1.0**  
**最終更新: 2025-01-29**

## 📌 概要

本ドキュメントは、新規ツールの定義方法とプロパティの設定方法をまとめたものです。
統一された構造により、保守性とスケーラビリティを確保します。

### 関連ドキュメント

- [master-guide.md](./master-guide.md) - 開発の基本方針
- [metadata-seo-guide.md](./metadata-seo-guide.md) - メタデータ設定
- [ux-performance-guide.md](./ux-performance-guide.md) - UI実装

---

## 📝 ツールプロパティ定義

### 必須フィールド

```typescript
interface Tool {
  // === 必須フィールド ===
  id: string                // URLセーフなID (例: 'age-calculator')
  name: string              // ツール名 (例: 'Age Calculator')
  description: string       // 60文字以内、Simple English
  category: string          // カテゴリーファイル名と一致
  icon: string             // 絵文字アイコン
  color: string            // Tailwindグラデーション
  status: 'live' | 'coming' | 'maintenance'
  url: string              // '/tools/[id]'形式
  tags: string[]           // 検索用タグ配列
  difficulty: 'Instant' | 'Simple' | 'Intermediate' | 'Advanced'
  timeToUse: string        // 人間が読める形式

  // === オプショナルフィールド ===
  emoji?: string           // 追加の絵文字
  featured?: boolean       // 特集ツール
  new?: boolean           // 新着フラグ
  badge?: 'NEW' | 'HOT' | 'BETA' | 'AI' | 'COMING SOON' | 'MAINTENANCE'
  apiRequired?: boolean    // AI API使用
  pricing?: 'free' | 'freemium' | 'paid'
  dataProcessing?: 'local' | 'server' | 'hybrid'
  dependencies?: string[]  // 依存パッケージ
  configRequired?: boolean // 設定必要
  lastUpdated?: string    // YYYY-MM形式
  projectSource?: string  // ソースプロジェクト名
}
フィールド説明
id

URL安全な文字列
小文字とハイフンのみ
例: age-calculator, ai-resume

name

表示用のツール名
タイトルケース
例: Age Calculator, AI Resume

description

60文字以内
Simple English
機能を明確に
例: Calculate exact age in years, months, and days

category

カテゴリーファイル名と完全一致
business-tools, dev-tools, quick-tools, study-tools, creative-tools, learning-tools

icon / emoji

絵文字で視覚的に表現
1-2個まで
例: 🎂, 📊, 🤖

color

Tailwindグラデーションクラス
例: from-cyan-500 to-blue-500

status

live: 公開中
coming: 近日公開
maintenance: メンテナンス中

difficulty

Instant: クリックだけ
Simple: 1-2ステップ
Intermediate: 複数入力
Advanced: 設定が必要

timeToUse

人間が読める形式
例: 5 seconds, 2 minutes, 10 minutes


🏷️ バッジシステム
バッジタイプ
typescriptbadge?: 'NEW' | 'HOT' | 'BETA' | 'AI' | 'COMING SOON' | 'MAINTENANCE'
バッジ優先順位

AI - AI機能使用（最優先）
HOT - 人気急上昇
NEW - 新規追加
BETA - ベータ版
COMING SOON - 近日公開
MAINTENANCE - メンテナンス中

AIバッジの条件
AIバッジは以下の条件をすべて満たすツールに付与：
typescript{
  badge: 'AI',
  apiRequired: true,
  dataProcessing: 'server',
  pricing: 'freemium'
}
AIツール一覧（全6個）
ツールカテゴリーエンドポイントCompetitive Analyzerbusiness-tools/api/ai-analysisAI Resumebusiness-tools/api/ai-resumeCode Roasterdev-tools/api/code-roasterDebate Trainerstudy-tools/api/debateAI Summarizerstudy-tools/api/summarizePDF to Dataquick-tools/api/pdf-to-data
詳細は ai-tools-guide.md を参照

📁 カテゴリー別ファイル構成
app/lib/categories/
├── types.ts           # 型定義（マスター）
├── business-tools.ts  # ビジネスツール
├── creative-tools.ts  # クリエイティブツール
├── dev-tools.ts      # 開発者ツール
├── learning-tools.ts  # 学習ツール
├── quick-tools.ts    # クイックツール
├── study-tools.ts    # スタディツール
└── index.ts          # エクスポート統合
カテゴリー整合性ルール

categoryフィールドは必ずファイル名のプレフィックスと一致
重複ツールは絶対禁止
合計44個のツール管理
各カテゴリーに最低3個のツール


📋 ツール追加手順
Step 1: カテゴリーファイルに追加
typescript// app/lib/categories/[category].ts

export const [category]Tools: Tool[] = [
  // ... 既存ツール
  {
    id: 'new-tool',
    name: 'New Tool',
    description: 'Short description under 60 characters.',
    category: 'category-name',
    icon: '🔧',
    color: 'from-cyan-500 to-blue-500',
    status: 'live',
    url: '/tools/new-tool',
    tags: ['tag1', 'tag2', 'tag3'],
    difficulty: 'Simple',
    timeToUse: '1 minute',
    featured: false,
    new: true,
    pricing: 'free',
    dataProcessing: 'local'
  }
]
Step 2: ツールページ作成
bashmkdir app/tools/new-tool
mkdir app/tools/new-tool/components
touch app/tools/new-tool/page.tsx
touch app/tools/new-tool/components/NewToolClient.tsx
Step 3: メタデータ設定
→ metadata-seo-guide.md を参照
Step 4: サイトマップ登録
→ metadata-seo-guide.md を参照

Step 5: テスト
- ローカルで動作確認
- モバイル表示確認
- パフォーマンス測定
- アクセシビリティチェック

Step 6: モバイル互換性チェック（必須）
→ [mobile-optimization-guide.md](./mobile-optimization-guide.md) を参照

**機能的にモバイルで動作することが最優先**
- [ ] ライブラリがモバイル対応
- [ ] メモリ消費が許容範囲（< 100MB）
- [ ] ファイルサイズ制限設定（< 10MB）
- [ ] タッチ操作が可能
- [ ] **実機で動作確認（必須）**
- [ ] iOS Safariで確認
- [ ] Android Chromeで確認

Step 7: プライバシーチェック（必須）
→ [privacy-policy-guide.md](./privacy-policy-guide.md) を参照

**個人情報の取り扱いを確認**
- [ ] トラッキングコードを含まない
- [ ] 個人情報を保存しない
- [ ] 個人情報をサーバーに送信しない
- [ ] AI使用時は警告を表示している

Step 8: デプロイ
- GitHubへプッシュ
- Vercelで自動デプロイ
- 本番環境で最終確認

✅ 実装チェックリスト
新規ツール追加時

 カテゴリーファイルにツール定義追加
 idがユニークで URLセーフ
 descriptionが60文字以内
 categoryがファイル名と一致
 tagsが3-5個
 timeToUseが現実的
 ツールページ作成
 クライアントコンポーネント作成
 メタデータ設定
 サイトマップ登録
 ローカルテスト
 モバイル確認

AIツール追加時（追加項目）

 badge: 'AI' 設定
 apiRequired: true 設定
 dataProcessing: 'server' 設定
 pricing: 'freemium' 設定
 APIエンドポイント実装
 フォールバックロジック実装
 使用量制限設定
 エラーハンドリング実装
 コスト透明性表示
 ai-tools-guide.md に追加


🎨 デザインガイドライン
アイコン選択
DO ✅

機能を直感的に表現
一般的に認知されている絵文字
シンプルで分かりやすい

DON'T ❌

複雑すぎる絵文字
文化依存の絵文字
誤解を招く絵文字

カラー選択
推奨グラデーション
typescript// シアン系（汎用）
'from-cyan-500 to-blue-500'

// パープル系（AI/高度）
'from-purple-500 to-pink-500'

// グリーン系（成功/環境）
'from-green-500 to-emerald-500'

// オレンジ系（警告/活発）
'from-orange-500 to-red-500'

📊 ツール統計
カテゴリー別分布
カテゴリーツール数AIツールQuick Tools181Dev Tools121Study Tools63Business Tools42Creative Tools30Learning Tools10合計446

🔄 更新履歴
Ver日付内容1.02025-01-29初版作成（master-guideから分離）

新規ツール追加時は必ずこのガイドを参照してください
```
