import { useState, useEffect } from 'react'
import { searchUsers, getSuggestions } from '../api/users'
import type { User } from '../types'
import UserCard from '../components/UserCard'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    getSuggestions().then(({ data }) => setSuggestions(data))
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const { data } = await searchUsers(query)
        setResults(data)
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ユーザーを検索..."
          className="w-full border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-indigo-400 bg-white"
        />
        {searching && <span className="absolute right-4 top-3 text-gray-400 text-sm">検索中...</span>}
      </div>

      {query.trim() ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500">検索結果</h3>
          {results.length === 0 && !searching && (
            <p className="text-gray-400 text-sm text-center py-8">「{query}」に一致するユーザーは見つかりません</p>
          )}
          {results.map(u => <UserCard key={u.id} user={u} />)}
        </div>
      ) : (
        suggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">知り合いかも？</h3>
            {suggestions.map(u => <UserCard key={u.id} user={u} />)}
          </div>
        )
      )}
    </div>
  )
}
