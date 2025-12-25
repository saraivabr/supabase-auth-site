import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorAlertProps {
  /**
   * Error message to display
   */
  message: string
  /**
   * Optional title for the error
   */
  title?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Reusable inline error alert component
 *
 * Displays error messages consistently across the application
 * using shadcn/ui Alert component with destructive variant
 *
 * @example
 * ```tsx
 * {error && <ErrorAlert message={error} />}
 * ```
 */
export function ErrorAlert({ message, title, className }: ErrorAlertProps) {
  if (!message) return null

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      {title && <div className="font-semibold mb-1">{title}</div>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
