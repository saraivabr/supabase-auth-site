import { useEffect, useState } from 'react'
import { Chrome, Github } from 'lucide-react'
import type { Provider } from '@/lib/auth'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

const PROVIDER_ICONS: Record<
  Provider,
  React.ComponentType<{ className?: string }>
> = {
  google: Chrome,
  github: Github,
}

const PROVIDER_NAMES: Record<Provider, string> = {
  google: 'Google',
  github: 'GitHub',
}

interface SocialLoginButtonsProps {
  redirectTo?: string
  primaryProvider?: Provider
  showHint?: boolean
}

export function SocialLoginButtons({
  redirectTo,
  primaryProvider,
  showHint = false,
}: SocialLoginButtonsProps) {
  const { signInWithOAuth, getEnabledProviders } = useAuth()
  const [providers, setProviders] = useState<Array<Provider>>([])
  const [loading, setLoading] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getEnabledProviders().then(setProviders)
  }, [getEnabledProviders])

  const handleSocialLogin = async (provider: Provider) => {
    setLoading(provider)
    setError(null)

    const { error: authError } = await signInWithOAuth(provider, redirectTo)

    if (authError) {
      setError(authError.message)
      setLoading(null)
    }
  }

  if (providers.length === 0) return null

  const orderedProviders = primaryProvider
    ? [...providers].sort((a, b) => {
        if (a === primaryProvider) return -1
        if (b === primaryProvider) return 1
        return 0
      })
    : providers

  return (
    <div className="space-y-4">
      {showHint && (
        <div className="text-center text-xs text-muted-foreground">
          Or sign in with
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="grid gap-3">
        {orderedProviders.map((provider) => {
          const Icon = PROVIDER_ICONS[provider]
          const isLoading = loading === provider
          const providerName = PROVIDER_NAMES[provider]
          const buttonText = `Continue with ${providerName}`
          const isPrimary =
            primaryProvider !== undefined && provider === primaryProvider

          return (
            <Button
              key={provider}
              type="button"
              variant={isPrimary ? 'default' : 'outline'}
              disabled={loading !== null}
              onClick={() => handleSocialLogin(provider)}
              className={
                isPrimary
                  ? 'h-11 justify-center gap-2 text-sm font-medium shadow-sm ring-1 ring-primary/15'
                  : 'h-11 justify-center gap-2 border-border/60 bg-background text-sm font-medium hover:bg-muted hover:border-border'
              }
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Icon className="h-5 w-5" />
              )}
              <span>{buttonText}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
