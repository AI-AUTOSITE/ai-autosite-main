import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { BlogPost } from '@/lib/blog-posts/types'

interface BlogPostCardProps {
  post: BlogPost
  badge?: {
    label: string
    icon: string
    className: string
    cardBorder: string
    iconColor: string
    glowEffect: string
  } | null
}

export function BlogPostCard({ post, badge }: BlogPostCardProps) {
  const PostIcon = post.icon
  
  return (
    <Link href={`/blog/${post.id}`} className="group">
      <article className={`
        h-full bg-white/5 rounded-xl p-5
        border border-white/10
        transition-all duration-200
        flex flex-col relative
        hover:bg-white/10 hover:scale-105
        ${badge ? `${badge.cardBorder} ${badge.glowEffect} hover:shadow-lg` : 'hover:border-cyan-400/30'}
      `}>
        {/* Badge */}
        {badge && (
          <div className={`absolute -top-2 -right-2 ${badge.className} text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg`}>
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        )}
        
        <div className="flex items-start justify-between mb-3">
          <PostIcon className={`w-5 h-5 ${badge ? badge.iconColor : 'text-cyan-400'}`} />
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        
        <h3 className={`font-semibold mb-2 transition-colors line-clamp-2 ${
          badge ? `text-white group-hover:${badge.iconColor}` : 'text-white group-hover:text-cyan-400'
        }`}>
          {post.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {post.description}
        </p>
        
        {post.relatedTool && (
          <div className="pt-3 mt-auto border-t border-white/5">
            <span className="text-xs text-gray-500">Related tool:</span>
            <p className={`text-xs truncate ${badge ? badge.iconColor : 'text-cyan-400'}`}>
              {post.relatedTool.name}
            </p>
          </div>
        )}
        
        <div className="flex items-center text-xs text-gray-400 group-hover:text-gray-300 mt-3">
          <span>Read article</span>
          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </article>
    </Link>
  )
}