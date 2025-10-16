# PDF to Data Tool - モバイル対応版（履歴機能なし）

## 📱 概要
PDF to Data ツールのモバイル・タブレット完全対応版です。  
個人情報保護のため、履歴機能を削除したシンプルで安全な実装になっています。

## 🔄 ファイルの置き換え方法

各ファイルを以下のディレクトリに配置してください：

### 📂 ディレクトリ構造
```
app/tools/pdf-to-data/
├── components/
│   ├── PdfToDataTool.tsx    ← 1_PdfToDataTool.tsx
│   ├── DropZoneStates.tsx   ← 4_DropZoneStates.tsx
│   ├── CustomFieldsModal.tsx ← 5_CustomFieldsModal.tsx
│   ├── PreviewModal.tsx     ← 6_PreviewModal.tsx
│   ├── ErrorMessage.tsx     ← 7_ErrorMessage.tsx
│   └── PrivacyNotice.tsx    ← 8_PrivacyNotice.tsx
├── hooks/
│   └── usePdfProcessor.ts   ← 2_usePdfProcessor.ts
├── constants/
│   └── index.ts             ← 3_index.ts
└── page.tsx                 (変更なし)
```

## 📝 ファイル説明

| ファイル番号 | ファイル名 | 説明 | 重要な変更点 |
|------------|-----------|------|------------|
| 1 | PdfToDataTool.tsx | メインコンポーネント | 履歴機能削除、ボタンサイズ最適化 |
| 2 | usePdfProcessor.ts | ロジック処理フック | localStorage関連コード削除 |
| 3 | index.ts | 定数定義 | HISTORY_CONFIG削除、エラーメッセージ簡潔化 |
| 4 | DropZoneStates.tsx | ドラッグ&ドロップUI | タップ対応、レスポンシブアイコン |
| 5 | CustomFieldsModal.tsx | カスタムフィールド設定 | フルスクリーン対応（モバイル） |
| 6 | PreviewModal.tsx | データプレビュー | 横スクロール対応 |
| 7 | ErrorMessage.tsx | エラー表示 | タップ領域拡大（44px） |
| 8 | PrivacyNotice.tsx | プライバシー通知 | コンパクト化 |

## ✅ 主な改善点

### モバイル対応
- 全ボタンを最小44×44pxに統一（タップしやすく）
- モーダルはモバイルでボトムシート表示
- テキストを簡潔化（"Download CSV" → "CSV"）
- 文字化け修正（`â€¢` → `•`）

### プライバシー
- 履歴機能を完全削除
- localStorageへのアクセスなし
- 個人情報を一切保存しない

### UI/UX
- レスポンシブデザイン強化
- プレビューテーブルの横スクロール対応
- エラーメッセージの簡潔化
- "or click to browse" → "or tap to browse"

## 🚨 削除したファイル
- `HistoryModal.tsx` - 不要（履歴機能削除のため）

## 🎯 テストポイント

### モバイル端末
- [ ] iPhone SE（最小画面）でボタンがタップ可能か
- [ ] ファイル選択がタップで開くか
- [ ] モーダルがフルスクリーン表示されるか

### タブレット
- [ ] iPad でレイアウトが適切か
- [ ] ボタンが横並びになるか
- [ ] モーダルが中央表示されるか

### 機能テスト
- [ ] PDFファイルのアップロード
- [ ] カスタムフィールドの設定
- [ ] CSVとExcelのダウンロード
- [ ] プレビュー表示
- [ ] エラー表示

## 💡 注意事項

1. **APIルート**は変更不要です（`/api/pdf-to-data/route.ts`）
2. **page.tsx**も変更不要です
3. 履歴機能の復活を希望する場合は、元のファイルをバックアップしてください

## 📌 実装完了後

実装後、以下を確認してください：

```bash
# ビルドエラーがないか確認
npm run build

# 開発サーバーで動作確認
npm run dev
```

問題があれば、エラーメッセージをお知らせください。