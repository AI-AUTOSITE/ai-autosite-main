import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { ChevronRight, Clock, Tag, User, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'PC最適化の完全ガイド：容量不足とパフォーマンス低下を解決する方法',
  description: 'Windowsパソコンの容量不足や処理速度の低下を解決する方法を徹底解説。不要ファイルの特定から削除まで、安全に最適化する手順を紹介します。',
  keywords: 'PC最適化, Windows最適化, 容量不足, パフォーマンス改善, ディスククリーンアップ, スタートアップ管理, PC高速化',
  openGraph: {
    title: 'PC最適化の完全ガイド - AI AutoSite',
    description: 'Windowsパソコンの容量不足や処理速度の低下を解決する方法を徹底解説',
    type: 'article',
    publishedTime: '2024-01-20T00:00:00.000Z',
  },
}

export default function PCOptimizerGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-cyan-400">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">PC最適化ガイド</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            PC最適化の完全ガイド
            <span className="block text-2xl sm:text-3xl mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              容量不足とパフォーマンス低下を解決する方法
            </span>
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-6">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              AI AutoSite Team
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              2024年1月20日
            </span>
            <span className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              Windows, 最適化, チュートリアル
            </span>
          </div>
        </header>

        {/* CTA Box */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <p className="text-white font-semibold mb-2">
            💻 PC最適化アドバイザーツール
          </p>
          <p className="text-gray-300 text-sm mb-4">
            この記事で紹介する手順を自動化したツールをご用意しています。
            簡単な操作でPCの分析と最適化提案を受けられます。
          </p>
          <Link 
            href="/tools/pc-optimizer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
          >
            <span>無料で試す</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Article Content */}
        <article className="prose prose-invert max-w-none">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              はじめに：なぜPCは遅くなるのか？
            </h2>
            <p className="text-gray-300 mb-4">
              パソコンを長期間使用していると、徐々に動作が遅くなったり、
              ストレージの空き容量が少なくなったりすることがあります。
              これは主に以下の原因によるものです：
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• 不要なソフトウェアの蓄積</li>
              <li>• 一時ファイルやキャッシュの増加</li>
              <li>• スタートアップアプリの増加</li>
              <li>• システムリソースの非効率的な使用</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. 容量を占有しているソフトウェアの特定
            </h2>
            <h3 className="text-xl font-semibold text-cyan-400 mb-3">
              手動での確認方法
            </h3>
            <ol className="space-y-3 text-gray-300">
              <li>
                <strong className="text-white">1.</strong> 設定アプリを開く（Windowsキー + I）
              </li>
              <li>
                <strong className="text-white">2.</strong> 「アプリ」→「アプリと機能」を選択
              </li>
              <li>
                <strong className="text-white">3.</strong> 「並べ替え」で「サイズ」を選択
              </li>
              <li>
                <strong className="text-white">4.</strong> 大容量のアプリから順に表示される
              </li>
            </ol>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">
              PowerShellを使用した詳細分析
            </h3>
            <p className="text-gray-300 mb-4">
              より詳細な情報を取得したい場合は、PowerShellスクリプトを使用できます：
            </p>
            <pre className="bg-gray-900/50 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-800">
{`Get-ChildItem "C:\\Program Files", "C:\\Program Files (x86)" -Recurse -Include *.exe | 
  Select-Object Name, DirectoryName, Length, LastAccessTime | 
  Sort-Object Length -Descending | 
  Select-Object -First 20`}
            </pre>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. 削除すべきソフトウェアの判断基準
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">🗑️ 削除推奨</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• 3ヶ月以上使用していないソフト</li>
                  <li>• 重複している機能のソフト</li>
                  <li>• 試用版の期限切れソフト</li>
                  <li>• 古いバージョンのソフト</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">✅ 保持推奨</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• システム関連のソフト</li>
                  <li>• ドライバー関連</li>
                  <li>• セキュリティソフト</li>
                  <li>• 頻繁に使用するソフト</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. スタートアップアプリの管理
            </h2>
            <p className="text-gray-300 mb-4">
              PC起動時に自動で立ち上がるアプリを管理することで、起動時間を短縮できます。
            </p>
            
            <h3 className="text-xl font-semibold text-cyan-400 mb-3">
              タスクマネージャーでの設定
            </h3>
            <ol className="space-y-2 text-gray-300">
              <li>1. Ctrl + Shift + Esc でタスクマネージャーを開く</li>
              <li>2. 「スタートアップ」タブを選択</li>
              <li>3. 不要なアプリを右クリック→「無効化」</li>
            </ol>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-300">
                💡 ヒント：「スタートアップへの影響」が「高」のアプリから無効化すると効果的です
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. キャッシュとテンポラリファイルの削除
            </h2>
            
            <h3 className="text-xl font-semibold text-cyan-400 mb-3">
              ディスククリーンアップの実行
            </h3>
            <ol className="space-y-2 text-gray-300 mb-4">
              <li>1. エクスプローラーで「PC」を開く</li>
              <li>2. Cドライブを右クリック→「プロパティ」</li>
              <li>3. 「ディスクのクリーンアップ」をクリック</li>
              <li>4. 削除するファイルにチェック→「OK」</li>
            </ol>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3">
              主要ソフトのキャッシュクリア
            </h3>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3">
                <strong className="text-white">Chrome：</strong>
                <span className="text-gray-300 text-sm"> 設定 → プライバシーとセキュリティ → 閲覧履歴データを削除</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <strong className="text-white">Discord：</strong>
                <span className="text-gray-300 text-sm"> %AppData%/Discord/Cache フォルダを削除</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <strong className="text-white">Adobe：</strong>
                <span className="text-gray-300 text-sm"> 編集 → 環境設定 → メディアキャッシュ → 削除</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. ハードウェアアップグレードの検討
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">SSD換装</h4>
                <p className="text-sm text-gray-300 mb-2">予算：5,000円〜</p>
                <p className="text-xs text-gray-400">
                  HDDからSSDへの換装で起動速度が3〜5倍向上
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">メモリ増設</h4>
                <p className="text-sm text-gray-300 mb-2">予算：3,000円〜</p>
                <p className="text-xs text-gray-400">
                  8GB→16GBで複数アプリの同時使用が快適に
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">外付けストレージ</h4>
                <p className="text-sm text-gray-300 mb-2">予算：6,000円〜</p>
                <p className="text-xs text-gray-400">
                  データを外部保存して本体容量を確保
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              まとめ：定期的なメンテナンスの重要性
            </h2>
            <p className="text-gray-300 mb-4">
              PCの最適化は一度行えば終わりではありません。
              以下のスケジュールで定期的なメンテナンスを行うことをおすすめします：
            </p>
            <ul className="space-y-2 text-gray-300 mb-6">
              <li>📅 <strong className="text-white">週1回：</strong> ブラウザキャッシュのクリア</li>
              <li>📅 <strong className="text-white">月1回：</strong> ディスククリーンアップの実行</li>
              <li>📅 <strong className="text-white">3ヶ月に1回：</strong> 不要ソフトのアンインストール</li>
              <li>📅 <strong className="text-white">半年に1回：</strong> スタートアップアプリの見直し</li>
            </ul>

            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-semibold mb-2">
                🚀 今すぐPC最適化を始めましょう
              </p>
              <p className="text-gray-300 text-sm mb-4">
                当サイトのPC最適化アドバイザーツールを使えば、
                これらの作業を簡単に実行できます。
              </p>
              <Link 
                href="/tools/pc-optimizer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
              >
                <span>PC最適化ツールを使う</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">関連記事</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/choosing-the-right-tech-stack" className="group">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all">
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  適切なテックスタックの選び方
                </h4>
                <p className="text-sm text-gray-400">
                  プロジェクトに最適なフレームワークとツールを選ぶ方法
                </p>
              </div>
            </Link>
            <Link href="/blog/code-dependency-analysis" className="group">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all">
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  コード依存関係の分析と最適化
                </h4>
                <p className="text-sm text-gray-400">
                  プロジェクトの依存関係を可視化して問題を特定
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ブログ一覧に戻る</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}