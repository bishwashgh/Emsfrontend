import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, tokenStorage } from '../lib/api'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = tokenStorage.getAccessToken()
    if (!token) { setUser(null); setLoading(false); return }
    try {
      const res = await api.get<User>('/users/me')
      setUser(res.data)
    } catch {
      tokenStorage.clear()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ accessToken: string; refreshToken?: string; user?: User }>(
      '/authentication/sign-in', { email, password },
    )
    tokenStorage.set(res.data.accessToken, res.data.refreshToken)
    if (res.data.user) setUser(res.data.user)
    else await loadUser()
  }, [loadUser])

  const signUp = useCallback(async (name: string, email: string, password: string, confirmPassword: string) => {
    await api.post('/authentication/sign-up', { name, email, password, confirmPassword })
  }, [])

  const signOut = useCallback(async () => {
    try { await api.post('/authentication/sign-out') } catch { /* ignore */ }
    tokenStorage.clear()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, isAuthenticated: !!user, isAdmin: user?.role === 'ADMIN', signIn, signUp, signOut, refreshUser: loadUser }),
    [user, loading, signIn, signUp, signOut, loadUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
