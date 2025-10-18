# 🛡️ AI Tool Warning Modal 実装ガイド

**バージョン:** 1.1  
**最終更新:** 2025年10月18日  
**対象:** AI AutoSite プロジェクト

---

## 📚 目次

1. [概要](#概要)
2. [なぜこのモーダルが必要なのか](#なぜこのモーダルが必要なのか)
3. [アーキテクチャ](#アーキテクチャ)
4. [実装方法](#実装方法)
5. [ちらつき問題の対処](#ちらつき問題の対処)
6. [ベストプラクティス](#ベストプラクティス)
7. [トラブルシューティング](#トラブルシューティング)
8. [チェックリスト](#チェックリスト)

---

## 概要

AI Tool Warning Modal は、Claude API を使用するツールで必須の警告システムです。ユーザーがAIツールを使用する前に、データの取り扱いについて同意を得るための仕組みを提供します。

### 主な機能

- ✅ 初回アクセス時に警告モーダルを表示
- ✅ ユーザーの同意をlocalStorageに保存
- ✅ 同意後はツールが使用可能
- ✅ キャンセル時はトップページにリダイレクト
- ✅ 次回訪問時はモーダルを表示しない
- ✅ ページリロード時のちらつきを防止

---

## なぜこのモーダルが必要なのか

### 法的・倫理的理由

1. **透明性の確保**
   - ユーザーのデータがClaude APIに送信されることを明示
   - データの取り扱いについて事前に説明

2. **責任の明確化**
   - ユーザーが機密情報をアップロードしないよう警告
   - 利用規約への同意を取得

3. **信頼性の向上**
   - プライバシーを尊重する姿勢を示す
   - ユーザーに安心感を与える

### ユーザー保護

| アップロードしてはいけないもの | 理由 |
|---------------------------|------|
| 個人情報 | プライバシー侵害のリスク |
| 医療記録 | 法的規制（HIPAA等） |
| 機密ビジネスデータ | 企業秘密の漏洩 |
| 法的文書 | 弁護士・依頼者間の秘匿特権 |
| トレードシークレット | 知的財産の保護 |
| 顧客データ | GDPR/CCPA違反のリスク |
| プロプライエタリコード | 著作権侵害 |
| 金融情報 | PCI DSS違反 |

---

## アーキテクチャ

このシステムは3つのコンポーネントで構成されています：
```
┌─────────────────────────────────────────┐
│  AI Tool Page (例: AIProjectVisualizer) │
│  ├─ useAIToolWarning() フック           │
│  ├─ AIToolWarningModal コンポーネント   │
│  └─ 条件分岐ロジック                    │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  useAIToolWarning.ts                    │
│  ├─ localStorage 管理                   │
│  ├─ モーダル表示状態                    │
│  ├─ isChecking 状態（ちらつき防止）     │
│  └─ 同意/拒否ハンドラー                 │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  AIToolWarningModal.tsx                 │
│  ├─ createPortal で document.body へ    │
│  ├─ z-index: 100000                     │
│  └─ 警告内容の表示                      │
└─────────────────────────────────────────┘
```

## 🎯 実装における必須仕様

### ローディング表示は必ずドット形式

全てのAIツールで以下のローディング表示を使用してください：
```tsx
if (isChecking) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {/* ✅ ドット表示（必須） */}
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="mt-6 text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

```

### なぜドット表示なのか？

1. **一貫性** - 全AIツールで同じUX
2. **ブランディング** - purple/pink/cyanのブランドカラー
3. **軽量** - 一瞬しか表示されないので最適
4. **シンプル** - メンテナンスが容易

### ❌ 使用禁止

以下のスタイルは使用しないでください：
- スピナー（回転する円）
- アイコン付きローディング
- 独自のカスタムローディング
- その他の代替スタイル

---

## 実装方法

### ステップ 1: フックの作成

**ファイル:** `app/hooks/useAIToolWarning.ts`
```typescript
// app/hooks/useAIToolWarning.ts
'use client'

import { useState, useEffect } from 'react'

export function useAIToolWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isChecking, setIsChecking] = useState(true) // ✅ ちらつき防止

  useEffect(() => {
    // localStorageから同意状態を確認
    const agreed = localStorage.getItem('ai_tool_warning_agreed')
    if (agreed === 'true') {
      setHasAgreed(true)
    } else {
      // 未同意なら自動的にモーダル表示
      setShowWarning(true)
    }
    setIsChecking(false) // ✅ チェック完了
  }, [])

  const handleAgree = () => {
    localStorage.setItem('ai_tool_warning_agreed', 'true')
    setHasAgreed(true)
    setShowWarning(false)
  }

  const handleDisagree = () => {
    setShowWarning(false)
    // 同意しない場合はツールを使わせない
  }

  const resetAgreement = () => {
    localStorage.removeItem('ai_tool_warning_agreed')
    setHasAgreed(false)
    setShowWarning(true)
  }

  return {
    showWarning,
    hasAgreed,
    isChecking, // ✅ 追加
    handleAgree,
    handleDisagree,
    resetAgreement,
    setShowWarning,
  }
}
```

### ステップ 2: モーダルコンポーネントの作成

**ファイル:** `app/components/AIToolWarningModal.tsx`

**重要ポイント:**
- ✅ **createPortal を使用** - document.bodyに直接レンダリング
- ✅ **z-index: 100000** - 確実に最上位表示
- ✅ **mounted 状態管理** - SSR対応
- ✅ **bodyスクロール制御** - UX向上
- ✅ **ESCキーで閉じる** - アクセシビリティ
```tsx
// app/components/AIToolWarningModal.tsx
'use client'

import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface AIToolWarningModalProps {
  isOpen: boolean
  onAgree: () => void
  onDisagree: () => void
}

export default function AIToolWarningModal({
  isOpen,
  onAgree,
  onDisagree,
}: AIToolWarningModalProps) {
  const [mounted, setMounted] = useState(false)

  // SSR対応: マウント管理
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // ESCキーで閉じる
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDisagree()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onDisagree])

  // bodyのスクロール制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // マウント前、または閉じている場合は何も表示しない
  if (!mounted || !isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      style={{ zIndex: 100000 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onDisagree()
        }
      }}
    >
      
        <div
          className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-500/50 rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          
            
              
              
                
                  ⚠️ Important: AI Tool Safety Warning
                
                
                  Please read carefully before using this AI-powered tool
                
              
            
          

          {/* Content */}
          
            {/* データの扱いについて */}
            
              
                📤 What Happens to Your Data:
              
              
                Your input will be sent to Claude API (operated by Anthropic) for processing.
                While your data is not stored after processing, it temporarily passes through
                external servers.
              
            

            {/* アップロードしてはいけないもの */}
            
              
                ❌ DO NOT Upload:
              
              
                • Personal information
                • Medical records
                • Confidential business data
                • Legal documents
                • Trade secrets
                • Customer data
                • Proprietary code
                • Financial information
              
            

            {/* 安全に使えるもの */}
            
              
                ✅ Safe to Use With:
              
              
                • Sample or dummy data
                • Anonymized content
                • Public information
                • Generic questions
              
            

            {/* ユーザーの責任 */}
            
              
                ⚖️ Your Responsibility:
              
              
                You are solely responsible for ensuring the data you upload is
                appropriate and non-sensitive. We cannot guarantee what happens to data processed
                by third-party APIs.
              
            

            {/* 詳細情報リンク */}
            
              
                Read our Privacy Policy
              
              •
              
                AI Tools Safety Guide
              
            
          

          {/* Footer */}
          
            
              
                Cancel
              
              
                I Understand & Agree
              
            
            
              Your agreement will be saved locally. You won't see this message again on this device.
            
          
        
      
    
  )

  // ✅ CRITICAL: createPortal で document.body にレンダリング
  return createPortal(modalContent, document.body)
}
```

### ステップ 3: AIツールページでの実装

**ファイル:** `app/tools/[tool-name]/components/[ToolComponent].tsx`
```tsx
'use client'

import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

// Import AI Tool Warning
import { useAIToolWarning } from '@/hooks/useAIToolWarning'
import AIToolWarningModal from '@/components/AIToolWarningModal'

export default function YourAIToolComponent() {
  // ルーターを取得
  const router = useRouter()

  // AI Tool Warning フック
  const { showWarning, hasAgreed, isChecking, handleAgree, handleDisagree } = useAIToolWarning()

  // カスタム拒否ハンドラー（トップページにリダイレクト）
  const handleCustomDisagree = () => {
    handleDisagree()
    router.push('/')
  }

  // ... その他の状態とロジック ...

  // ✅ ローディング表示（ちらつき防止）
  if (isChecking) {
    return (
      
        
          
            
            
            
          
          Loading...
        
      
    )
  }

  return (
    <>
      {/* AI Tool Warning Modal */}
      

      {/* 同意していない場合の警告画面 */}
      {!hasAgreed ? (
        
          
            
              
              Agreement Required
              
                You must agree to the terms to use this AI-powered tool.
              
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all font-semibold shadow-lg"
              >
                Return to Home
              
            
          
        
      ) : (
        /* メインコンテンツ - 同意後のみ表示 */
        
          {/* ツールのUI */}
        
      )}
    </>
  )
}
```

---

## ちらつき問題の対処

### 🐛 問題: ページリロード時の一瞬のちらつき

**症状:**
```
同意済みでページをリロードすると、「Agreement Required」画面が
一瞬ちらついてから消える
```

**原因:**
- localStorageの確認が非同期で行われる
- `useEffect`が実行される前に、初期状態（`hasAgreed: false`）でレンダリングされる
- 結果として、未同意画面が一瞬表示されてしまう

---

### ✅ 解決方法: `isChecking` 状態の追加

#### ステップ 1: フックに `isChecking` を追加
```typescript
const [isChecking, setIsChecking] = useState(true) // ✅ 初期値は true

useEffect(() => {
  const agreed = localStorage.getItem('ai_tool_warning_agreed')
  if (agreed === 'true') {
    setHasAgreed(true)
  } else {
    setShowWarning(true)
  }
  setIsChecking(false) // ✅ チェック完了後に false にする
}, [])
```

#### ステップ 2: コンポーネントでローディング表示
```tsx
const { showWarning, hasAgreed, isChecking, handleAgree, handleDisagree } = useAIToolWarning()

// ✅ チェック中はローディング表示
if (isChecking) {
  return (
    
      
        {/* ドットローディング（推奨） */}
        
          
          
          
        
        Loading...
      
    
  )
}
```

---

### 🎨 ローディング表示（必須仕様）

#### ✅ **ドット表示**（全AIツールで統一）

**これが標準実装です。必ずこの形式を使用してください。**

```

---

### 📊 動作フロー
```
1. ページアクセス
   ↓
2. isChecking = true (初期状態)
   ↓
3. ローディング表示
   ↓
4. useEffect 実行
   ├─ localStorage 確認
   ├─ hasAgreed / showWarning 更新
   └─ isChecking = false
   ↓
5. 状態に応じた画面表示
   ├─ 同意済み → メインコンテンツ
   └─ 未同意 → 警告モーダル
```

---

### ⚠️ 重要な注意点

1. **初期値は必ず `true`**
```typescript
   const [isChecking, setIsChecking] = useState(true) // ✅ GOOD
   const [isChecking, setIsChecking] = useState(false) // ❌ BAD
```

2. **必ず `setIsChecking(false)` を実行**
```typescript
   useEffect(() => {
     // ... localStorage確認 ...
     setIsChecking(false) // ✅ 必須
   }, [])
```

3. **ローディング表示は簡潔に**
   - 一瞬しか表示されないので、シンプルなデザインで十分
   - 重いアニメーションは避ける

---

## ベストプラクティス

### 1. createPortal を必ず使用 🎯
```tsx
// ❌ BAD - stickyヘッダーに阻まれる可能性
return (
  
    {/* モーダルコンテンツ */}
  
)

// ✅ GOOD - document.bodyに直接レンダリング
return createPortal(modalContent, document.body)
```

**理由:**
- stickyヘッダーが新しいスタッキングコンテキストを作成
- createPortalでdocument.bodyにレンダリングすることで確実に最上位に表示

### 2. z-index は 100000 以上 📈
```tsx

```

**理由:**
- ヘッダー（z-50）より確実に上に表示
- 他のUI要素と競合しない

### 3. SSR対応: mounted 状態管理 🔄
```tsx
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
  return () => setMounted(false)
}, [])

if (!mounted || !isOpen) return null
```

**理由:**
- Next.jsのSSRでhydrationエラーを防ぐ
- サーバーとクライアントの不一致を回避

### 4. bodyスクロールの制御 🚫
```tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
  return () => {
    document.body.style.overflow = 'unset'
  }
}, [isOpen])
```

**理由:**
- モーダル表示中に背景がスクロールしない
- UX向上

### 5. ESCキーで閉じる ⌨️
```tsx
useEffect(() => {
  if (!isOpen) return

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onDisagree()
    }
  }

  document.addEventListener('keydown', handleEscape)
  return () => document.removeEventListener('keydown', handleEscape)
}, [isOpen, onDisagree])
```

**理由:**
- アクセシビリティの向上
- 一般的なUXパターンに従う

### 6. ちらつき防止は必須 ⚡
```tsx
const [isChecking, setIsChecking] = useState(true)

if (isChecking) {
  return <LoadingDisplay />
}
```

**理由:**
- ユーザー体験の向上
- プロフェッショナルな印象

### 7. ローディング表示はドット表示で統一 🎯
```tsx
// ✅ GOOD - 必ずこの形式を使う
if (isChecking) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="mt-6 text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

// ❌ BAD - スピナーやアイコンは使わない
if (isChecking) {
  return <div className="animate-spin">...</div> // 使用禁止
}
```

**理由:**
- 全AIツールで統一されたUX
- ブランドカラー（purple/pink/cyan）の活用
- シンプルで軽量
- メンテナンスが容易
---

## トラブルシューティング

### 問題 1: モーダルがヘッダーの下に隠れる

**症状:**
```
モーダルを開いても、stickyヘッダーの下に表示されてしまう
```

**原因:**
- createPortalを使用していない
- z-indexが低すぎる

**解決策:**
```tsx
// createPortalを使用
return createPortal(modalContent, document.body)

// z-indexを100000以上に

```

---

### 問題 2: Next.js hydration エラー

**症状:**
```
Error: Hydration failed because the initial UI does not match
```

**原因:**
- SSR時にモーダルがレンダリングされている

**解決策:**
```tsx
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null
```

---

### 問題 3: キャンセル後もツールが使える

**症状:**
```
Cancelボタンを押してもツールが操作できてしまう
```

**原因:**
- `hasAgreed` による条件分岐が実装されていない

**解決策:**
```tsx
{!hasAgreed ? (
  
) : (
  
)}
```

---

### 問題 4: ページリロード時に警告画面がちらつく ⚠️

**症状:**
```
同意済みなのに、リロード時に「Agreement Required」画面が一瞬表示される
```

**原因:**
- localStorageのチェックが完了する前にレンダリング
- `hasAgreed`の初期値が`false`のため

**解決策:**
```tsx
// フックに isChecking を追加
const [isChecking, setIsChecking] = useState(true)

useEffect(() => {
  const agreed = localStorage.getItem('ai_tool_warning_agreed')
  if (agreed === 'true') {
    setHasAgreed(true)
  } else {
    setShowWarning(true)
  }
  setIsChecking(false) // ✅ 必須
}, [])

// コンポーネントでローディング表示
if (isChecking) {
  return 
}
```

---

### 問題 5: localStorageがクリアされない

**症状:**
```
テスト時に常に同意済みになってしまう
```

**解決策:**
```javascript
// ブラウザのコンソールで実行
localStorage.removeItem('ai_tool_warning_agreed')
// または
localStorage.clear()
```

---

## チェックリスト

新しいAIツールに警告モーダルを実装する際、以下を確認してください：

### 必須項目 ✅

- [ ] `app/hooks/useAIToolWarning.ts` が存在する
- [ ] `app/components/AIToolWarningModal.tsx` が存在する
- [ ] ツールコンポーネントで `useRouter` をインポート
- [ ] ツールコンポーネントで `useAIToolWarning` をインポート
- [ ] ツールコンポーネントで `AIToolWarningModal` をインポート
- [ ] `handleCustomDisagree` を実装（トップページへリダイレクト）
- [ ] `AIToolWarningModal` に `onDisagree={handleCustomDisagree}` を渡す
- [ ] `hasAgreed` による条件分岐を実装
- [ ] 未同意時の警告画面を実装
- [ ] AlertTriangleアイコンをインポート
- [ ] **`isChecking` によるドット表示ローディングを実装**（必須・全ツールで統一）

### モーダルコンポーネント ✅

- [ ] `createPortal` を使用している
- [ ] `z-index: 100000` を設定している
- [ ] `mounted` 状態を管理している
- [ ] bodyスクロールを制御している
- [ ] ESCキーで閉じられる
- [ ] 背景クリックで閉じられる

### ツールページ ✅

- [ ] 同意前はツールが使えない
- [ ] キャンセル時はトップページにリダイレクト
- [ ] 同意後はツールが正常に使える
- [ ] 次回訪問時はモーダルが表示されない
- [ ] **ページリロード時にちらつかない**

### テスト ✅

- [ ] デスクトップで正常に動作する
- [ ] モバイルで正常に動作する
- [ ] ESCキーで閉じられる
- [ ] 背景クリックで閉じられる
- [ ] localStorageが正しく保存される
- [ ] ページリロード後も同意状態が保持される
- [ ] **スーパーリロードでちらつかない**

---

## 実装例

### 実装済みツール

以下のツールで既に実装されています（参考にしてください）：

1. ✅ **AI Project Visualizer** (`app/tools/ai-project-visualizer`)
2. ✅ **AI Summarizer** (`app/tools/ai-summarizer`)
3. 🔄 AI Resume Generator (次に実装予定)
4. 🔄 Code Roaster (次に実装予定)
5. 🔄 Debate Trainer (次に実装予定)
6. 🔄 PDF Summarizer (次に実装予定)
7. 🔄 PDF to Data (次に実装予定)
8. 🔄 Tech Stack Analyzer (次に実装予定)

---

## よくある質問 (FAQ)

### Q1: なぜlocalStorageを使うのか？

**A:** 
- サーバー側でユーザーの同意を管理する必要がない
- シンプルで実装が容易
- プライバシーを尊重（データは端末にのみ保存）

---

### Q2: cookieではなくlocalStorageを使う理由は？

**A:**
- サーバーへのリクエストごとにcookieを送信する必要がない
- GDPR等のcookie規制を気にしなくて良い
- シンプルなAPI

---

### Q3: 同意をリセットするには？

**A:**
```javascript
localStorage.removeItem('ai_tool_warning_agreed')
```

または開発者ツールでApplication > Local Storageから削除

---

### Q4: 全てのAIツールで共通のモーダルを使うのか？

**A:** 
はい。全てのAIツールで同じ警告モーダルを使用します。
- 一貫性のあるUX
- メンテナンスが容易
- 1度同意すれば全てのAIツールで有効

---

### Q5: モバイルでの表示は？

**A:**
レスポンシブデザインで最適化されています：
- モバイル: 縦並びレイアウト
- デスクトップ: 横並びレイアウト
- タッチフレンドリーなボタンサイズ

---

### Q6: ローディング表示はどれを使えば良い？

**A:**
**ドット表示が必須です**。他のスタイルは使用しないでください。

理由：
- 全AIツールで統一されたUX
- ブランドアイデンティティの維持
- シンプルで軽量
- ブランドカラー（purple/pink/cyan）を使用
```tsx
// ✅ これを必ず使う
<div className="flex gap-2">
  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
  <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
</div>
<p className="mt-6 text-gray-400 text-sm">Loading...</p>
---

### Q7: `isChecking`は必須？

**A:**
**必須です**。これがないと：
- 同意済みでもページリロード時に警告画面がちらつく
- ユーザー体験が大幅に低下
- プロフェッショナルな印象を損なう

---

## まとめ

✅ **3つのファイル**を作成：
1. `app/hooks/useAIToolWarning.ts`（`isChecking` 含む）
2. `app/components/AIToolWarningModal.tsx`
3. 各AIツールコンポーネント（ローディング表示含む）

✅ **createPortalを必ず使用**してstickyヘッダー問題を回避

✅ **z-index: 100000**で確実に最上位表示

✅ **SSR対応**でNext.jsのhydrationエラーを防ぐ

✅ **条件分岐**で同意前はツールを使わせない

✅ **キャンセル時はリダイレクト**でUX向上

✅ **`isChecking`でちらつき防止**でプロフェッショナルなUX

✅ **ドット表示ローディングで統一**（必須仕様）

---

## 参考資料

### 内部ドキュメント

- [プライバシーポリシー](/privacy-policy)
- [利用規約](/terms-of-service)
- [FAQ](/faq)
- [モーダル実装のベストプラクティス](./modal-best-practices.md)

### 外部リンク

- [React Portal 公式ドキュメント](https://react.dev/reference/react-dom/createPortal)
- [Next.js SSR](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

---

**最終更新:** 2025年10月18日  
**作成者:** AI AutoSite開発チーム  
**バージョン:** 1.1（ちらつき対策追加）

---

このガイドに従って実装すれば、全てのAIツールで一貫性のある警告システムを構築でき、ページリロード時のちらつきも完全に防止できます！🚀✨
