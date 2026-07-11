import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getFollowers } from '../api/users'
import type { User } from '../types'
import UserCard from '../components/UserCard'

export default function FollowersPage() {
  const { id } = useParams<{ id: string }>()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    getFollowers(Number(id)).then(({ data }) => setUsers(data))
  }, [id])

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">フォロワー</h2>
      {users.length === 0 && <p className="text-gray-400 text-sm text-center py-12">フォロワーはいません</p>}
      {users.map(u => <UserCard key={u.id} user={u} />)}
    </div>
  )
}
