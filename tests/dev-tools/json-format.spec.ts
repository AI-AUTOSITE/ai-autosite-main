import { test, expect } from '@playwright/test';
import { waitForPageLoad, checkForGarbledText } from '../helpers/common';

test.describe('JSON整形ツール', () => {
  
  test('JSONを整形できる', async ({ page }) => {
    await page.goto('/tools/json-format');
    await waitForPageLoad(page);
    
    // 圧縮されたJSONを入力
    const compressedJson = '{"name":"太郎","age":30,"city":"Tokyo"}';
    await page.fill('textarea', compressedJson);
    
    // 整形ボタンをクリック
    await page.click('button:has-text("整形")');
    await page.waitForTimeout(500);
    
    // 結果を取得
    const result = await page.locator('textarea').last().inputValue() ||
                   await page.locator('.result').textContent() || '';
    
    // 整形されているか（改行が含まれている）
    expect(result).toContain('\n');
    expect(result).toContain('太郎');
    
    // 文字化けチェック
    expect(checkForGarbledText(result)).toBe(false);
    
    console.log('✅ JSON整形OK');
  });
  
  test('不正なJSONでエラー表示', async ({ page }) => {
    await page.goto('/tools/json-format');
    
    // 不正なJSONを入力
    await page.fill('textarea', '{invalid json}');
    await page.click('button:has-text("整形")');
    await page.waitForTimeout(500);
    
    // エラーメッセージが表示されるか
    const errorCount = await page.locator('.error, [data-error], .error-message').count();
    expect(errorCount).toBeGreaterThan(0);
    
    console.log('✅ エラー処理OK');
  });
});