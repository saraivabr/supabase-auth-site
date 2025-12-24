import { useMemo } from 'react'
import { siteConfig } from '@/../site.config'
import type { SiteConfig } from '@/../site.config'

export type { SiteConfig }

/**
 * Site configuration instance
 * Import this to access configuration values
 */
export { siteConfig }

/**
 * React hook to access site configuration
 * Use this in components to get config values
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const config = useSiteConfig()
 *   return <h1>{config.site.name}</h1>
 * }
 * ```
 */
export function useSiteConfig(): SiteConfig {
  return useMemo(() => siteConfig, [])
}

/**
 * Get list of enabled OAuth providers from config
 *
 * @returns Array of enabled provider names
 *
 * @example
 * ```ts
 * const providers = getEnabledProviders()
 * // ['google', 'github', 'gitlab'] or ['google'] or []
 * ```
 */
export function getEnabledProviders(): string[] {
  return Object.entries(siteConfig.auth.providers)
    .filter(([_, config]) => config.enabled)
    .map(([provider]) => provider)
}

/**
 * Get configuration for a specific OAuth provider
 *
 * @param provider - Provider name (e.g., 'google', 'github')
 * @returns Provider configuration or undefined if not found
 *
 * @example
 * ```ts
 * const googleConfig = getProviderConfig('google')
 * // { enabled: true, displayName: 'Google', ... }
 * ```
 */
export function getProviderConfig(provider: string) {
  return siteConfig.auth.providers[provider]
}

/**
 * Get display name for a provider
 *
 * @param provider - Provider name
 * @returns Display name (falls back to capitalized provider name)
 *
 * @example
 * ```ts
 * getProviderDisplayName('google') // 'Google'
 * getProviderDisplayName('github') // 'GitHub'
 * ```
 */
export function getProviderDisplayName(provider: string): string {
  const config = getProviderConfig(provider)
  return (
    config?.displayName || provider.charAt(0).toUpperCase() + provider.slice(1)
  )
}

/**
 * Check if Turnstile CAPTCHA is enabled
 *
 * @returns true if Turnstile is configured and enabled
 */
export function isTurnstileEnabled(): boolean {
  return siteConfig.auth.turnstile.enabled
}
