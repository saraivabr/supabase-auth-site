import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { AuthLayout } from '@/layouts/AuthLayout'

// Generic error component for route-level errors
function DefaultErrorComponent({ error }: { error: Error }) {
  return (
    <AuthLayout>
      <Alert variant="destructive" className="w-full">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-sm sm:text-base">Error</AlertTitle>
        <AlertDescription className="text-xs sm:text-sm">
          {error.message || 'An unexpected error occurred'}
        </AlertDescription>
      </Alert>
    </AuthLayout>
  )
}

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {/* Dev tools only in development */}
      {import.meta.env.DEV && (
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      )}
    </>
  ),
  errorComponent: DefaultErrorComponent,
})
