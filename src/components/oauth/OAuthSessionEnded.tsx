import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function OAuthSessionEnded() {

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Sessão encerrada
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Você pode fechar esta janela com segurança
          </p>
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        size="lg"
        className="w-full h-11"
        onClick={() => window.close()}
      >
        Fechar janela
      </Button>
    </div>
  )
}
