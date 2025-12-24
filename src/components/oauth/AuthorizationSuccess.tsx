import { useRef, useState } from 'react'
import { CheckCircle2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface AuthorizationSuccessProps {
  redirectUrl: string
  userEmail: string
  userAvatarUrl?: string
  onSignOut?: () => void
}

export function AuthorizationSuccess({
  redirectUrl,
  userEmail,
  userAvatarUrl,
  onSignOut,
}: AuthorizationSuccessProps) {
  const [showUrl, setShowUrl] = useState(false)
  const clickCountRef = useRef(0)
  const clickTimeoutRef = useRef<number | null>(null)

  const handleIconClick = () => {
    clickCountRef.current += 1

    if (clickTimeoutRef.current !== null) {
      clearTimeout(clickTimeoutRef.current)
    }

    if (clickCountRef.current >= 3) {
      setShowUrl(true)
      clickCountRef.current = 0
    } else {
      clickTimeoutRef.current = window.setTimeout(() => {
        clickCountRef.current = 0
      }, 1000)
    }
  }

  const getUserInitials = (email: string): string => {
    const parts = email.split('@')
    if (parts.length > 0 && parts[0]) {
      return parts[0].substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Success Icon */}
      <div
        className="flex items-center justify-center cursor-pointer select-none"
        onClick={handleIconClick}
      >
        <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-green-600 dark:text-green-400" />
      </div>

      {/* Success Title */}
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-semibold text-green-900 dark:text-green-100">
          Authorization successful
        </h3>
        <p className="text-sm text-green-800 dark:text-green-300">
          You will be redirected shortly
        </p>
      </div>

      {/* Debug URL (hidden by default) */}
      {showUrl && (
        <p className="text-[10px] sm:text-xs md:text-sm text-blue-600 dark:text-blue-400 text-center break-all bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-md">
          {redirectUrl}
        </p>
      )}

      <Separator />

      {/* User Info */}
      <div className="flex items-center justify-center space-x-3 sm:space-x-4">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
          {userAvatarUrl && (
            <AvatarImage src={userAvatarUrl} alt={userEmail} />
          )}
          <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm">
            {getUserInitials(userEmail)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
            Signed in as
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px] sm:max-w-none">{userEmail}</p>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 sm:space-y-3">
        {/* Return to App Button */}
        <Button asChild size="lg" className="w-full h-10 sm:h-11 text-sm sm:text-base">
          <a href={redirectUrl} rel="external">
            Return to Application
          </a>
        </Button>

        {/* Sign Out Button (Optional) */}
        {onSignOut && (
          <Button
            onClick={onSignOut}
            variant="outline"
            size="lg"
            className="w-full h-10 sm:h-11 text-sm sm:text-base"
          >
            <LogOut className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Sign Out
          </Button>
        )}
      </div>
    </div>
  )
}
