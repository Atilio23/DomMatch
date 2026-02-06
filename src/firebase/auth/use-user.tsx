'use client';

import { useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth, useFirestore } from '../provider';
import { doc } from 'firebase/firestore';
import { useDoc } from '../firestore/use-doc';
import type { UserProfile } from '@/types';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const profileDocRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, loading: profileLoading, error } = useDoc<UserProfile>(profileDocRef);

  return { 
    user, 
    profile, 
    loading: loading || (user && profileLoading), // a user is logged in but profile is still loading
    error 
  };
}
