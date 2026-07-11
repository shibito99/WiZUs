import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import TimelinePage from './pages/TimelinePage'
import PostCreatePage from './pages/PostCreatePage'
import ProfilePage from './pages/ProfilePage'
import FollowingPage from './pages/FollowingPage'
import FollowersPage from './pages/FollowersPage'
import SearchPage from './pages/SearchPage'
import type { ReactNode } from 'react'

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><TimelinePage /></RequireAuth>} />
        <Route path="/posts/new" element={<RequireAuth><PostCreatePage /></RequireAuth>} />
        <Route path="/users/:id" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/users/:id/following" element={<RequireAuth><FollowingPage /></RequireAuth>} />
        <Route path="/users/:id/followers" element={<RequireAuth><FollowersPage /></RequireAuth>} />
        <Route path="/search" element={<RequireAuth><SearchPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
