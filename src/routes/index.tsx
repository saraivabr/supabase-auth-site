import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { LogOut, Mail, User, Clock, Shield, Key, Settings, Fingerprint, Layers } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({
        to: '/signin',
      })
    }
  },
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const { user, session, loading, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/signin' })
  }

  // Show loading state while AuthProvider initializes
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const getUserInitials = (email: string): string => {
    const parts = email.split('@')
    if (parts.length > 0 && parts[0]) {
      return parts[0].substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12 lg:py-16 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px]">
            You have successfully authenticated. Here is your session and profile information.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          
          {/* Main User Profile - Full Width on Mobile, 8/12 on Desktop */}
          <Card className="col-span-12 lg:col-span-8 p-6 md:p-8 flex flex-col justify-between shadow-lg border-muted/40">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-xl shrink-0">
                {user?.user_metadata?.avatar_url && (
                  <AvatarImage
                    src={user.user_metadata.avatar_url}
                    alt={user.email || 'User'}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                  {getUserInitials(user?.email || '')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left space-y-3 min-w-0 w-full">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Authenticated User
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                   <Badge variant="secondary" className="px-3 py-1.5 text-sm font-normal">
                    <Mail className="h-3.5 w-3.5 mr-2 opacity-70" />
                    <span className="truncate max-w-[200px]">{user?.email}</span>
                  </Badge>
                  {user?.email_confirmed_at && (
                    <Badge variant="outline" className="px-3 py-1.5 text-sm font-normal text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                      <Shield className="h-3.5 w-3.5 mr-2" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                   <div className="flex items-center justify-center sm:justify-start gap-2">
                      <User className="h-4 w-4 shrink-0" />
                      <span className="truncate">ID: <span className="font-mono text-xs">{user?.id.substring(0, 8)}...</span></span>
                   </div>
                   {user?.created_at && (
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
               <Button asChild variant="default" size="lg" className="w-full sm:w-auto shadow-sm transition-all hover:scale-105">
                <Link to="/console">
                  <Settings className="h-4 w-4 mr-2" />
                  Console Dashboard
                </Link>
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>

          {/* Sidebar - Session Info & Stats */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
             {/* Session Card */}
             <Card className="p-6 border-muted/40 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Key className="h-4 w-4 text-primary" />
                    Session Details
                  </h3>
                  <Badge variant="outline" className="text-[10px] uppercase">Active</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Layers className="h-3 w-3" /> Provider
                    </span>
                     <div className="flex items-center gap-2">
                       <Badge variant="secondary" className="capitalize w-full justify-center py-1">
                         {user?.app_metadata?.provider || 'email'}
                       </Badge>
                     </div>
                  </div>
                   
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expires At</span>
                    <div className="bg-muted/30 p-2 rounded-md text-sm font-medium text-center">
                       {session?.expires_at ? formatDate(new Date(session.expires_at * 1000).toISOString()) : 'Never'}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Token Type</span>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-mono bg-muted/50 p-1.5 rounded flex-1 text-center">Bearer</div>
                      <div className="text-sm font-mono bg-muted/50 p-1.5 rounded flex-1 text-center">JWT</div>
                    </div>
                  </div>
                </div>
             </Card>

             {/* Stats Card */}
             <Card className="p-6 border-muted/40 shadow-md">
               <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-primary" />
                  Security Stats
               </h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-muted/30 p-3 rounded-lg text-center hover:bg-muted/50 transition-colors">
                    <div className="text-2xl font-bold text-foreground">{user?.identities?.length || 1}</div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Identities</div>
                 </div>
                 <div className="bg-muted/30 p-3 rounded-lg text-center hover:bg-muted/50 transition-colors">
                    <div className="text-2xl font-bold text-foreground">{user?.factors?.length || 0}</div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">MFA Factors</div>
                 </div>
               </div>
             </Card>
          </div>

          {/* JSON Data - Full Width */}
          <div className="col-span-12 space-y-6 mt-4">
            <div className="flex items-center gap-2 px-1">
               <h3 className="text-xl font-semibold">Technical Details</h3>
               <Separator className="flex-1" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               <Card className="overflow-hidden border-muted/40 shadow-sm">
                 <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">User Metadata</span>
                   </div>
                   <Badge variant="outline" className="text-[10px] font-mono">user_metadata</Badge>
                 </div>
                 <div className="p-0 bg-slate-950 dark:bg-black">
                    <pre className="p-4 text-xs font-mono text-slate-50 overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
                      {JSON.stringify(user?.user_metadata, null, 2)}
                    </pre>
                 </div>
               </Card>

               <Card className="overflow-hidden border-muted/40 shadow-sm">
                 <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">App Metadata</span>
                   </div>
                   <Badge variant="outline" className="text-[10px] font-mono">app_metadata</Badge>
                 </div>
                 <div className="p-0 bg-slate-950 dark:bg-black">
                    <pre className="p-4 text-xs font-mono text-slate-50 overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
                      {JSON.stringify(user?.app_metadata, null, 2)}
                    </pre>
                 </div>
               </Card>
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="border-t pt-8 mt-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
          <p>Authenticated securely via Supabase Auth</p>
          <div className="flex items-center gap-4 text-xs opacity-70">
            <span>Client ID: {import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'Unknown'}</span>
            <span>•</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}