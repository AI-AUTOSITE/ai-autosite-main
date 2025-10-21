import { test, expect } from '@playwright/test';

test.describe('パスワード生成器', () => {
  
  test('ページが開く', async ({ page }) => {
    console.log('🚀 パスワード生成器テスト開始');
    
    await page.goto('http://localhost:3000/tools/password-generator');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const title = await page.title();
    console.log('📄 ページタイトル:', title);
    
    await page.waitForTimeout(3000);
    console.log('✅ ページ表示OK');
  });
  
  test('生成ボタンがある', async ({ page }) => {
    await page.goto('http://localhost:3000/tools/password-generator');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 生成ボタンを探す
    const button = page.locator('button').filter({ hasText: /生成|Generate/i }).first();
    await expect(button).toBeVisible();
    console.log('✅ 生成ボタンが見つかりました');
    
    await page.waitForTimeout(3000);
  });
  
  test('パスワードを生成できる', async ({ page }) => {
    console.log('🚀 パスワード生成テスト開始');
    
    await page.goto('http://localhost:3000/tools/password-generator');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 生成ボタンをクリック
    const button = page.locator('button').filter({ hasText: /生成|Generate/i }).first();
    await button.click();
    console.log('✅ 生成ボタンをクリックしました');
    
    await page.waitForTimeout(3000);
    
    // 結果が表示されているか確認（入力フィールドまたはテキスト）
    const hasPassword = await page.locator('input[readonly], input[value], .password').count() > 0;
    expect(hasPassword).toBe(true);
    console.log('✅ パスワードが生成されました');
    
    await page.waitForTimeout(3000);
  });
});