import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">WiZUs</Link>
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <Link to="/search" className="text-gray-500 hover:text-gray-900 text-sm">検索</Link>
            <Link to="/posts/new" className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-indigo-700">投稿</Link>
            <Link to={`/users/${user.id}`}>
              <Avatar url={user.avatarUrl} username={user.username} size="sm" />
            </Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 text-sm">ログアウト</button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="text-sm text-indigo-600 hover:underline">ログイン</Link>
            <Link to="/register" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700">登録</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
