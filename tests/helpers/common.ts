import { Page, expect } from '@playwright/test';

/**
 * ページの基本的な読み込み確認
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();
}

/**
 * 文字化けチェック
 */
export function checkForGarbledText(text: string): boolean {
  return text.includes('�') || text.includes('?????');
}

/**
 * エラーメッセージがないことを確認
 */
export async function checkNoErrors(page: Page) {
  const errorSelectors = ['.error', '[data-error]', '.error-message'];
  
  for (const selector of errorSelectors) {
    const errorCount = await page.locator(selector).count();
    expect(errorCount).toBe(0);
  }
}

/**
 * ボタンクリックしてダウンロード
 */
export async function clickAndDownload(page: Page, buttonText: string) {
  const downloadPromise = page.waitForEvent('download');
  await page.click(`button:has-text("${buttonText}")`);
  return await downloadPromise;
}

/**
 * ファイルサイズが0でないことを確認
 */
export async function checkFileNotEmpty(downloadPath: string) {
  const fs = require('fs');
  const stats = fs.statSync(downloadPath);
  expect(stats.size).toBeGreaterThan(0);
  return stats.size;
}

/**
 * テキストエリアに入力して結果を取得
 */
export async function fillTextareaAndGetResult(
  page: Page,
  inputText: string,
  resultSelector: string = '.result'
) {
  await page.fill('textarea', inputText);
  await page.waitForTimeout(500); // 自動計算の場合
  const result = await page.locator(resultSelector).textContent();
  return result || '';
}

/**
 * レスポンシブ確認
 */
export async function checkResponsive(page: Page, url: string) {
  const viewports = [
    { width: 1920, height: 1080, name: 'Desktop' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(url);
    
    // 横スクロールチェック
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    console.log(`✅ ${viewport.name}: ${viewport.width}x${viewport.height} OK`);
  }
}