'use client';

import { ReactNode, useMemo } from 'react';
import { FirebaseProvider, initializeFirebase } from './provider';

// This provider is responsible for initializing Firebase on the client side.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseApp = useMemo(() => initializeFirebase(), []);

  return <FirebaseProvider {...firebaseApp}>{children}</FirebaseProvider>;
}
