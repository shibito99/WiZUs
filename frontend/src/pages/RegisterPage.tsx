import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await register(form.username, form.email, form.password)
      login(data.token, data.user)
      navigate('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-indigo-600 text-center mb-8">WiZUs</h1>
        <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">アカウント作成</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text" placeholder="ユーザー名" required
            value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
          />
          <input
            type="email" placeholder="メールアドレス" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
          />
          <input
            type="password" placeholder="パスワード" required minLength={8}
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? '登録中...' : '登録する'}
          </button>
          <p className="text-center text-sm text-gray-500">
            アカウントをお持ちの方は <Link to="/login" className="text-indigo-600 hover:underline">ログイン</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
