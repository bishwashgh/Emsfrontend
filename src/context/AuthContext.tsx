import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, tokenStorage } from '../lib/api'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: (googleToken: string) => Promise<void>
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

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔑 Signing in with:', email);
      
      const res = await api.post<{ accessToken: string; refreshToken?: string; user?: User }>(
        '/authentication/sign-in', 
        { email, password }
      );
      
      console.log('📥 Response received:', res.data);
      
      const { accessToken, refreshToken, user } = res.data;
      
      if (!accessToken) {
        throw new Error('No access token received');
      }
      
      tokenStorage.set(accessToken, refreshToken);
      console.log('💾 Token saved to localStorage');
      
      const saved = tokenStorage.getAccessToken();
      console.log('🔑 Saved token:', saved ? '✅ Yes' : '❌ No');
      
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

  const signInWithGoogle = useCallback(async (googleToken: string) => {
    try {
      console.log('🔑 Signing in with Google');
      console.log('📤 Google token (first 20 chars):', googleToken.substring(0, 20) + '...');
      console.log('📤 Google token length:', googleToken.length);
      
      const res = await api.post<{ accessToken: string; refreshToken?: string; user?: User }>(
        '/authentication/google',
        { token: googleToken }
      );
      
      console.log('📥 Google auth response status:', res.status);
      console.log('📥 Google auth response data:', res.data);
      
      if (!res.data) {
        console.error('❌ No data in response');
        throw new Error('No response data received');
      }
      
      const { accessToken, refreshToken, user } = res.data;
      
      console.log('📊 Extracted from response:');
      console.log('  - accessToken:', accessToken ? '✅ Present' : '❌ Missing');
      console.log('  - refreshToken:', refreshToken ? '✅ Present' : '❌ Missing');
      console.log('  - user:', user ? '✅ Present' : '❌ Missing');
      
      if (!accessToken) {
        console.error('❌ No access token in response. Full response:', res.data);
        throw new Error('No access token received');
      }
      
      tokenStorage.set(accessToken, refreshToken);
      console.log('💾 Google token saved to localStorage');
      
      if (user) {
        console.log('👤 User set from response:', user);
        setUser(user);
      } else {
        console.log('👤 No user in response, loading user...');
        await loadUser();
      }
      
      console.log('✅ Google sign-in completed successfully');
      
    } catch (error: unknown) {
      console.error('❌ Google SignIn error:', error);
      
      // Type guard to safely access error properties
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error as { response: { data: unknown; status: number; headers: unknown } };
        console.error('📥 Error response data:', errorResponse.response.data);
        console.error('📥 Error response status:', errorResponse.response.status);
        console.error('📥 Error response headers:', errorResponse.response.headers);
      }
      
      throw error;
    }
  }, [loadUser]);

  const signUp = useCallback(async (name: string, email: string, password: string, confirmPassword: string) => {
    const res = await api.post<{ otpRequired: boolean; challengeId: string }>(
      '/authentication/sign-up', 
      { name, email, password, confirmPassword }
    )
    return res.data
  }, [])

  const verifyOtp = useCallback(async (challengeId: string, otp: string) => {
    await api.post('/authentication/sign-up/verify', { challengeId, otp })
  }, [])

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
      signInWithGoogle,
      signUp, 
      verifyOtp,
      resendOtp,
      signOut, 
      refreshUser: loadUser 
    }),
    [user, loading, signIn, signInWithGoogle, signUp, verifyOtp, resendOtp, signOut, loadUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}