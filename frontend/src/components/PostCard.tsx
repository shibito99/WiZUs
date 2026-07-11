import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Post } from '../types'
import { likePost, unlikePost, deletePost } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'
import CommentModal from './CommentModal'

interface Props {
  post: Post
  onDeleted?: (id: number) => void
}

export default function PostCard({ post, onDeleted }: Props) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(post.likedByMe)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [showComments, setShowComments] = useState(false)
  const [commentCount, setCommentCount] = useState(post.commentCount)

  const toggleLike = async () => {
    try {
      if (liked) {
        const { data } = await unlikePost(post.id)
        setLiked(false)
        setLikeCount(data.likeCount)
      } else {
        const { data } = await likePost(post.id)
        setLiked(true)
        setLikeCount(data.likeCount)
      }
    } catch {/* ignore */}
  }

  const handleDelete = async () => {
    if (!confirm('この投稿を削除しますか？')) return
    await deletePost(post.id)
    onDeleted?.(post.id)
  }

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'たった今'
    if (m < 60) return `${m}分前`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}時間前`
    return `${Math.floor(h / 24)}日前`
  }

  return (
    <article className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Link to={`/users/${post.userId}`}>
          <Avatar url={post.avatarUrl} username={post.username} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <Link to={`/users/${post.userId}`} className="font-semibold text-gray-900 hover:underline">
                {post.username}
              </Link>
              <span className="text-gray-400 text-sm ml-2">{relativeTime(post.createdAt)}</span>
            </div>
            {user?.id === post.userId && (
              <button onClick={handleDelete} className="text-gray-300 hover:text-red-400 text-sm">削除</button>
            )}
          </div>
          <p className="text-gray-800 whitespace-pre-wrap break-words mt-1">{post.content}</p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt="投稿画像" className="mt-2 rounded-lg max-h-80 object-cover w-full" />
          )}
        </div>
      </div>
      <div className="flex gap-6 pl-13 text-sm text-gray-500">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 hover:text-red-500 transition-colors ${liked ? 'text-red-500' : ''}`}
        >
          <span>{liked ? '❤️' : '🤍'}</span>
          <span>{likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments(true)}
          className="flex items-center gap-1 hover:text-indigo-500"
        >
          <span>💬</span>
          <span>{commentCount}</span>
        </button>
      </div>
      {showComments && (
        <CommentModal
          postId={post.id}
          onClose={() => setShowComments(false)}
          onCommentAdded={() => setCommentCount(c => c + 1)}
        />
      )}
    </article>
  )
}
