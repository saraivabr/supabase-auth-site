import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import { useAuth } from '@/lib/auth'
import { siteConfig } from '@/lib/config'
import { TURNSTILE_SITE_KEY } from '@/lib/turnstile'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/verify-otp')({
  component: VerifyOtpPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: search.email as string | undefined,
      redirect: search.redirect as string | undefined,
    }
  },
})

function VerifyOtpPage() {
  const navigate = useNavigate()
  const { verifyOtp, user } = useAuth()
  const { email, redirect } = Route.useSearch()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const handleBackToSignIn = () => {
    navigate({ to: '/signin' })
  }

  // If already logged in, redirect to destination
  if (user) {
    window.location.href = redirect || siteConfig.redirects.afterSignIn
    return null
  }

  // If no email provided, go back to sign in
  if (!email) {
    handleBackToSignIn()
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please complete the verification')
      return
    }

    setLoading(true)
    setError('')

    const { error: verifyError } = await verifyOtp(
      email,
      otp,
      turnstileToken || undefined,
    )

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      // Reset Turnstile
      setTurnstileToken(null)
    } else {
      // Verification successful, redirect to destination
      window.location.href = redirect || siteConfig.redirects.afterSignIn
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Verify your email
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter the code we sent to {email}
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {error && (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="otp">
                Verification Code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                required
                maxLength={6}
                autoComplete="one-time-code"
                className="h-11"
              />
            </div>

            {TURNSTILE_SITE_KEY && (
              <div className="flex justify-center">
                <Turnstile
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading || (TURNSTILE_SITE_KEY && !turnstileToken)}
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                'Verify'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11"
              onClick={handleBackToSignIn}
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
