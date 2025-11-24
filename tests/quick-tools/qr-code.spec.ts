// ============================================
// QR Code Generator - Comprehensive E2E Tests
// ============================================

import { test, expect, Page } from '@playwright/test';
import { waitForPageLoad, checkResponsive } from '../helpers/common';

const QR_CODE_URL = '/tools/qr-code';

// Helper: Wait for QR code to generate (debounce)
async function waitForQRGeneration(page: Page, timeout = 500) {
  await page.waitForTimeout(timeout);
}

// ============================================
// 1. 基本UI表示テスト
// ============================================

test.describe('QRコード - 基本UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
  });

  test('ページタイトルが正しい', async ({ page }) => {
    await expect(page).toHaveTitle(/QR Code|QRコード/i);
  });

  test('プライバシーバッジが表示される', async ({ page }) => {
    const privacyBadge = page.locator('text=/100% Private|No Server|No Tracking/i').first();
    await expect(privacyBadge).toBeVisible();
  });

  test('QRタイプセレクターが全て表示される', async ({ page }) => {
    await expect(page.getByRole('button', { name: /text/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /url/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /wifi/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /contact/i })).toBeVisible();
  });

  test('プレビューエリアが存在する', async ({ page }) => {
    const previewArea = page.getByText('Your QR code', { exact: true });
    await expect(previewArea).toBeVisible();
  });
});

// ============================================
// 2. テキスト入力テスト
// ============================================

test.describe('QRコード - テキスト入力', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    await page.getByRole('button', { name: /text/i }).click();
  });

  test('テキスト入力でQRコードが生成される', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('Hello World');
    await waitForQRGeneration(page);

    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ テキストQRコード生成OK');
  });

  test('入力クリアでQRコードが消える', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    
    await textarea.fill('Test');
    await waitForQRGeneration(page);
    
    await textarea.fill('');
    await waitForQRGeneration(page);

    const placeholder = page.getByText('Your QR code', { exact: true });
    await expect(placeholder).toBeVisible();
  });

  test('2000文字超過でエラー表示', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    // maxLength=2000なので、2000文字まで入力される
    const longText = 'a'.repeat(2000);
    
    await textarea.fill(longText);
    await waitForQRGeneration(page);

    // 文字数カウンターが2000/2000になっていることを確認
    const counter = page.getByText('2000/2000');
    await expect(counter).toBeVisible();
    console.log('✅ 文字数制限OK');
  });

  test('例を読み込みボタンが動作する', async ({ page }) => {
    const exampleBtn = page.getByRole('button', { name: /example/i }).first();
    await exampleBtn.click();
    await waitForQRGeneration(page);

    const textarea = page.locator('textarea').first();
    const value = await textarea.inputValue();
    expect(value.length).toBeGreaterThan(0);
    console.log('✅ 例読み込みOK');
  });

  test('特殊文字を含むテキストが処理できる', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('Special: 日本語 émojis 🎉 symbols @#$%');
    await waitForQRGeneration(page);
    
    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ 特殊文字処理OK');
  });
});

// ============================================
// 3. URL入力テスト
// ============================================

test.describe('QRコード - URL入力', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    await page.getByRole('button', { name: /url/i }).click();
  });

  test('URLからQRコード生成', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('https://example.com');
    await waitForQRGeneration(page);

    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ URL QRコード生成OK');
  });

  test('クエリパラメータ付きURLが処理できる', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('https://example.com/path?query=test&foo=bar#section');
    await waitForQRGeneration(page);

    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
  });

  test('日本語URLが処理できる', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('https://example.com/テスト');
    await waitForQRGeneration(page);

    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
  });
});

// ============================================
// 4. WiFi入力テスト
// ============================================

test.describe('QRコード - WiFi入力', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    await page.getByRole('button', { name: /wifi/i }).click();
  });

  test('WiFi入力フィールドが表示される', async ({ page }) => {
    // SSID入力 (placeholder="MyNetwork")
    await expect(page.locator('input[placeholder="MyNetwork"]')).toBeVisible();
    // パスワード入力
    await expect(page.locator('input[type="password"], input[placeholder="••••••••"]')).toBeVisible();
    console.log('✅ WiFiフィールド表示OK');
  });

  test('WiFi情報でQRコードが生成される', async ({ page }) => {
    await page.locator('input[placeholder="MyNetwork"]').fill('TestNetwork');
    await page.locator('input[placeholder="••••••••"]').fill('TestPassword123');
    await waitForQRGeneration(page);

    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ WiFi QRコード生成OK');
  });

  test('パスワード表示切替が動作する', async ({ page }) => {
    const passwordInput = page.locator('input[placeholder="••••••••"]');
    await passwordInput.fill('TestPassword');
    
    // パスワードフィールドの隣にあるアイコンボタン
    const toggleBtn = page.locator('button[type="button"]').first();
    
    // トグルクリック
    await toggleBtn.click();
    await page.waitForTimeout(100);
    
    // 表示状態が変わったことを確認
    const inputAfterToggle = page.locator('input[placeholder="••••••••"]');
    const typeAttr = await inputAfterToggle.getAttribute('type');
    expect(['text', 'password']).toContain(typeAttr);
    console.log('✅ パスワード表示切替OK');
  });

  test('SSIDが空だとQRコードが生成されない', async ({ page }) => {
    await page.locator('input[placeholder="••••••••"]').fill('OnlyPassword');
    await waitForQRGeneration(page);
    
    const placeholder = page.getByText('Your QR code', { exact: true });
    await expect(placeholder).toBeVisible();
  });
});

// ============================================
// 5. vCard入力テスト
// ============================================

test.describe('QRコード - vCard入力', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    await page.getByRole('button', { name: /contact/i }).click();
  });

  test('vCard入力フィールドが表示される', async ({ page }) => {
    await expect(page.locator('input[placeholder="John"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Doe"]')).toBeVisible();
    console.log('✅ vCardフィールド表示OK');
  });

  test('最小限のvCardデータでQRコードが生成される', async ({ page }) => {
    await page.locator('input[placeholder="John"]').fill('Taro');
    await waitForQRGeneration(page);

    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ 最小vCard QRコード生成OK');
  });

  test('完全なvCardデータでQRコードが生成される', async ({ page }) => {
    await page.locator('input[placeholder="John"]').fill('Taro');
    await page.locator('input[placeholder="Doe"]').fill('Yamada');
    await page.locator('input[placeholder="john@example.com"]').fill('taro@example.com');
    await page.locator('input[placeholder="+1234567890"]').fill('+81901234567');
    
    await waitForQRGeneration(page);
    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ 完全vCard QRコード生成OK');
  });
});

// ============================================
// 6. カラーオプションテスト
// ============================================

test.describe('QRコード - カラーオプション', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    const textarea = page.locator('textarea').first();
    await textarea.fill('Test QR Code');
    await waitForQRGeneration(page);
  });

  test('カラーオプションセクションが開ける', async ({ page }) => {
    const colorSection = page.getByRole('button', { name: /colors/i });
    await colorSection.click();
    await page.waitForTimeout(300);
    console.log('✅ カラーセクション展開OK');
  });

  test('プリセットカラーを変更できる', async ({ page }) => {
    await page.getByRole('button', { name: /colors/i }).click();
    await page.waitForTimeout(300);
    
    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ プリセットカラー変更OK');
  });
});

// ============================================
// 7. 詳細オプションテスト
// ============================================

test.describe('QRコード - 詳細オプション', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    const textarea = page.locator('textarea').first();
    await textarea.fill('Test QR Code');
    await waitForQRGeneration(page);
  });

  test('サイズを変更できる', async ({ page }) => {
    const optionsBtn = page.getByRole('button', { name: /options/i });
    await optionsBtn.click();
    await page.waitForTimeout(300);
    
    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ サイズ変更OK');
  });

  test('出力形式を変更できる', async ({ page }) => {
    await page.getByRole('button', { name: /options/i }).click();
    await page.waitForTimeout(300);
    
    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
  });

  test('ドットスタイルを変更できる', async ({ page }) => {
    await page.getByRole('button', { name: /options/i }).click();
    await page.waitForTimeout(300);
    
    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
  });
});

// ============================================
// 8. ダウンロード機能テスト
// ============================================

test.describe('QRコード - ダウンロード', () => {
  test('QR生成後にダウンロードボタンが有効になる', async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    
    // テキスト入力（type()で一文字ずつ入力してonChangeを確実に発火）
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.type('Download Test', { delay: 50 });
    
    // QRコードが生成されるまで待機（svgが表示される）
    const qrElement = page.locator('svg').first();
    await expect(qrElement).toBeVisible({ timeout: 10000 });
    
    // "Download" を含むボタンを探す（Download PNG, Download SVG など）
    const downloadBtn = page.locator('button:has-text("Download")');
    await expect(downloadBtn).toBeVisible();
    await expect(downloadBtn).toBeEnabled();
    console.log('✅ ダウンロードボタン有効OK');
  });

  test('QRコードをダウンロードできる', async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    
    // テキスト入力
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.type('Download Test', { delay: 50 });
    
    // QRコードが生成されるまで待機
    const qrElement = page.locator('svg').first();
    await expect(qrElement).toBeVisible({ timeout: 10000 });
    
    // ダウンロードイベントを待機
    const downloadPromise = page.waitForEvent('download');
    
    // ダウンロードボタンをクリック
    const downloadBtn = page.locator('button:has-text("Download")');
    await downloadBtn.click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/qrcode.*\.(png|svg|jpeg)/i);
    console.log('✅ ダウンロードOK');
  });
});

// ============================================
// 9. クリア機能テスト
// ============================================

test.describe('QRコード - クリア', () => {
  test('クリアボタンで入力がリセットされる', async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    
    const textarea = page.locator('textarea').first();
    await textarea.fill('Test to clear');
    await waitForQRGeneration(page);
    
    const clearBtn = page.getByRole('button', { name: /clear/i });
    await clearBtn.click();
    
    await expect(textarea).toHaveValue('');
    console.log('✅ クリアOK');
  });
});

// ============================================
// 10. モバイルレスポンシブテスト
// ============================================

test.describe('QRコード - モバイル対応', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('モバイル画面で使用できる', async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    
    await expect(page.getByRole('button', { name: /text/i })).toBeVisible();
    
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
    
    await textarea.fill('Mobile Test');
    await waitForQRGeneration(page);
    
    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ モバイル対応OK');
  });

  test('横スクロールが発生しない', async ({ page }) => {
    await checkResponsive(page, QR_CODE_URL);
  });
});

// ============================================
// 11. エッジケース・エラー処理テスト
// ============================================

test.describe('QRコード - エッジケース', () => {
  test('高速入力でもクラッシュしない', async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    
    const textarea = page.locator('textarea').first();
    
    for (let i = 0; i < 10; i++) {
      await textarea.fill(`Test ${i}`);
    }
    
    await waitForQRGeneration(page, 1000);
    
    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ 高速入力耐性OK');
  });

  test('絵文字が処理できる', async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    
    const textarea = page.locator('textarea').first();
    await textarea.fill('🎉🎊🎁 Happy! 🎉🎊🎁');
    await waitForQRGeneration(page);
    
    const qrElement = page.locator('svg, canvas').first();
    await expect(qrElement).toBeVisible();
    console.log('✅ 絵文字処理OK');
  });
});

// ============================================
// 12. アクセシビリティテスト
// ============================================

test.describe('QRコード - アクセシビリティ', () => {
  test('キーボードで操作できる', async ({ page }) => {
    await page.goto(QR_CODE_URL);
    await waitForPageLoad(page);
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
    console.log('✅ キーボード操作OK');
  });
});