import { useEffect, useState } from 'react'
import {
  Apple,
  Chrome,
  Github,
  Gitlab,
  KeyRound,
  type LucideIcon,
} from 'lucide-react'
import type { Provider } from '@/lib/auth'
import { useAuth } from '@/lib/auth'
import { getProviderConfig, getProviderDisplayName } from '@/lib/config'
import { Button } from '@/components/ui/button'

// Default icon mapping for common providers
const DEFAULT_PROVIDER_ICONS: Record<string, LucideIcon> = {
  apple: Apple,
  google: Chrome,
  github: Github,
  gitlab: Gitlab,
}

/**
 * Get icon component for a provider
 * Falls back to a default key icon if no specific icon is found
 */
function getProviderIcon(provider: string): LucideIcon {
  const config = getProviderConfig(provider)

  // If custom icon name is specified in config, try to use it
  if (config?.icon && DEFAULT_PROVIDER_ICONS[config.icon.toLowerCase()]) {
    return DEFAULT_PROVIDER_ICONS[config.icon.toLowerCase()]
  }

  // Try to find icon by provider name
  return DEFAULT_PROVIDER_ICONS[provider.toLowerCase()] || KeyRound
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
          const Icon = getProviderIcon(provider)
          const isLoading = loading === provider
          const providerName = getProviderDisplayName(provider)
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
