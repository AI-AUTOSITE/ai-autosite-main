import { test, expect } from '@playwright/test';
import { 
  waitForPageLoad, 
  checkForGarbledText, 
  fillTextareaAndGetResult 
} from '../helpers/common';

test.describe('文字数カウンター', () => {
  
  test('基本的な文字数カウント', async ({ page }) => {
    // ページを開く
    await page.goto('/tools/text-counter');
    await waitForPageLoad(page);
    
    // テキストを入力
    const testText = 'こんにちは世界';
    await page.fill('textarea', testText);
    
    // 少し待つ（自動カウントの場合）
    await page.waitForTimeout(500);
    
    // 結果を取得
    const result = await page.textContent('.result') || 
                   await page.textContent('[data-count]') ||
                   await page.textContent('.count');
    
    // 文字数が表示されているか
    expect(result).toContain('7');
    
    // 文字化けチェック
    expect(checkForGarbledText(result)).toBe(false);
    
    console.log('✅ 文字数カウントOK:', result);
  });
  
  test('空のテキストでも動作する', async ({ page }) => {
    await page.goto('/tools/text-counter');
    await waitForPageLoad(page);
    
    // 空のまま
    const result = await page.textContent('.result') || '';
    
    // 0が表示されるか、何かしらの結果がある
    expect(result).toBeTruthy();
    
    console.log('✅ 空テキスト対応OK');
  });
  
  test('長文でも動作する', async ({ page }) => {
    await page.goto('/tools/text-counter');
    
    // 長文を入力
    const longText = 'あ'.repeat(10000);
    await page.fill('textarea', longText);
    await page.waitForTimeout(500);
    
    const result = await page.textContent('.result') || '';
    
    // 10000が含まれているか
    expect(result).toContain('10000');
    
    console.log('✅ 長文対応OK');
  });
});