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
 * // ['google', 'github'] or ['google'] or []
 * ```
 */
export function getEnabledProviders(): Array<'google' | 'github'> {
  const providers: Array<'google' | 'github'> = []

  if (siteConfig.auth.providers.google.enabled) {
    providers.push('google')
  }

  if (siteConfig.auth.providers.github.enabled) {
    providers.push('github')
  }

  return providers
}

/**
 * Check if Turnstile CAPTCHA is enabled
 *
 * @returns true if Turnstile is configured and enabled
 */
export function isTurnstileEnabled(): boolean {
  return siteConfig.auth.turnstile.enabled
}
