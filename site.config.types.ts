/**
 * Site Configuration Type Definitions
 *
 * This file defines the structure of the site configuration.
 * All configuration options are typed for safety and autocomplete.
 */

export interface SiteConfig {
  /** Basic site information */
  site: {
    /** Site name (used in titles, meta tags, logo fallback) */
    name: string
    /** Main slogan or tagline displayed on auth pages */
    slogan: string
    /** Short description (used in sidebar and meta tags) */
    description: string
    /** Copyright text shown in footer */
    copyright: string
  }

  /** Branding and visual assets */
  branding: {
    /** Logo configuration */
    logo: {
      /** URL to custom logo image (e.g., '/logo.png') */
      url?: string
      /** Text-based logo (fallback if no image provided) */
      text?: string
      /** Single letter or emoji for icon */
      icon?: string
    }
    /** Path to favicon */
    favicon: string
  }

  /** Theme colors (CSS color values: hex, rgb, hsl, etc.) */
  theme: {
    /** Primary brand color (buttons, accents) */
    brandColor: string
    /** Secondary accent color */
    accentColor: string
    /** Sidebar gradient start color */
    gradientFrom: string
    /** Sidebar gradient middle color */
    gradientVia: string
    /** Sidebar gradient end color */
    gradientTo: string
  }

  /** Authentication configuration */
  auth: {
    /** OAuth provider settings - supports any Supabase OAuth provider */
    providers: Record<
      string,
      {
        /** Enable/disable this OAuth provider */
        enabled: boolean
        /** Display name (defaults to capitalized provider key) */
        displayName?: string
        /** OAuth scopes to request (provider-specific) */
        scopes?: string
        /** Icon identifier (lucide-react icon name, defaults to provider key) */
        icon?: string
      }
    >
    /** Cloudflare Turnstile CAPTCHA */
    turnstile: {
      /** Enable/disable CAPTCHA (requires VITE_TURNSTILE_SITE_KEY) */
      enabled: boolean
    }
    /** Session cookie configuration */
    cookieOptions?: {
      /** Cookie expiration in days (default: 365) */
      expires?: number
      /** Cookie sameSite policy (default: 'Lax') */
      sameSite?: 'Lax' | 'Strict' | 'None'
    }
  }

  /** Feature toggles */
  features: {
    /** Auth sidebar configuration (desktop only) */
    sidebar: {
      /** Show/hide the branded sidebar */
      enabled: boolean
      /** Feature highlights to display */
      features: Array<{
        /** Feature title */
        title: string
        /** Feature description */
        description: string
      }>
    }
  }

  /** Redirect URLs */
  redirects: {
    /** Where to redirect after successful sign-in */
    afterSignIn: string
    /** Where to redirect after sign-out */
    afterSignOut: string
  }
}
