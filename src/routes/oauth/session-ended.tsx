import { createFileRoute } from '@tanstack/react-router'
import { OAuthSessionEnded } from '@/components/oauth'
import { AuthLayout } from '@/layouts/AuthLayout'

export const Route = createFileRoute('/oauth/session-ended')({
  component: OAuthSessionEndedPage,
})

function OAuthSessionEndedPage() {
  return (
    <AuthLayout>
      <OAuthSessionEnded />
    </AuthLayout>
  )
}
