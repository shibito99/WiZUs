import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await apiLogin(form.email, form.password)
      login(data.token, data.user)
      navigate('/')
    } catch {
      setError('メールアドレスまたはパスワードが正しくありません')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-indigo-600 text-center mb-8">WiZUs</h1>
        <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">ログイン</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="email" placeholder="メールアドレス" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
          />
          <input
            type="password" placeholder="パスワード" required
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
          <p className="text-center text-sm text-gray-500">
            アカウントをお持ちでない方は <Link to="/register" className="text-indigo-600 hover:underline">登録</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
