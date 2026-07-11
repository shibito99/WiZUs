import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { User, Post } from '../types'
import { getUser, updateProfile, follow, unfollow } from '../api/users'
import { getUserPosts } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'
import PostCard from '../components/PostCard'

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const userId = Number(id)
  const { user: me } = useAuth()
  const isMe = me?.id === userId

  const [profile, setProfile] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [following, setFollowing] = useState(false)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getUser(userId).then(({ data }) => {
      setProfile(data)
      setBio(data.bio ?? '')
    })
    getUserPosts(userId).then(({ data }) => setPosts(data.content))
  }, [userId])

  const toggleFollow = async () => {
    if (following) {
      await unfollow(userId)
      setFollowing(false)
      setProfile(p => p ? { ...p, followerCount: p.followerCount - 1 } : p)
    } else {
      await follow(userId)
      setFollowing(true)
      setProfile(p => p ? { ...p, followerCount: p.followerCount + 1 } : p)
    }
  }

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('bio', bio)
    if (avatarFile) fd.append('avatar', avatarFile)
    const { data } = await updateProfile(fd)
    setProfile(data)
    setEditing(false)
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  if (!profile) return <div className="text-center py-20 text-gray-400">読み込み中...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="cursor-pointer" onClick={() => isMe && editing && fileRef.current?.click()}>
              <Avatar url={avatarPreview ?? profile.avatarUrl} username={profile.username} size="lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.username}</h2>
              {!editing && <p className="text-sm text-gray-500">{profile.bio || '自己紹介はまだありません'}</p>}
            </div>
          </div>
          {isMe ? (
            <button onClick={() => setEditing(!editing)} className="text-sm border border-gray-300 px-4 py-1.5 rounded-full hover:bg-gray-50">
              {editing ? 'キャンセル' : 'プロフィール編集'}
            </button>
          ) : (
            <button
              onClick={toggleFollow}
              className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                following ? 'border border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {following ? 'フォロー中' : 'フォローする'}
            </button>
          )}
        </div>

        {editing && (
          <form onSubmit={saveProfile} className="mt-4 space-y-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)) }
              }}
            />
            <textarea
              value={bio} onChange={e => setBio(e.target.value)}
              placeholder="自己紹介を入力..." maxLength={160} rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:border-indigo-400"
            />
            <button type="submit" className="bg-indigo-600 text-white text-sm px-6 py-2 rounded-full hover:bg-indigo-700">保存</button>
          </form>
        )}

        <div className="flex gap-6 mt-4 text-sm">
          <Link to={`/users/${userId}/following`} className="text-gray-600 hover:text-indigo-600">
            <span className="font-bold text-gray-900">{profile.followingCount}</span> フォロー中
          </Link>
          <Link to={`/users/${userId}/followers`} className="text-gray-600 hover:text-indigo-600">
            <span className="font-bold text-gray-900">{profile.followerCount}</span> フォロワー
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">投稿</h3>
        {posts.length === 0 && <p className="text-gray-400 text-sm text-center py-8">まだ投稿がありません</p>}
        {posts.map(p => (
          <PostCard key={p.id} post={p} onDeleted={id => setPosts(prev => prev.filter(x => x.id !== id))} />
        ))}
      </div>
    </div>
  )
}
