import { useState, useRef, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../api/posts'

export default function PostCreatePage() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const selectImage = (file: File) => {
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('content', content)
      if (image) fd.append('image', image)
      await createPost(fd)
      navigate('/')
    } catch {
      setError('投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">新しい投稿</h2>
      <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="いまどうしてる？"
          maxLength={280}
          rows={5}
          required
          className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
        />
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{content.length}/280</span>
        </div>
        {preview && (
          <div className="relative">
            <img src={preview} alt="プレビュー" className="rounded-xl max-h-64 object-cover w-full" />
            <button
              type="button"
              onClick={() => { setImage(null); setPreview(null) }}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 text-xs"
            >✕</button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-indigo-500 text-sm hover:text-indigo-700"
          >
            📷 画像を追加
          </button>
          <input
            ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => e.target.files?.[0] && selectImage(e.target.files[0])}
          />
          <button
            type="submit" disabled={loading || !content.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? '投稿中...' : '投稿する'}
          </button>
        </div>
      </form>
    </div>
  )
}
