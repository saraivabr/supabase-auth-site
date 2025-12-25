import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { performPostLoginRedirect } from '@/lib/redirect'
import { TURNSTILE_SITE_KEY } from '@/lib/turnstile'
import { TurnstileWidget, type TurnstileWidgetRef } from '@/components/auth/TurnstileWidget'
import { ErrorAlert } from '@/components/ErrorAlert'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/verify-otp')({
  component: VerifyOtpPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: search.email as string | undefined,
    }
  },
})

function VerifyOtpPage() {
  const navigate = useNavigate()
  const { verifyOtp, user } = useAuth()
  const { email } = Route.useSearch()
  const turnstileRef = useRef<TurnstileWidgetRef>(null)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleBackToSignIn = () => {
    navigate({ to: '/signin' })
  }

  // If already logged in, redirect to destination
  if (user) {
    performPostLoginRedirect(navigate)
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
      turnstileRef.current?.reset()
    } else {
      // Verification successful, redirect to destination
      performPostLoginRedirect(navigate)
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
            <ErrorAlert message={error} />

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

            <TurnstileWidget
              ref={turnstileRef}
              onSuccess={setTurnstileToken}
              onTokenCleared={() => setTurnstileToken(null)}
            />

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
