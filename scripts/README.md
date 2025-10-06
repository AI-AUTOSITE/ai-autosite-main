# NPM Scripts Documentation

## Development

### `npm run dev`
開発サーバーを起動（ホットリロード有効）
- URL: http://localhost:3000
- 自動リロード対応

### `npm run clean-dev`
キャッシュをクリアして開発サーバー起動
- エラーが出た時に使用
- `.next` と `node_modules/.cache` を削除

---

## Build & Production

### `npm run build`
プロダクションビルドを作成
- Vercelで自動実行される
- デプロイ前のテストに使用

### `npm run start`
プロダクションサーバーを起動
- `npm run build` 後に実行
- 本番環境の動作確認用

---

## Code Quality

### `npm run format`
すべてのコードを自動フォーマット
- コミット前に実行推奨
- Prettierを使用

### `npm run format:check`
フォーマットが必要か確認のみ（変更なし）
- CI/CDで使用
- コミット前の確認用

### `npm run lint`
ESLintでコードチェック
- 構文エラーや問題を検出

### `npm run fix-all`
フォーマット + Lint修正を一括実行
- コミット前の最終チェック
- `format` と `lint --fix` を自動実行

---

## Debugging

### `npm run find-console`
プロジェクト内のconsole文を検索
- console.log/error/warn等をすべて検出
- ファイルと行番号を表示

### `npm run remove-console`
開発用のconsole文を自動削除
- console.log/debug/info/tableを削除
- console.error と console.warn は保護される
- 本番デプロイ前に実行

---

## Utilities

### `npm run clean`
ビルドキャッシュをクリア
- `.next` フォルダ削除
- `node_modules/.cache` 削除

### `npm run check-tools`
ツール差分チェック（カスタムスクリプト）
- プロジェクト固有の確認処理

---

## Recommended Workflow

### 日常的な開発
```bash
npm run dev
```

### エラーが出た時
```bash
npm run clean-dev
```

### コミット前
```bash
npm run fix-all
git add .
git commit -m "feat: 新機能追加"
```

### 本番デプロイ前
```bash
npm run remove-console
npm run format
npm run build
git push
```

---

## Tips

- **自動保存フォーマット**: VSCodeで保存時に自動フォーマット有効
- **ESLint自動修正**: VSCodeで保存時にLint自動修正有効
- **console.log検索**: 定期的に `find-console` を実行して確認