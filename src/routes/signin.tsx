import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginForm } from '@/components/login-form'
import { performPostLoginRedirect, resolveRedirect } from '@/lib/redirect'

export const Route = createFileRoute('/signin')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const search: { redirect?: string } = Route.useSearch()
  const { redirect } = search
  const { user } = useAuth()

  // Save redirect URL to sessionStorage
  // Priority: query parameter > referer > existing sessionStorage value
  resolveRedirect(redirect)

  // If already logged in, redirect to destination
  if (user) {
    performPostLoginRedirect(navigate)
    return null
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
