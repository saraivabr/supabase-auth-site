import { Check, Lock } from 'lucide-react'
import type { OAuthAuthorizationDetails } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface ConsentFormProps {
  authDetails: OAuthAuthorizationDetails
  userEmail: string
  onApprove: () => void
  onDeny: () => void
  processing: boolean
  error?: string
}

export function ConsentForm({
  authDetails,
  userEmail,
  onApprove,
  onDeny,
  processing,
  error,
}: ConsentFormProps) {
  const scopes = authDetails.scope.split(' ')
  const useTwoColumns = scopes.length >= 6

  const getScopeDisplayName = (scope: string): string => {
    // Map common OAuth scopes to readable names
    const scopeMap: Record<string, string> = {
      'openid': 'OpenID Connect',
      'profile': 'Access your profile information',
      'email': 'Access your email address',
      'offline_access': 'Offline access to your data',
      'read': 'Read your data',
      'write': 'Modify your data',
    }
    return scopeMap[scope] || scope
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Client Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Lock className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Authorize access
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <strong>{authDetails.client.name}</strong> wants to access your account
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Scope List */}
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            This application will be able to:
          </p>
          <ul
            className={cn(
              useTwoColumns
                ? 'grid grid-cols-1 md:grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2'
                : 'space-y-1.5 sm:space-y-2',
            )}
          >
            {scopes.map((scope) => (
              <li key={scope} className="flex items-start">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 dark:text-green-400 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words">
                  {getScopeDisplayName(scope)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator className="my-4 sm:my-5" />

      <div className="space-y-4 sm:space-y-5">
        {/* Disclaimer */}
        <div className="space-y-2 sm:space-y-3 text-center">
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-tight">
            By authorizing, you allow <strong>{authDetails.client.name}</strong> to access your information according to their privacy policy and terms of service.
          </p>
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
            Signed in as <strong>{userEmail}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 sm:space-y-3 w-full">
          <Button
            onClick={onApprove}
            disabled={processing}
            size="lg"
            className="w-full h-10 sm:h-11 text-sm sm:text-base"
          >
            {processing ? 'Processing...' : 'Authorize'}
          </Button>

          <Button
            onClick={onDeny}
            disabled={processing}
            variant="outline"
            size="lg"
            className="w-full h-10 sm:h-11 text-sm sm:text-base"
          >
            Deny
          </Button>
        </div>
      </div>
    </div>
  )
}
