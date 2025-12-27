import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface AuthorizationErrorProps {
  error: string
  title?: string
  onSignOut?: () => void
}

export function AuthorizationError({
  error,
  title,
  onSignOut,
}: AuthorizationErrorProps) {
  const displayTitle = title || 'Falha na Autorização'

  return (
    <div className="space-y-3 sm:space-y-4">
      <Alert variant="destructive" className="w-full">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-sm sm:text-base">{displayTitle}</AlertTitle>
        <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
      </Alert>
      <div className="text-xs sm:text-sm text-muted-foreground mb-2">
        Você pode tentar sair e entrar novamente com uma conta diferente.
      </div>
      <Button onClick={onSignOut} className="w-full h-10 sm:h-11 text-sm sm:text-base">
        Sair e Tentar Novamente
      </Button>
    </div>
  )
}
