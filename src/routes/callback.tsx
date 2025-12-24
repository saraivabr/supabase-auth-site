import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { siteConfig } from '@/lib/config'

export const Route = createFileRoute('/callback')({
  component: OAuthCallbackPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: search.redirect as string | undefined,
  }),
})

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()
  const { user, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Wait for auth state to stabilize
    if (loading) return

    if (user) {
      // Session established, redirect to destination
      window.location.href = redirect || siteConfig.redirects.afterSignIn
    } else {
      // No session, show error
      setError('No session found. Please try signing in again.')
      setTimeout(() => navigate({ to: '/signin' }), 3000)
    }
  }, [user, loading, navigate, redirect])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-8">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
            <h3 className="font-semibold mb-2">Authentication Error</h3>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-4">Redirecting to sign in...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </div>
  )
}
