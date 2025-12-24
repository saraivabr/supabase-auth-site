import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { useAuth } from '@/lib/auth'
import { siteConfig } from '@/lib/config'
import { TURNSTILE_SITE_KEY } from '@/lib/turnstile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EmailPasswordLoginFormProps {
  redirectTo?: string
}

export function EmailPasswordLoginForm({
  redirectTo,
}: EmailPasswordLoginFormProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [showTurnstile, setShowTurnstile] = useState(false)
  const [turnstileKey, setTurnstileKey] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    const { error: authError } = await signIn(email, password, turnstileToken!)

    if (authError) {
      setError(authError.message)
      setLoading(false)
      // Reset Turnstile to allow retry - force remount to generate new token
      setTurnstileToken(null)
      setTurnstileKey((prev) => prev + 1)
    } else {
      // Redirect after successful login
      window.location.href = redirectTo || siteConfig.redirects.afterSignIn
    }
  }

  const handlePasswordFocus = () => {
    // Show Turnstile when user starts entering password
    if (TURNSTILE_SITE_KEY && !showTurnstile) {
      setShowTurnstile(true)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
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

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={handlePasswordFocus}
            disabled={loading}
            required
          />
        </div>

        {TURNSTILE_SITE_KEY && showTurnstile && (
          <div className="flex justify-center">
            <Turnstile
              key={turnstileKey}
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
            'Sign in'
          )}
        </Button>
      </div>
    </form>
  )
}
