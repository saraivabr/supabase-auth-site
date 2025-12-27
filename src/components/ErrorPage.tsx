import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/layouts/AuthLayout'

export type ErrorType = 'auth' | 'network' | 'not-found' | 'server' | 'unknown'

interface ErrorPageProps {
  /**
   * Type of error to display
   */
  type?: ErrorType
  /**
   * Error title (defaults based on type)
   */
  title?: string
  /**
   * Error message to display
   */
  message: string
  /**
   * Primary action button label
   */
  actionLabel?: string
  /**
   * Primary action callback
   */
  onAction?: () => void
  /**
   * Secondary action button label
   */
  secondaryActionLabel?: string
  /**
   * Secondary action callback
   */
  onSecondaryAction?: () => void
  /**
   * Whether to use AuthLayout (default: true)
   */
  useAuthLayout?: boolean
}

const ERROR_TITLES: Record<ErrorType, string> = {
  auth: 'Erro de Autenticação',
  network: 'Erro de Rede',
  'not-found': 'Página Não Encontrada',
  server: 'Erro do Servidor',
  unknown: 'Algo Deu Errado',
}

const ERROR_ICONS: Record<ErrorType, typeof AlertCircle> = {
  auth: AlertCircle,
  network: AlertCircle,
  'not-found': AlertCircle,
  server: AlertCircle,
  unknown: AlertCircle,
}

/**
 * Full-page error component
 *
 * Displays error messages in a consistent, user-friendly way
 * with appropriate actions for recovery
 *
 * @example
 * ```tsx
 * <ErrorPage
 *   type="auth"
 *   message="No session found. Please try signing in again."
 *   actionLabel="Return to sign in"
 *   onAction={() => navigate({ to: '/signin' })}
 * />
 * ```
 */
export function ErrorPage({
  type = 'unknown',
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  useAuthLayout = true,
}: ErrorPageProps) {
  const displayTitle = title || ERROR_TITLES[type]
  const Icon = ERROR_ICONS[type]

  const content = (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {displayTitle}
        </h2>
      </div>

      <Alert variant="destructive">
        <Icon className="h-4 w-4" />
        <AlertTitle>{displayTitle}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>

      <div className="space-y-3">
        {onAction && (
          <Button onClick={onAction} className="w-full">
            {actionLabel || 'Voltar'}
          </Button>
        )}

        {onSecondaryAction && (
          <Button
            onClick={onSecondaryAction}
            variant="outline"
            className="w-full"
          >
            {secondaryActionLabel || 'Tentar Novamente'}
          </Button>
        )}
      </div>
    </div>
  )

  if (useAuthLayout) {
    return <AuthLayout>{content}</AuthLayout>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">{content}</div>
    </div>
  )
}
