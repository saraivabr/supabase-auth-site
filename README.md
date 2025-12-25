# Supabase Auth Site

A generic, fully configurable authentication site powered by Supabase. Deploy your own branded auth pages in minutes with zero code changes required.

## Features

- **Multiple Auth Methods**
  - Email/Password authentication
  - OAuth providers (Google, GitHub)
  - Email OTP (Magic Link)
  - OAuth authorization consent flow

- **Fully Customizable**
  - No code changes needed - just update `site.config.ts`
  - Custom branding (logo, colors, slogan)
  - Theme customization with gradient support
  - Toggle features on/off via configuration

- **Modern Tech Stack**
  - React 19 + TypeScript
  - TanStack Router (file-based routing)
  - Tailwind CSS 4 + shadcn/ui components
  - Supabase Auth (PKCE flow)
  - Vite build tool

- **Production Ready**
  - Responsive design (mobile-first)
  - Dark mode support
  - Cloudflare Turnstile CAPTCHA integration
  - Session management
  - OAuth consent flow

- **Cross-Domain SSO**
  - Cookie-based session sharing across subdomains
  - Automatic JWT extraction for backend APIs
  - Works seamlessly with auth.example.com, console.example.com, etc.
  - See [CROSS_DOMAIN_AUTH.md](./docs/CROSS_DOMAIN_AUTH.md) for details

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd supabase-auth-site
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# For cross-domain SSO (optional)
VITE_COOKIE_DOMAIN=.example.com  # Enables session sharing across subdomains
```

Get these values from: [Supabase Dashboard](https://app.supabase.com) → Your Project → Settings → API

**For SSO across subdomains**: Set `VITE_COOKIE_DOMAIN` to your root domain (e.g., `.example.com`). See [CROSS_DOMAIN_AUTH.md](./docs/CROSS_DOMAIN_AUTH.md) for complete setup guide.

### 3. Customize Branding

The `site.config.ts` file contains all customization options. Edit it to match your brand:

```typescript
export const siteConfig: SiteConfig = {
  site: {
    name: 'My App',
    slogan: 'Welcome to My App',
    description: 'Sign in to access your account',
    copyright: '© 2025 My Company',
  },
  branding: {
    logo: {
      text: 'My App',
      icon: 'M',
      // Or use a custom image:
      // url: '/logo.png',
    },
    favicon: '/favicon.ico',
  },
  theme: {
    brandColor: '#10b981',      // Your brand color
    accentColor: '#3b82f6',
    gradientFrom: '#10b981',    // Sidebar gradient
    gradientVia: '#059669',
    gradientTo: '#3b82f6',
  },
  // ... see site.config.default.ts for all options
}
```

See [CONFIG.md](./CONFIG.md) for detailed configuration documentation.

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Configuration Guide

### Basic Setup

The minimum configuration needed:

1. **Environment Variables** (`.env`)
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

2. **Site Config** (`site.config.ts`)
   - Update `site.name`, `site.slogan`, `site.description`
   - Set `redirects.afterSignIn` to your app's main page

### Advanced Customization

- **Custom Logo**: Set `branding.logo.url` to use a custom image
- **Theme Colors**: Customize `theme.brandColor` and gradient colors
- **OAuth Providers**: Enable/disable Google and GitHub in `auth.providers`
- **Sidebar**: Toggle with `features.sidebar.enabled` or customize features list
- **CAPTCHA**: Enable Turnstile and set `VITE_TURNSTILE_SITE_KEY`

Full configuration reference: [CONFIG.md](./CONFIG.md)

## Supabase Setup

### 1. Create a Supabase Project

1. Sign up at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key to `.env`

### 2. Configure OAuth Providers

#### Google OAuth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google Client ID and Secret
4. Add redirect URL: `https://your-auth-site.com/callback`

#### GitHub OAuth

1. Enable GitHub provider in Supabase
2. Add your GitHub Client ID and Secret
3. Add redirect URL: `https://your-auth-site.com/callback`

### 3. Email Templates (Optional)

Customize email templates in Supabase Dashboard → Authentication → Email Templates

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_TURNSTILE_SITE_KEY` (optional)
4. Deploy!

### Netlify

1. Push to GitHub
2. Import project in Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables
5. Deploy!

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t supabase-auth-site .
docker run -p 8080:80 supabase-auth-site
```

## Project Structure

```
supabase-auth-site/
├── site.config.ts              # Your customization file
├── site.config.default.ts      # Example config with all options
├── site.config.types.ts        # TypeScript type definitions
├── docs/
|   |---CROSS_DOMAIN_AUTH.md        # Cross-domain SSO setup guide
├── src/
│   ├── components/
│   │   ├── auth/               # Auth form components
│   │   ├── oauth/              # OAuth consent components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Logo.tsx            # Configurable logo component
│   │   └── login-form.tsx      # Main login form
│   ├── layouts/
│   │   └── AuthLayout.tsx      # Two-column auth layout
│   ├── lib/
│   │   ├── auth.tsx            # Auth context provider
│   │   ├── config.ts           # Config utilities
│   │   ├── supabase.ts         # Supabase client (with cookie storage)
│   │   ├── cookieStorage.ts    # Cookie storage adapter for SSO
│   │   ├── apiClient.ts        # API client with automatic JWT
│   │   ├── theme.ts            # Theme injection
│   │   ├── redirect.ts         # Redirect handling
│   │   └── route-guards.ts     # Route protection
│   ├── routes/                 # File-based routes
│   │   ├── signin.tsx          # Sign-in page
│   │   ├── callback.tsx        # OAuth callback
│   │   ├── verify-otp.tsx      # OTP verification
│   │   └── oauth/
│   │       └── consent.tsx     # OAuth authorization
│   └── main.tsx                # App entry point
├── public/                     # Static assets
└── .env                        # Environment variables
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

### Adding New UI Components

This project uses shadcn/ui. Add components with:

```bash
npx shadcn@latest add <component-name>
```

Example:

```bash
npx shadcn@latest add dialog
```

## Security

- **Never commit `.env`** - It contains sensitive credentials
- **Use environment variables** - Don't hardcode secrets
- **Enable RLS** - Configure Row Level Security in Supabase
- **HTTPS only** - Always use HTTPS in production
- **CAPTCHA** - Enable Turnstile to prevent bot attacks

## Troubleshooting

### OAuth redirect not working

- Check redirect URL matches exactly in Supabase settings
- Ensure URL includes `/callback` path
- Verify OAuth provider credentials

### Styles not loading

- Clear browser cache
- Check Tailwind CSS is configured correctly
- Verify `npm run build` completes successfully

### Auth session not persisting

- Check Supabase URL and keys are correct
- Verify PKCE flow is enabled
- Check browser allows localStorage/sessionStorage

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this for your projects!

## Support

- Documentation:
  - [CONFIG.md](./docs/CONFIG.md) - Site configuration reference
  - [CROSS_DOMAIN_AUTH.md](./docs/CROSS_DOMAIN_AUTH.md) - Cross-domain SSO setup guide
- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- TanStack Router: [https://tanstack.com/router](https://tanstack.com/router)
- shadcn/ui: [https://ui.shadcn.com](https://ui.shadcn.com)

## Acknowledgments

- Built with [Supabase](https://supabase.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Routing by [TanStack Router](https://tanstack.com/router)
- Styling with [Tailwind CSS](https://tailwindcss.com)
