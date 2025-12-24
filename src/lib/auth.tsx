import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { AuthError, Session, User } from '@supabase/supabase-js'

export type Provider = 'google' | 'github'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (
    email: string,
    password: string,
    captchaToken?: string,
  ) => Promise<{ error: AuthError | null }>
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  signInWithOAuth: (
    provider: Provider,
    redirectTo?: string,
  ) => Promise<{ error: AuthError | null }>
  signInWithOtp: (
    email: string,
    captchaToken?: string,
  ) => Promise<{ error: AuthError | null }>
  verifyOtp: (
    email: string,
    token: string,
    captchaToken?: string,
  ) => Promise<{ error: AuthError | null }>
  getEnabledProviders: () => Promise<Array<Provider>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取初始会话
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      setLoading(false)
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (
    email: string,
    password: string,
    captchaToken?: string,
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      },
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const signInWithOAuth = async (provider: Provider, redirectTo?: string) => {
    // OAuth 回调始终到 /auth/callback，然后由 callback 页面处理最终跳转
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    if (redirectTo) {
      callbackUrl.searchParams.set('redirect', redirectTo)
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl.toString(),
        scopes: provider === 'github' ? 'read:user user:email' : undefined,
      },
    })
    return { error }
  }

  const signInWithOtp = async (email: string, captchaToken?: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        captchaToken,
      },
    })
    return { error }
  }

  const verifyOtp = async (
    email: string,
    token: string,
    captchaToken?: string,
  ) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
      options: {
        captchaToken,
      },
    })
    return { error }
  }

  const getEnabledProviders = async (): Promise<Array<Provider>> => {
    // Import config dynamically to avoid circular dependency
    const { getEnabledProviders: getConfiguredProviders } = await import(
      './config'
    )
    return getConfiguredProviders()
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    signInWithOtp,
    verifyOtp,
    getEnabledProviders,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
