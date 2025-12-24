import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { siteConfig } from '@/lib/config'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginForm } from '@/components/login-form'
import { getAuthRedirect, setAuthRedirect } from '@/lib/redirect'

export const Route = createFileRoute('/signin')({
  component: LoginPage,
})

function LoginPage() {
  const { user } = useAuth()
  const search: { redirect?: string } = Route.useSearch()
  const { redirect } = search
  const redirectTo = redirect ?? getAuthRedirect() ?? undefined

  // Save redirect parameter to session storage if present
  if (redirect) {
    setAuthRedirect(redirect)
  }

  // If already logged in, redirect to destination
  if (user) {
    window.location.href = redirectTo || siteConfig.redirects.afterSignIn
    return null
  }

  return (
    <AuthLayout>
      <LoginForm redirectTo={redirectTo} />
    </AuthLayout>
  )
}
