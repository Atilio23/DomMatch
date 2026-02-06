'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, profile } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (profile?.role === 'aide-menagere') {
        router.replace(`/aide/${user.uid}`);
      } else {
        // Employeurs don't have a public profile page, redirect them to home
        router.replace('/');
      }
    }
  }, [user, loading, profile, router]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
