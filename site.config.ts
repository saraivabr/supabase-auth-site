import { defaultConfig } from './site.config.default'
import type { SiteConfig } from './site.config.types'

/**
 * Site Configuration
 *
 * Customize this file to configure your auth site.
 * See site.config.default.ts for all available options and examples.
 *
 * Quick Start:
 * 1. Update site.name, site.slogan, and site.description
 * 2. Customize branding.logo (use url for custom image, or text/icon for simple logo)
 * 3. Set theme colors to match your brand
 * 4. Enable/disable OAuth providers based on your Supabase setup
 * 5. Update redirects.afterSignIn to point to your app's main page
 */
export const siteConfig: SiteConfig = {
  ...defaultConfig,

  // Uncomment and customize the sections you want to override:

  site: {
    name: 'Supabase Auth Site',
    slogan: 'Secure Authentication for Your Projects',
    description: 'A customizable authentication site template powered by Supabase and TanStack.',
    copyright: `© ${new Date().getFullYear()} Supabase Auth Site`,
  },

  branding: {
    logo: {
      text: 'Auth Site',
      icon: 'S',
    },
    favicon: '/favicon.svg',
  },

  // theme: {
  //   brandColor: '#your-color',
  //   accentColor: '#your-accent',
  //   gradientFrom: '#gradient-start',
  //   gradientVia: '#gradient-middle',
  //   gradientTo: '#gradient-end',
  // },

  // auth: {
  //   providers: {
  //     google: { enabled: true },
  //     github: { enabled: false },
  //   },
  //   turnstile: { enabled: false },
  // },

  // redirects: {
  //   afterSignIn: '/app',
  //   afterSignOut: '/signin',
  // },
}

export type { SiteConfig } from './site.config.types'
