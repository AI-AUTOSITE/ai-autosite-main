// app/demo-handwritten/page.tsx
'use client'

import {
  HandwrittenIcon,
  HandHeartIcon,
  HandStarIcon,
  HandHomeIcon,
  HandSmileIcon,
  HandSunIcon,
  HandFlowerIcon,
  HandCheckIcon,
  HandArrowIcon,
  HandCloudIcon,
  HandMailIcon,
} from '../components/icons/HandwrittenIcons'

const iconList = [
  { name: 'hand-heart', label: 'Heart', component: HandHeartIcon },
  { name: 'hand-star', label: 'Star', component: HandStarIcon },
  { name: 'hand-home', label: 'Home', component: HandHomeIcon },
  { name: 'hand-smile', label: 'Smile', component: HandSmileIcon },
  { name: 'hand-sun', label: 'Sun', component: HandSunIcon },
  { name: 'hand-flower', label: 'Flower', component: HandFlowerIcon },
  { name: 'hand-check', label: 'Check', component: HandCheckIcon },
  { name: 'hand-arrow', label: 'Arrow', component: HandArrowIcon },
  { name: 'hand-cloud', label: 'Cloud', component: HandCloudIcon },
  { name: 'hand-mail', label: 'Mail', component: HandMailIcon },
]

export default function HandwrittenDemoPage() {
  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with handwritten style */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            手書き風アイコン
          </h1>
          <p className="text-gray-600">Handwritten Style Icons - 全 {iconList.length} 個</p>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {iconList.map(({ name, label, component: IconComponent }) => (
            <div
              key={name}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-2 border-dashed border-amber-200"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <IconComponent size={32} className="text-gray-700" />
                </div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <code className="text-xs bg-amber-100 px-2 py-1 rounded text-gray-600">{name}</code>
              </div>
            </div>
          ))}
        </div>

        {/* Style Variations */}
        <div className="mt-12">
          <h2
            className="text-2xl font-bold text-gray-800 mb-6"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            スタイルバリエーション
          </h2>

          {/* Color variations */}
          <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-dashed border-amber-200">
            <h3 className="text-lg font-semibold mb-4">カラーバリエーション</h3>
            <div className="flex flex-wrap gap-4">
              <HandHeartIcon size={32} className="text-red-500" />
              <HandStarIcon size={32} className="text-yellow-500" />
              <HandSunIcon size={32} className="text-orange-500" />
              <HandFlowerIcon size={32} className="text-pink-500" />
              <HandCloudIcon size={32} className="text-blue-400" />
              <HandSmileIcon size={32} className="text-green-500" />
            </div>
          </div>

          {/* Size variations */}
          <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-dashed border-amber-200 mt-4">
            <h3 className="text-lg font-semibold mb-4">サイズバリエーション</h3>
            <div className="flex items-center gap-4">
              <HandHeartIcon size={16} className="text-red-500" />
              <HandHeartIcon size={24} className="text-red-500" />
              <HandHeartIcon size={32} className="text-red-500" />
              <HandHeartIcon size={48} className="text-red-500" />
              <HandHeartIcon size={64} className="text-red-500" />
            </div>
          </div>

          {/* Stroke width variations */}
          <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-dashed border-amber-200 mt-4">
            <h3 className="text-lg font-semibold mb-4">線の太さ</h3>
            <div className="flex items-center gap-4">
              <HandStarIcon size={32} strokeWidth={1} className="text-yellow-500" />
              <HandStarIcon size={32} strokeWidth={2} className="text-yellow-500" />
              <HandStarIcon size={32} strokeWidth={3} className="text-yellow-500" />
              <HandStarIcon size={32} strokeWidth={4} className="text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12">
          <h2
            className="text-2xl font-bold text-gray-800 mb-6"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            使用例
          </h2>

          <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-dashed border-amber-200 space-y-4">
            {/* Cute buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 border-2 border-pink-300">
                <HandHeartIcon size={20} />
                いいね！
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 border-2 border-yellow-300">
                <HandStarIcon size={20} />
                お気に入り
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 border-2 border-green-300">
                <HandCheckIcon size={20} />
                完了！
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 border-2 border-blue-300">
                <HandMailIcon size={20} />
                メール送信
              </button>
            </div>

            {/* Card with icons */}
            <div className="p-4 bg-gradient-to-r from-pink-50 to-yellow-50 rounded-lg border-2 border-dashed border-pink-200">
              <div className="flex items-center gap-3 mb-2">
                <HandFlowerIcon size={24} className="text-pink-500" />
                <h3 className="font-bold text-gray-800">今日の天気</h3>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <HandSunIcon size={20} className="text-orange-500" />
                  <span>晴れ</span>
                </div>
                <div className="flex items-center gap-1">
                  <HandCloudIcon size={20} className="text-blue-400" />
                  <span>のち曇り</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-6">
              <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <HandHomeIcon size={24} />
                <span>ホーム</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <HandStarIcon size={24} />
                <span>お気に入り</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <HandMailIcon size={24} />
                <span>メッセージ</span>
              </a>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-12">
          <h2
            className="text-2xl font-bold text-gray-800 mb-6"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            使い方
          </h2>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm">
              <code>{`// Import
import { HandHeartIcon, HandStarIcon } from '@/components/icons/HandwrittenIcons';

// Use in component
<HandHeartIcon size={32} className="text-red-500" />
<HandStarIcon size={24} strokeWidth={3} />

// Or use with name
import { HandwrittenIcon } from '@/components/icons/HandwrittenIcons';

<HandwrittenIcon name="hand-heart" size={32} className="text-pink-500" />`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
