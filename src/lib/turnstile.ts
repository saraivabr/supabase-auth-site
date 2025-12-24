export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

if (!TURNSTILE_SITE_KEY) {
  console.warn('VITE_TURNSTILE_SITE_KEY is not set in environment variables')
}
