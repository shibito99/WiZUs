import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../types'
import { follow, unfollow } from '../api/users'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

interface Props {
  user: User
  initialFollowing?: boolean
}

export default function UserCard({ user, initialFollowing = false }: Props) {
  const { user: me } = useAuth()
  const [following, setFollowing] = useState(initialFollowing)

  const toggle = async () => {
    try {
      if (following) {
        await unfollow(user.id)
        setFollowing(false)
      } else {
        await follow(user.id)
        setFollowing(true)
      }
    } catch {/* ignore */}
  }

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white border border-gray-200 rounded-xl">
      <Link to={`/users/${user.id}`} className="flex items-center gap-3 min-w-0">
        <Avatar url={user.avatarUrl} username={user.username} />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{user.username}</p>
          {user.bio && <p className="text-xs text-gray-500 truncate">{user.bio}</p>}
        </div>
      </Link>
      {me && me.id !== user.id && (
        <button
          onClick={toggle}
          className={`ml-4 text-sm px-4 py-1.5 rounded-full transition-colors ${
            following
              ? 'border border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {following ? 'フォロー中' : 'フォロー'}
        </button>
      )}
    </div>
  )
}
