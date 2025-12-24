/**
 * Redirect URL handling utilities
 *
 * Manages storing and retrieving redirect URLs during the authentication flow.
 * Uses sessionStorage to preserve the user's intended destination across auth redirects.
 */

const AUTH_REDIRECT_KEY = 'auth_redirect_url'

/**
 * Store a redirect URL for use after authentication
 *
 * @param url - The URL to redirect to after sign-in
 *
 * @example
 * ```ts
 * // Before redirecting to signin page:
 * setAuthRedirect('/dashboard/profile')
 * ```
 */
export function setAuthRedirect(url: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(AUTH_REDIRECT_KEY, url)
  }
}

/**
 * Get the stored redirect URL
 *
 * @returns The stored redirect URL, or null if not set
 *
 * @example
 * ```ts
 * // After successful sign-in:
 * const redirectUrl = getAuthRedirect()
 * if (redirectUrl) {
 *   window.location.href = redirectUrl
 * }
 * ```
 */
export function getAuthRedirect(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(AUTH_REDIRECT_KEY)
  }
  return null
}

/**
 * Clear the stored redirect URL
 *
 * @example
 * ```ts
 * // After using the redirect:
 * clearAuthRedirect()
 * ```
 */
export function clearAuthRedirect(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(AUTH_REDIRECT_KEY)
  }
}
