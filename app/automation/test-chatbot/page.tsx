'use client'

import { useState } from 'react'

export default function TestChatbotPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{text: string, sender: 'bot' | 'user'}>>([])

  const handleOpen = () => {
    setIsOpen(true)
    setMessages([
      { text: 'こんにちは！Signal Cafeへようこそ。ご用件をお選びください：', sender: 'bot' }
    ])
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleButtonClick = (option: string) => {
    setMessages(prev => [
      ...prev,
      { text: option, sender: 'user' },
      { text: `「${option}」を選択されました。ただいま準備中です...`, sender: 'bot' }
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          チャットボット動作テスト
        </h1>
        
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Signal Cafe - チャットボットデモ</h2>
          <p className="text-gray-600 mb-6">
            右下の💬ボタンをクリックしてチャットを開始してください。
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>テスト環境:</strong> このページはチャットボットの基本動作を確認するためのテストページです。
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">✅ 実装済み機能</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• チャットウィンドウ開閉</li>
                <li>• メッセージ表示</li>
                <li>• ボタン選択</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">🚧 実装予定機能</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• カレンダー予約</li>
                <li>• QRコード生成</li>
                <li>• メニュー表示</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 flex items-center justify-center text-2xl z-50 animate-pulse"
          aria-label="チャットを開く"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Chat Window */}
          <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Signal Cafe Bot</h3>
                <p className="text-xs opacity-90">オンライン</p>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      msg.sender === 'user'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {messages.length === 1 && (
                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => handleButtonClick('予約する')}
                    className="w-full p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    📅 予約する
                  </button>
                  <button
                    onClick={() => handleButtonClick('メニューを見る')}
                    className="w-full p-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    📖 メニューを見る
                  </button>
                  <button
                    onClick={() => handleButtonClick('営業時間を確認')}
                    className="w-full p-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    🕐 営業時間を確認
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}