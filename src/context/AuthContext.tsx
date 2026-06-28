import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, tokenStorage } from '../lib/api'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ otpRequired: boolean; challengeId: string }>
  verifyOtp: (challengeId: string, otp: string) => Promise<void>
  resendOtp: (challengeId: string) => Promise<void>
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

  // AuthContext.tsx - signIn method
const signIn = useCallback(async (email: string, password: string) => {
  try {
    console.log('🔑 Signing in with:', email);
    
    const res = await api.post<{ accessToken: string; refreshToken?: string; user?: User }>(
      '/authentication/sign-in', 
      { email, password }
    );
    
    console.log('📥 Response received:', res.data);
    
    // ✅ IMPORTANT: Save the token
    const { accessToken, refreshToken, user } = res.data;
    
    if (!accessToken) {
      throw new Error('No access token received');
    }
    
    // ✅ Store tokens in localStorage
    tokenStorage.set(accessToken, refreshToken);
    console.log('💾 Token saved to localStorage');
    
    // ✅ Verify it was saved
    const saved = tokenStorage.getAccessToken();
    console.log('🔑 Saved token:', saved ? '✅ Yes' : '❌ No');
    
    // ✅ Set user
    if (user) {
      setUser(user);
    } else {
      await loadUser();
    }
    
  } catch (error) {
    console.error('❌ SignIn error:', error);
    throw error;
  }
}, [loadUser]);

  const signUp = useCallback(async (name: string, email: string, password: string, confirmPassword: string) => {
    const res = await api.post<{ otpRequired: boolean; challengeId: string }>(
      '/authentication/sign-up', 
      { name, email, password, confirmPassword }
    )
    return res.data // { otpRequired: true, challengeId: '...' }
  }, [])

  // Add verifyOtp method
  const verifyOtp = useCallback(async (challengeId: string, otp: string) => {
    await api.post('/authentication/sign-up/verify', { challengeId, otp })
  }, [])

  // Add resendOtp method
  const resendOtp = useCallback(async (challengeId: string) => {
    await api.post('/authentication/resend-otp', { challengeId })
  }, [])

  const signOut = useCallback(async () => {
    try { await api.post('/authentication/sign-out') } catch { /* ignore */ }
    tokenStorage.clear()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ 
      user, 
      loading, 
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'ADMIN', 
      signIn, 
      signUp, 
      verifyOtp,
      resendOtp,
      signOut, 
      refreshUser: loadUser 
    }),
    [user, loading, signIn, signUp, verifyOtp, resendOtp, signOut, loadUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}