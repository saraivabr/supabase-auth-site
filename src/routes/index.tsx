import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Redirect root to signin page
    throw redirect({ to: '/signin' })
  },
})