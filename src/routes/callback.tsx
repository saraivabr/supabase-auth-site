import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { performPostLoginRedirect } from '@/lib/redirect'
import { ErrorPage } from '@/components/ErrorPage'

export const Route = createFileRoute('/callback')({
  component: OAuthCallbackPage,
})

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Wait for auth state to stabilize
    if (loading) return

    if (user) {
      // Session established, redirect to destination
      performPostLoginRedirect(navigate)
    } else {
      // No session, show error
      setError('Nenhuma sessão encontrada. Por favor, tente fazer login novamente.')
    }
  }, [user, loading, navigate])

  if (error) {
    return (
      <ErrorPage
        type="auth"
        message={error}
        actionLabel="Voltar para o login"
        onAction={() => navigate({ to: '/signin' })}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">
          Completando autenticação...
        </p>
      </div>
    </div>
  )
}
