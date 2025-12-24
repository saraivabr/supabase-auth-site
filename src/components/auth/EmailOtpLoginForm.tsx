import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Turnstile } from '@marsidev/react-turnstile'
import { useAuth } from '@/lib/auth'
import { TURNSTILE_SITE_KEY } from '@/lib/turnstile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EmailOtpLoginFormProps {
  redirectTo?: string
  onBack?: () => void
}

export function EmailOtpLoginForm({
  redirectTo,
  onBack,
}: EmailOtpLoginFormProps) {
  const navigate = useNavigate()
  const { signInWithOtp } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please complete the verification')
      return
    }

    setLoading(true)
    setError('')

    const { error: otpError } = await signInWithOtp(
      email,
      turnstileToken || undefined,
    )

    if (otpError) {
      setError(otpError.message)
      setLoading(false)
      // Reset Turnstile
      setTurnstileToken(null)
    } else {
      // Navigate to OTP verification page
      navigate({
        to: '/verify-otp',
        search: { email, redirect: redirectTo },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="w-fit px-0 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to options
          </Button>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
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
          className="w-full"
          disabled={loading || (TURNSTILE_SITE_KEY && !turnstileToken)}
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            'Send verification code'
          )}
        </Button>
      </div>
    </form>
  )
}
