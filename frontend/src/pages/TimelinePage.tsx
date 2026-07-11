import { useState, useEffect } from 'react'
import type { Post } from '../types'
import { getTimeline } from '../api/posts'
import PostCard from '../components/PostCard'
import UserCard from '../components/UserCard'
import { getSuggestions } from '../api/users'
import type { User } from '../types'

export default function TimelinePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const fetchPosts = async (p: number) => {
    setLoading(true)
    try {
      const { data } = await getTimeline(p)
      setPosts(prev => p === 0 ? data.content : [...prev, ...data.content])
      setHasMore(p < data.totalPages - 1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts(0) }, [])

  useEffect(() => {
    getSuggestions().then(({ data }) => setSuggestions(data.slice(0, 5)))
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">タイムライン</h2>
        {posts.length === 0 && !loading && (
          <p className="text-gray-500 text-sm text-center py-12">
            まだ投稿がありません。誰かをフォローしてみましょう！
          </p>
        )}
        {posts.map(post => (
          <PostCard key={post.id} post={post} onDeleted={id => setPosts(prev => prev.filter(p => p.id !== id))} />
        ))}
        {hasMore && (
          <button
            onClick={() => { const next = page + 1; setPage(next); fetchPosts(next) }}
            disabled={loading}
            className="w-full text-sm text-indigo-600 py-3 hover:bg-indigo-50 rounded-xl"
          >
            {loading ? '読み込み中...' : 'もっと見る'}
          </button>
        )}
      </div>
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">知り合いかも？</h3>
          {suggestions.map(u => <UserCard key={u.id} user={u} />)}
        </div>
      )}
    </div>
  )
}
