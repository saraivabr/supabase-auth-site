import { Loader2 } from 'lucide-react'

interface AuthorizationLoadingProps {
  message?: string
}

export function AuthorizationLoading({ message }: AuthorizationLoadingProps) {
  return (
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
      {message && (
        <p className="mt-4 text-base md:text-lg text-gray-600">{message}</p>
      )}
    </div>
  )
}
