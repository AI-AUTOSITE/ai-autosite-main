import React from 'react'
import { FileImage, Lock, Zap, MousePointer } from 'lucide-react'

interface ImageUploaderProps {
  isDraggingFile: boolean
  fileInputRef: React.RefObject<HTMLInputElement>
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  isDraggingFile,
  fileInputRef,
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {/* Upload Area - All integrated */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative w-full max-w-2xl transition-all duration-300 ${
          isDraggingFile ? 'scale-105' : 'scale-100'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-sm border-2 border-dashed border-white/20 hover:border-cyan-400/50 transition-all duration-300"
        >
          <div className="p-12 sm:p-16">
            <div className="flex justify-center mb-6">
              <FileImage className="w-20 h-20 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Hide Private Info Fast
              <span className="block text-xl sm:text-2xl mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Click or Drag to Mask
              </span>
            </h2>
            <p className="text-gray-300 text-sm mt-3">
              {isDraggingFile ? 'Drop your image here' : 'PNG, JPEG, GIF, BMP, WebP (Max 10MB)'}
            </p>
          </div>
        </button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-4xl">
        <FeatureCard
          icon={<Lock className="w-8 h-8 text-cyan-400 mb-3" />}
          title="100% Private"
          description="No uploads to server"
          gradient="from-cyan-600/10 to-cyan-600/5"
          borderColor="border-cyan-500/20"
        />
        <FeatureCard
          icon={<Zap className="w-8 h-8 text-purple-400 mb-3" />}
          title="Super Fast"
          description="Works instantly"
          gradient="from-purple-600/10 to-purple-600/5"
          borderColor="border-purple-500/20"
        />
        <FeatureCard
          icon={<MousePointer className="w-8 h-8 text-pink-400 mb-3" />}
          title="Easy to Use"
          description="Just click or drag"
          gradient="from-pink-600/10 to-pink-600/5"
          borderColor="border-pink-500/20"
        />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  borderColor: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient, borderColor }) => {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${gradient} backdrop-blur-sm border ${borderColor} p-6`}>
      {icon}
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  )
}