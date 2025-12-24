import { siteConfig } from './config'

/**
 * Inject theme colors from config into CSS custom properties
 * This allows dynamic theming based on user configuration
 *
 * Call this once during app initialization (in main.tsx)
 */
export function injectThemeColors(): void {
  if (typeof document === 'undefined') {
    return // SSR safety
  }

  const { theme } = siteConfig

  // Create style element with CSS custom properties
  const style = document.createElement('style')
  style.id = 'config-theme-colors'

  style.textContent = `
    :root {
      --config-brand-color: ${theme.brandColor};
      --config-accent-color: ${theme.accentColor};
      --config-gradient-from: ${theme.gradientFrom};
      --config-gradient-via: ${theme.gradientVia};
      --config-gradient-to: ${theme.gradientTo};
    }
  `.trim()

  // Remove existing theme colors if present (for hot reload)
  const existing = document.getElementById('config-theme-colors')
  if (existing) {
    existing.remove()
  }

  document.head.appendChild(style)
}
