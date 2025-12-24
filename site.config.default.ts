import type { SiteConfig } from './site.config.types'

/**
 * Default configuration for the Supabase Auth Site
 *
 * Copy this file to `site.config.ts` and customize it for your deployment.
 * This is a complete example showing all available options.
 */
export const defaultConfig: SiteConfig = {
  // Basic site information
  site: {
    name: 'My Auth App',
    slogan: 'Secure Authentication Made Simple',
    description: 'Sign in to access your account',
    copyright: '© 2025 My Auth App',
  },

  // Branding assets
  branding: {
    logo: {
      // Option 1: Use a custom logo image
      // url: '/logo.png',

      // Option 2: Use text-based logo
      text: 'My Auth App',
      icon: 'M',
    },
    favicon: '/favicon.ico',
  },

  // Theme colors (use any valid CSS color format)
  theme: {
    brandColor: '#10b981',      // Emerald-600 (primary buttons, accents)
    accentColor: '#3b82f6',     // Blue-600 (secondary elements)
    gradientFrom: '#10b981',    // Sidebar gradient start (emerald)
    gradientVia: '#059669',     // Sidebar gradient middle (emerald-700)
    gradientTo: '#3b82f6',      // Sidebar gradient end (blue)
  },

  // Authentication configuration
  auth: {
    // OAuth providers (requires Supabase setup)
    providers: {
      google: {
        enabled: true,
      },
      github: {
        enabled: true,
      },
    },
    // Cloudflare Turnstile CAPTCHA (optional)
    turnstile: {
      enabled: false,  // Set to true if VITE_TURNSTILE_SITE_KEY is configured
    },
  },

  // Feature toggles
  features: {
    // Sidebar (desktop only) - shows branding and feature highlights
    sidebar: {
      enabled: true,
      features: [
        {
          title: 'Secure & Reliable',
          description: 'Enterprise-grade security powered by Supabase authentication',
        },
        {
          title: 'Fast Authentication',
          description: 'Sign in quickly with your email or preferred OAuth provider',
        },
        {
          title: 'Privacy First',
          description: 'Your data is encrypted and protected with industry standards',
        },
      ],
    },
  },

  // Post-authentication redirects
  redirects: {
    afterSignIn: '/dashboard',   // Where to redirect after successful sign-in
    afterSignOut: '/signin',     // Where to redirect after sign-out
  },
}
