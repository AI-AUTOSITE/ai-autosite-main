import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  // テストファイルの場所
  testDir: './tests',
  
  // タイムアウト設定（30秒）
  timeout: 30000,
  
  // 並列実行
  fullyParallel: true,
  
  // 失敗時のリトライ（開発中は0）
  retries: 0,
  
  // 同時実行数（開発中は1推奨）
  workers: 1,
  
  // レポート設定
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  use: {
    // ベースURL（あなたの開発サーバー）
    baseURL: 'http://localhost:3000',
    
    // スクリーンショット（失敗時のみ）
    screenshot: 'only-on-failure',
    
    // ビデオ（失敗時のみ）
    video: 'retain-on-failure',
    
    // トレース
    trace: 'on-first-retry',
    
    // デフォルトのタイムアウト
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  // テストするブラウザ・デバイス
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5']
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12']
      },
    },
  ],

  // 開発サーバー自動起動
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});