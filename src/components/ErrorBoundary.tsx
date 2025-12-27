import { Component, type ReactNode } from 'react'
import { ErrorPage } from './ErrorPage'

interface ErrorBoundaryProps {
  children: ReactNode
  /**
   * Optional fallback component to render instead of default ErrorPage
   */
  fallback?: ReactNode
  /**
   * Optional callback when error is caught
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * React Error Boundary component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={<CustomErrorPage />}
 *   onError={(error) => logErrorToService(error)}
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call optional error callback
    this.props.onError?.(error, errorInfo)

    // TODO: Log to error reporting service in production
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error page
      return (
        <ErrorPage
          type="unknown"
          title="Algo Deu Errado"
          message={
            this.state.error?.message ||
            'Ocorreu um erro inesperado. Por favor, tente atualizar a página.'
          }
          actionLabel="Recarregar Página"
          onAction={() => window.location.reload()}
          secondaryActionLabel="Ir para Início"
          onSecondaryAction={() => (window.location.href = '/')}
          useAuthLayout={false}
        />
      )
    }

    return this.props.children
  }
}
