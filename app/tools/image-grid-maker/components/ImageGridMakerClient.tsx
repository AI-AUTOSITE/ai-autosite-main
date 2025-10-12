'use client'

import ImageGrid from './ImageGrid'

export default function ImageGridMakerClient() {
  return (
    <div className="container mx-auto px-4 pt-2 pb-6">
      {/* Main Content Area */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8">
        <ImageGrid />
      </div>
    </div>
  )
}