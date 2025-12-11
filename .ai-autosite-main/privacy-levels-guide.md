# Privacy Levels Guide - プライバシーレベル別開発ガイド

**Version: 1.0**  
**Created: November 26, 2025**  
**Language: Japanese / English**

---

## 📋 目次

1. [概要](#概要)
2. [ドメイン戦略](#ドメイン戦略)
3. [Level 0: ゼロプライバシー型](#level-0-ゼロプライバシー型)
4. [Level 1: 匿名利用型](#level-1-匿名利用型)
5. [Level 2: 軽度認証型](#level-2-軽度認証型)
6. [Level 3: フル機能型](#level-3-フル機能型)
7. [判断フローチャート](#判断フローチャート)
8. [技術スタック比較](#技術スタック比較)
9. [法的考慮事項](#法的考慮事項)
10. [移行ガイド](#移行ガイド)
11. [チェックリスト](#チェックリスト)

---

## 概要

### なぜプライバシーレベルを分けるのか？

```
リスク管理 × 学習効率 × ユーザー信頼 = 最適な開発戦略
```

個人情報の取り扱いは、以下の観点で段階的に考える必要があります。

| 観点 | Level 0 | Level 1 | Level 2 | Level 3 |
|------|---------|---------|---------|---------|
| **法的責任** | ほぼなし | 軽微 | 中程度 | 重大 |
| **技術的複雑性** | 低 | 低〜中 | 中 | 高 |
| **運用コスト** | $0 | $0〜10 | $0〜30 | $50〜200+ |
| **ユーザー信頼** | 最高 | 高 | 中 | 要構築 |
| **収益化可能性** | 広告のみ | 限定的 | 中程度 | 高 |

### 基本原則

```yaml
1. 最小収集原則: 必要最小限のデータのみ収集
2. 目的明示原則: 収集目的を明確に説明
3. 分離原則: ドメインごとにプライバシーレベルを分離
4. 段階的移行: Level 0 → 1 → 2 → 3 と段階的に学習
```

---

## ドメイン戦略

### 現在の構成

```
┌─────────────────────────────────────────────────────────┐
│  ai-autosite.com                                        │
│  ├─ Level: 0 (ゼロプライバシー)                          │
│  ├─ 目的: 完全プライバシー保護ツール群                    │
│  ├─ ブランディング: "追跡なし、登録なし、安心"            │
│  └─ 収益: 広告収入 (プライバシー重視広告のみ)             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  feelsin.com ("Feel + Sin" = 人の代わりに)              │
│  ├─ Level: 1 → 2 (段階的移行)                           │
│  ├─ 目的: データ管理学習、動的サービス                    │
│  ├─ Phase 1: 匿名利用 (Level 1)                         │
│  ├─ Phase 2: ユーザー認証 (Level 2)                     │
│  └─ 収益: フリーミアム、有料プラン                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [future-domain].com (将来)                             │
│  ├─ Level: 3 (フル機能)                                 │
│  ├─ 目的: 本格SaaS                                      │
│  └─ 収益: サブスクリプション                             │
└─────────────────────────────────────────────────────────┘
```

### ドメイン選定基準

```typescript
// 新機能を追加する際の判断基準
function selectDomain(feature: Feature): Domain {
  // 1. データ保存が必要か？
  if (!feature.requiresDataStorage) {
    return 'ai-autosite.com'; // Level 0
  }
  
  // 2. ユーザー認証が必要か？
  if (!feature.requiresAuthentication) {
    return 'feelsin.com'; // Level 1
  }
  
  // 3. メールアドレス以外の個人情報が必要か？
  if (feature.requiresOnlyEmail) {
    return 'feelsin.com'; // Level 2
  }
  
  // 4. 決済や詳細な個人情報が必要
  return 'future-saas.com'; // Level 3
}
```

---

## Level 0: ゼロプライバシー型

### 適用ドメイン
**ai-autosite.com**

### 定義

```yaml
個人情報収集: ❌ 一切なし
データ保存: ❌ なし (ブラウザメモリのみ)
外部通信: ❌ なし (ユーザーデータ関連)
追跡/分析: ❌ なし
Cookie: ❌ なし
認証: ❌ なし
```

### 絶対に禁止されるもの

```typescript
// ❌ 永続ストレージ - 絶対禁止
localStorage.setItem('key', 'value');
sessionStorage.setItem('key', 'value');
document.cookie = 'name=value';
indexedDB.open('database');

// ❌ ユーザー追跡 - 絶対禁止
// Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>

// Facebook Pixel
fbq('track', 'PageView');

// その他のトラッキング
const userId = crypto.randomUUID(); // ユーザーID生成

// ❌ 外部へのユーザーデータ送信 - 絶対禁止
fetch('/api/save', { body: JSON.stringify(userData) });
```

### 許可されるもの

```typescript
// ✅ React State (メモリのみ、リロードで消える)
const [text, setText] = useState('');
const [result, setResult] = useState(null);

// ✅ 一時変数
let processedData = transform(input);
const count = text.length;

// ✅ ローカルファイル操作 (ユーザー選択)
const file = event.target.files[0];
const content = await file.text();

// ✅ ダウンロード (ユーザーのデバイスへ)
const blob = new Blob([result], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'result.txt';
a.click();

// ✅ クリップボード操作
await navigator.clipboard.writeText(text);

// ✅ Canvas/SVG 生成
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// ✅ Web Workers (処理用)
const worker = new Worker('processor.js');

// ✅ 静的アセット読み込み
// CDN経由のライブラリ
// Google Fonts
// 画像・アイコン
```

### 適したツール例

| カテゴリ | ツール例 |
|---------|---------|
| **テキスト処理** | 文字数カウント、テキスト変換、Lorem Ipsum生成 |
| **画像処理** | 画像圧縮、形式変換、QRコード生成(静的) |
| **計算ツール** | BMI計算、単位変換、パーセント計算 |
| **開発ツール** | JSON整形、Base64変換、UUID生成 |
| **学習ツール** | ポモドーロタイマー、コーネルノート |

### プライバシーポリシー (最小限)

```markdown
# プライバシーポリシー

## 収集する情報
当サイトは、ユーザーの個人情報を一切収集しません。

## データの保存
すべての処理はブラウザ内で完結し、サーバーにデータは送信されません。
ページをリロードすると、入力した内容はすべて消去されます。

## Cookie
当サイトはCookieを使用しません。

## 第三者サービス
ユーザーデータを第三者に提供することはありません。

## お問い合わせ
[連絡先]
```

### 技術スタック

```json
{
  "frontend": "Next.js 14 (App Router)",
  "styling": "Tailwind CSS v3",
  "hosting": "Vercel (無料)",
  "backend": "なし",
  "database": "なし",
  "auth": "なし",
  "analytics": "なし",
  "monthly_cost": "$0"
}
```

---

## Level 1: 匿名利用型

### 適用ドメイン
**feelsin.com (Phase 1)**

### 定義

```yaml
個人情報収集: ⚠️ なし (匿名IDのみ)
データ保存: ✅ あり (個人特定不可)
外部通信: ✅ あり (データ保存用)
追跡/分析: ⚠️ 最小限 (機能に必要な範囲)
Cookie: ⚠️ 機能用のみ (トラッキング目的禁止)
認証: ❌ なし
```

### 許可されるデータ

```typescript
// ✅ 匿名データ - OK
interface AnonymousShortUrl {
  id: string;              // UUID (自動生成)
visitorId: string;       // 匿名識別子 (Cookie)
  shortCode: string;       // "abc123"
  originalUrl: string;     // "https://example.com"
  clickCount: number;      // 42
  createdAt: Date;         // 作成日時
  expiresAt: Date | null;  // 有効期限
}

// ✅ 匿名アクセスログ - OK
interface AnonymousClick {
  id: string;
  shortUrlId: string;
  timestamp: Date;
  referrer: string | null;  // どこから来たか
  userAgent: string | null; // ブラウザ情報
  // ❌ IPアドレスは保存しない
  // ❌ 位置情報は保存しない
}
```

### 禁止されるデータ

```typescript
// ❌ 個人特定可能データ - 禁止
interface ForbiddenData {
  email: string;           // ❌ メールアドレス
  name: string;            // ❌ 名前
  ipAddress: string;       // ❌ IPアドレス
  location: {              // ❌ 詳細な位置情報
    latitude: number;
    longitude: number;
  };
  deviceFingerprint: string; // ❌ デバイス指紋
}
```

### 機能用Cookieのルール

```typescript
// ✅ OK - 機能に必要なCookie
// 目的: 匿名ユーザーの作成したURLを識別
const visitorId = cookies().get('visitor_id');
if (!visitorId) {
  // 新規訪問者には匿名IDを発行
  cookies().set('visitor_id', crypto.randomUUID(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365, // 1年
    path: '/'
  });
}

// ❌ NG - トラッキング目的のCookie
cookies().set('tracking_id', userId);
cookies().set('last_visit', new Date().toISOString());
cookies().set('page_views', String(pageViews + 1));
```

### 適したツール例

| カテゴリ | ツール例 |
|---------|---------|
| **URL短縮** | 動的QRコード、短縮URL (ログインなし) |
| **共有** | 一時ファイル共有、クリップボード共有 |
| **投票** | 匿名投票、アンケート |
| **カウンター** | ページビューカウンター |

### データベース設計

```sql
-- 短縮URLテーブル
CREATE TABLE short_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(255),  -- 匿名識別子 (Cookie)
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- アクセスログテーブル
CREATE TABLE clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_url_id UUID REFERENCES short_urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT
  -- ❌ ip_address は保存しない
  -- ❌ location は保存しない
);

-- インデックス
CREATE INDEX idx_short_urls_short_code ON short_urls(short_code);
CREATE INDEX idx_short_urls_visitor_id ON short_urls(visitor_id);
CREATE INDEX idx_clicks_short_url_id ON clicks(short_url_id);
```

### プライバシーポリシー

```markdown
# プライバシーポリシー

## 収集する情報
- 作成された短縮URL
- アクセス日時
- リファラー (どのサイトから来たか)
- ブラウザ情報 (User-Agent)
- 匿名識別子 (Cookie)

## 収集しない情報
- メールアドレス
- 名前
- IPアドレス
- 位置情報
- その他の個人を特定できる情報

## Cookieの使用
当サイトは、機能提供のために以下のCookieを使用します:
- visitor_id: あなたが作成したURLを識別するための匿名ID

トラッキング目的のCookieは使用しません。

## データの保存期間
- 短縮URL: 作成から1年間、または有効期限まで
- アクセスログ: 90日間

## 第三者提供
ユーザーデータを第三者に提供することはありません。
法令に基づく場合を除きます。

## お問い合わせ
[連絡先]
```

### 技術スタック

```json
{
  "frontend": "Next.js 14 (App Router)",
  "styling": "Tailwind CSS v3",
  "hosting": "Vercel (無料)",
  "backend": "Next.js API Routes",
  "database": "Supabase PostgreSQL (無料枠)",
  "auth": "なし",
  "analytics": "自前 (最小限)",
  "monthly_cost": "$0"
}
```

---

## Level 2: 軽度認証型

### 適用ドメイン
**feelsin.com (Phase 2)**

### 定義

```yaml
個人情報収集: ✅ メールアドレスのみ
データ保存: ✅ あり (ユーザー紐付け)
外部通信: ✅ あり
追跡/分析: ✅ あり (機能に必要)
Cookie: ✅ あり (認証用)
認証: ✅ あり (メールログイン)
```

### 許可されるデータ

```typescript
// ✅ ユーザーテーブル
interface User {
  id: string;              // UUID
  email: string;           // メールアドレス (唯一の個人情報)
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // ❌ 名前は収集しない (任意入力も非推奨)
  // ❌ プロフィール画像は収集しない
}

// ✅ ユーザーに紐づくデータ
interface UserShortUrl {
  id: string;
  userId: string;          // ユーザーに紐付け
  shortCode: string;
  originalUrl: string;
  title: string | null;    // ユーザーが付けたタイトル
  clicks: Click[];
  createdAt: Date;
  updatedAt: Date;
}

// ✅ アクセス解析データ
interface Click {
  id: string;
  shortUrlId: string;
  timestamp: Date;
  referrer: string | null;
  userAgent: string | null;
  country: string | null;  // 国レベルのみ (都市は収集しない)
}
```

### 禁止されるデータ

```typescript
// ❌ 過度な個人情報 - 禁止
interface ForbiddenUserData {
  name: string;            // ❌ 名前
  phone: string;           // ❌ 電話番号
  address: string;         // ❌ 住所
  birthday: Date;          // ❌ 生年月日
  profileImage: string;    // ❌ プロフィール画像
  socialAccounts: {        // ❌ SNSアカウント
    twitter: string;
    facebook: string;
  };
}

// ❌ 詳細なトラッキング - 禁止
interface ForbiddenTracking {
  ipAddress: string;       // ❌ IPアドレス
  exactLocation: {         // ❌ 詳細な位置情報
    latitude: number;
    longitude: number;
    city: string;
  };
  deviceFingerprint: string; // ❌ デバイス指紋
  screenResolution: string;  // ❌ 画面解像度
  installedPlugins: string[]; // ❌ インストール済みプラグイン
}
```

### 認証実装

```typescript
// NextAuth.js v4 設定
// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    // ❌ SNSログインは使わない (追加の個人情報が紐づくため)
    // GoogleProvider, GitHubProvider など
  ],
  callbacks: {
    session: async ({ session, user }) => {
      // 最小限の情報のみ返す
      return {
        ...session,
        user: {
          id: user.id,
          email: user.email,
          // ❌ name, image は返さない
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 必須機能: アカウント削除

```typescript
// app/api/account/delete/route.ts

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = session.user.id;
  
  // トランザクションで全データを削除
  const { error } = await supabase.rpc('delete_user_completely', {
    p_user_id: userId
  });
  
  if (error) {
    return Response.json({ error: 'Failed to delete account' }, { status: 500 });
  }
  
  return Response.json({ success: true });
}

// Supabase Function
/*
CREATE OR REPLACE FUNCTION delete_user_completely(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- 関連データを先に削除
  DELETE FROM clicks WHERE short_url_id IN (
    SELECT id FROM short_urls WHERE user_id = p_user_id
  );
  DELETE FROM short_urls WHERE user_id = p_user_id;
  
  -- ユーザーを削除
  DELETE FROM users WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;
*/
```

### 必須機能: データエクスポート

```typescript
// app/api/account/export/route.ts

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = session.user.id;
  
  // ユーザーの全データを取得
  const { data: user } = await supabase
    .from('users')
    .select('id, email, created_at')
    .eq('id', userId)
    .single();
    
  const { data: shortUrls } = await supabase
    .from('short_urls')
    .select(`
      id,
      short_code,
      original_url,
      title,
      created_at,
      clicks (
        clicked_at,
        referrer,
        country
      )
    `)
    .eq('user_id', userId);
  
  const exportData = {
    exportedAt: new Date().toISOString(),
    user: {
      email: user?.email,
      createdAt: user?.created_at,
    },
    shortUrls: shortUrls || [],
  };
  
  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="my-data.json"',
    },
  });
}
```

### データベース設計

```sql
-- ユーザーテーブル (NextAuth.js 標準)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  -- ❌ name は追加しない
  -- ❌ image は追加しない
);

-- 短縮URLテーブル
CREATE TABLE short_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  title VARCHAR(255),
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- アクセスログテーブル
CREATE TABLE clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_url_id UUID REFERENCES short_urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  country VARCHAR(2)  -- 国コードのみ (JP, US など)
  -- ❌ ip_address は保存しない
  -- ❌ city は保存しない
);

-- Row Level Security (RLS)
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can view own short_urls" ON short_urls
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own short_urls" ON short_urls
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own short_urls" ON short_urls
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own short_urls" ON short_urls
  FOR DELETE USING (auth.uid() = user_id);
```

### プライバシーポリシー

```markdown
# プライバシーポリシー

最終更新日: [日付]

## 収集する情報

### 必須情報
- メールアドレス (アカウント作成・ログイン用)

### サービス利用情報
- 作成された短縮URL
- アクセス統計 (日時、リファラー、国)
- ブラウザ情報 (User-Agent)

## 収集しない情報
- 名前
- 住所
- 電話番号
- IPアドレス
- 詳細な位置情報 (都市レベル以下)
- デバイス固有識別子

## 利用目的
- サービスの提供・維持
- アカウント管理
- 不正利用の防止
- サービス改善

## データの保存期間
- アカウント情報: アカウント削除まで
- 短縮URL: 作成から1年間、またはアカウント削除まで
- アクセスログ: 90日間

## データの共有
以下の場合を除き、第三者にデータを提供しません:
- 法令に基づく場合
- ユーザーの同意がある場合

## ユーザーの権利

### アクセス権
設定画面から、保存されているデータを確認できます。

### データポータビリティ
「データエクスポート」機能で、すべてのデータをJSON形式でダウンロードできます。

### 削除権
「アカウント削除」機能で、アカウントと関連するすべてのデータを削除できます。

## セキュリティ
- 通信はすべてHTTPSで暗号化
- パスワードは保存しません (マジックリンク認証)
- データベースアクセスは最小権限の原則に基づく

## Cookie
以下のCookieを使用します:
- セッションCookie: ログイン状態の維持
- CSRF保護Cookie: セキュリティ対策

トラッキング目的のCookieは使用しません。

## お問い合わせ
プライバシーに関するお問い合わせ: [連絡先]

## 変更履歴
- [日付]: 初版作成
```

### 技術スタック

```json
{
  "frontend": "Next.js 14 (App Router)",
  "styling": "Tailwind CSS v3",
  "hosting": "Vercel (無料〜Pro)",
  "backend": "Next.js API Routes",
  "database": "Supabase PostgreSQL (無料〜Pro)",
  "auth": "NextAuth.js v4 (Email Provider)",
  "email": "Resend / SendGrid (無料枠)",
  "analytics": "自前 (最小限)",
  "monthly_cost": "$0〜30"
}
```

---

## Level 3: フル機能型

### 適用ドメイン
**[future-domain].com (将来)**

### 定義

```yaml
個人情報収集: ✅ メール + プロフィール + 支払情報
データ保存: ✅ あり (詳細なデータ)
外部通信: ✅ あり
追跡/分析: ✅ あり (詳細な分析)
Cookie: ✅ あり (認証 + 分析)
認証: ✅ あり (多要素認証)
決済: ✅ あり (Stripe等)
```

### 許可されるデータ

```typescript
// ユーザープロフィール
interface User {
  id: string;
  email: string;
  name: string | null;       // 任意
  company: string | null;    // 任意
  avatarUrl: string | null;  // 任意
  plan: 'free' | 'pro' | 'enterprise';
  stripeCustomerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 詳細な利用統計
interface UsageStats {
  userId: string;
  month: string;
  apiCalls: number;
  storageUsed: number;
  uniqueVisitors: number;
}

// 詳細なアクセスログ
interface DetailedClick {
  id: string;
  shortUrlId: string;
  timestamp: Date;
  referrer: string | null;
  userAgent: string | null;
  country: string | null;
  city: string | null;       // 都市レベルまでOK
  deviceType: string | null; // mobile, desktop, tablet
  browser: string | null;
  os: string | null;
}
```

### 必須対応事項

```yaml
法的対応:
  - 個人情報取扱事業者としての届出検討
  - プライバシーポリシー (詳細版)
  - 利用規約
  - 特定商取引法に基づく表記
  - GDPR対応 (EU向けの場合)

セキュリティ対応:
  - 多要素認証 (MFA)
  - 定期的なセキュリティ監査
  - ペネトレーションテスト
  - インシデント対応計画
  - データバックアップ・復旧計画

運用対応:
  - 24時間監視体制 (または外部委託)
  - SLA (サービスレベル契約)
  - カスタマーサポート体制
  - 定期的なセキュリティアップデート
```

### 技術スタック

```json
{
  "frontend": "Next.js 14 (App Router)",
  "styling": "Tailwind CSS v3",
  "hosting": "Vercel Pro / AWS",
  "backend": "Next.js + Express/Nest.js",
  "database": "PostgreSQL (有料プラン)",
  "auth": "Auth0 / Clerk",
  "payment": "Stripe",
  "email": "SendGrid / AWS SES",
  "analytics": "Mixpanel / Amplitude",
  "monitoring": "Sentry, DataDog",
  "monthly_cost": "$50〜200+"
}
```

### 備考

Level 3 は現時点では将来の計画です。
Level 0〜2 の経験を積んでから検討してください。

---

## 判断フローチャート

### 新機能の追加先を決める

```
新しい機能を追加したい
         │
         ▼
    データ保存が必要？
         │
    ┌────┴────┐
    │         │
   NO        YES
    │         │
    ▼         ▼
 Level 0   ユーザー認証が必要？
    │         │
    │    ┌────┴────┐
    │    │         │
    │   NO        YES
    │    │         │
    │    ▼         ▼
    │  Level 1  メールアドレスだけでOK？
    │              │
    │         ┌────┴────┐
    │         │         │
    │        YES        NO
    │         │         │
    │         ▼         ▼
    │      Level 2   Level 3
    │
    ▼
ai-autosite.com
```

### データの保存先を決める

```
このデータを保存してよいか？
         │
         ▼
    個人を特定できる？
         │
    ┌────┴────┐
    │         │
   NO        YES
    │         │
    ▼         ▼
 Level 1   メールアドレスのみ？
    │         │
    │    ┌────┴────┐
    │    │         │
    │   YES        NO
    │    │         │
    │    ▼         ▼
    │  Level 2   Level 3
    │              ↓
    │         (要検討)
    │
    ▼
feelsin.com (Phase 1)
```

---

## 技術スタック比較

| 項目 | Level 0 | Level 1 | Level 2 | Level 3 |
|------|---------|---------|---------|---------|
| **フロントエンド** | Next.js 14 | Next.js 14 | Next.js 14 | Next.js 14 |
| **スタイリング** | Tailwind v3 | Tailwind v3 | Tailwind v3 | Tailwind v3 |
| **バックエンド** | なし | API Routes | API Routes | API Routes + α |
| **データベース** | なし | Supabase 無料 | Supabase 無料/Pro | PostgreSQL Pro |
| **認証** | なし | なし | NextAuth.js | Auth0 / Clerk |
| **決済** | なし | なし | なし | Stripe |
| **メール** | なし | なし | Resend 無料 | SendGrid |
| **監視** | なし | なし | Vercel Analytics | Sentry + DataDog |
| **月額コスト** | $0 | $0 | $0〜30 | $50〜200+ |

---

## 法的考慮事項

### 個人情報保護法 (日本)

```yaml
Level 0:
  個人情報取扱事業者: ❌ 該当しない
  対応事項: プライバシーポリシー (最小限)

Level 1:
  個人情報取扱事業者: ❌ 通常は該当しない
  理由: 個人を特定できるデータを保有しないため
  対応事項: プライバシーポリシー

Level 2:
  個人情報取扱事業者: ⚠️ 5,000件超で該当の可能性
  対応事項:
    - プライバシーポリシー (詳細)
    - 利用目的の明示
    - 安全管理措置
    - 開示・訂正・削除への対応

Level 3:
  個人情報取扱事業者: ✅ 該当する可能性が高い
  対応事項:
    - 上記すべて
    - 個人情報保護管理者の設置
    - 従業者への教育
    - 定期的な監査
```

### GDPR (EU)

```yaml
Level 0-1:
  対応: 基本的に不要 (個人データを処理しないため)

Level 2:
  対応事項:
    - 同意の取得
    - データポータビリティ
    - 削除権 (忘れられる権利)
    - プライバシーポリシー (GDPR準拠)

Level 3:
  対応事項:
    - 上記すべて
    - DPO (データ保護責任者) の検討
    - 記録義務
    - データ処理影響評価
```

---

## 移行ガイド

### Level 0 → Level 1

```yaml
追加作業:
  1. Supabase プロジェクト作成
  2. データベーステーブル設計
  3. API Routes 実装
  4. プライバシーポリシー更新

変更点:
  - 外部通信の追加
  - 機能用Cookie の追加

注意点:
  - IPアドレスは保存しない
  - 個人特定可能データは保存しない
```

### Level 1 → Level 2

```yaml
追加作業:
  1. NextAuth.js 導入
  2. ユーザーテーブル追加
  3. Row Level Security (RLS) 設定
  4. アカウント削除機能
  5. データエクスポート機能
  6. プライバシーポリシー更新
  7. 利用規約作成

変更点:
  - メールアドレス収集
  - ユーザー紐付けデータ
  - 認証Cookie

注意点:
  - 必要以上の個人情報を収集しない
  - SNSログインは使わない (推奨)
  - 削除・エクスポート機能は必須
```

### Level 2 → Level 3

```yaml
追加作業:
  1. 決済システム導入 (Stripe)
  2. 詳細なユーザープロフィール
  3. チーム・組織機能
  4. 高度な分析機能
  5. 多要素認証
  6. セキュリティ監査
  7. 法的文書整備
  8. サポート体制構築

変更点:
  - 決済情報の取り扱い
  - 詳細な個人情報
  - 高度なトラッキング

注意点:
  - 専門家 (弁護士、セキュリティ) への相談推奨
  - 十分なテストと監査
  - インシデント対応計画
```

---

## チェックリスト

### Level 0 チェックリスト (ai-autosite.com)

```markdown
## 開発時チェック
- [ ] localStorage を使用していない
- [ ] sessionStorage を使用していない
- [ ] Cookie を設定していない
- [ ] IndexedDB を使用していない
- [ ] 外部APIへユーザーデータを送信していない
- [ ] Google Analytics を導入していない
- [ ] トラッキングスクリプトがない
- [ ] ユーザーIDを生成していない
- [ ] 個人情報入力フォームがない

## デプロイ前チェック
- [ ] React State のみでデータ管理
- [ ] すべての処理がブラウザ内で完結
- [ ] プライバシーポリシーがある (最小限)
```

### Level 1 チェックリスト (feelsin.com Phase 1)

```markdown
## 開発時チェック
- [ ] メールアドレスを収集していない
- [ ] IPアドレスを保存していない
- [ ] 詳細な位置情報を保存していない
- [ ] デバイス指紋を取得していない
- [ ] 匿名データのみ保存している
- [ ] 機能用Cookie のみ使用している

## デプロイ前チェック
- [ ] Supabase RLS が有効
- [ ] HTTPS が有効
- [ ] 環境変数が安全に管理されている
- [ ] プライバシーポリシーが更新されている
```

### Level 2 チェックリスト (feelsin.com Phase 2)

```markdown
## 開発時チェック
- [ ] メールアドレス以外の個人情報を収集していない
- [ ] SNSログインを使用していない (推奨)
- [ ] IPアドレスを保存していない
- [ ] 必要最小限のデータのみ収集
- [ ] Row Level Security (RLS) が有効
- [ ] アカウント削除機能がある
- [ ] データエクスポート機能がある

## デプロイ前チェック
- [ ] NextAuth.js が正しく設定されている
- [ ] セッションCookie が secure
- [ ] CSRF保護が有効
- [ ] プライバシーポリシーが詳細版
- [ ] 利用規約がある
```

---

## 参考リンク

### 法律・ガイドライン
- [個人情報保護法 (個人情報保護委員会)](https://www.ppc.go.jp/)
- [GDPR (European Commission)](https://ec.europa.eu/info/law/law-topic/data-protection_en)
- [特定商取引法ガイド (消費者庁)](https://www.no-trouble.caa.go.jp/)

### 技術ドキュメント
- [Supabase Docs](https://supabase.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Stripe Docs](https://stripe.com/docs)

---

## 変更履歴

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-26 | 初版作成 |

---

**このガイドに従って、安全で信頼されるサービスを構築しましょう！** 🔒✨
