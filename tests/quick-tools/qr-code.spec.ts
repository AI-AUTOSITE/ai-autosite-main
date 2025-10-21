import { test, expect } from '@playwright/test';
import { waitForPageLoad, clickAndDownload, checkFileNotEmpty } from '../helpers/common';

test.describe('QRコード生成', () => {
  
  test('URLからQRコード生成', async ({ page }) => {
    await page.goto('/tools/qr-code');
    await waitForPageLoad(page);
    
    // URLを入力
    await page.fill('input[type="text"], input[type="url"]', 'https://example.com');
    
    // 生成ボタンをクリック
    await page.click('button:has-text("生成")');
    
    // QRコードが表示されるまで待つ
    await page.waitForSelector('canvas, img[alt*="QR"], svg', { timeout: 5000 });
    
    // QRコードが表示されているか
    const qrElement = await page.locator('canvas, img[alt*="QR"]').count();
    expect(qrElement).toBeGreaterThan(0);
    
    console.log('✅ QRコード生成OK');
  });
  
  test('QRコードをダウンロードできる', async ({ page }) => {
    await page.goto('/tools/qr-code');
    
    // URLを入力して生成
    await page.fill('input[type="text"]', 'https://example.com');
    await page.click('button:has-text("生成")');
    await page.waitForTimeout(1000);
    
    // ダウンロード
    const download = await clickAndDownload(page, 'ダウンロード');
    const path = await download.path();
    
    // ファイルが空でないか
    const fileSize = await checkFileNotEmpty(path!);
    console.log('✅ ダウンロードOK:', fileSize, 'bytes');
  });
});