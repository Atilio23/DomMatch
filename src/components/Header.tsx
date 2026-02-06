'use client';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { useUser } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


const Logo = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

type HeaderProps = {
  backHref?: string;
};


export function Header({ backHref }: HeaderProps) {
  const { user, profile, loading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    await auth.signOut();
    router.push('/');
  };
  
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {backHref ? (
          <Link href={backHref} className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Retour</span>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg shadow">
              <Logo />
            </div>
            <span className="text-2xl font-bold font-headline text-foreground tracking-tight">
              DomiMatch
            </span>
          </Link>
        )}
        
        <div className='flex items-center gap-2'>
          {loading ? (
            <div className='h-8 w-20 bg-muted rounded-md animate-pulse' />
          ) : user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={profile?.photo?.imageUrl} alt={`${profile?.prenom} ${profile?.nom}`} />
                    <AvatarFallback>{getInitials(profile?.prenom, profile?.nom)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <p>{profile?.prenom} {profile?.nom}</p>
                  <p className="text-xs text-muted-foreground font-normal">{profile?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profile?.role === 'aide-menagere' && (
                  <DropdownMenuItem onClick={() => router.push(`/aide/${user.uid}`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon Profil</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                   <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
               <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Connexion
                </Link>
              </Button>
              <Button asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Inscription
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
