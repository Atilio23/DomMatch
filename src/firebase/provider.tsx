'use client';
import {
  createContext,
  ReactNode,
  useContext,
} from 'react';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

import { firebaseConfig } from './config';

type FirebaseContextValue = {
  firebaseApp: FirebaseApp | null,
  firestore: Firestore | null,
  auth: Auth | null,
};

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

export function initializeFirebase() {
  if (!firebaseConfig?.projectId) {
    console.warn("Firebase config not found or invalid. Firebase will not be initialized.");
    return { firebaseApp: null, firestore: null, auth: null };
  }

  const isInitialized = getApps().length > 0;
  const firebaseApp =
    isInitialized ? getApps()[0] : initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  return { firebaseApp, firestore, auth };
}


export function FirebaseProvider({
  children,
  ...props
}: { children: ReactNode } & FirebaseContextValue) {
  return (
    <FirebaseContext.Provider value={props}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
    return useFirebase()?.firebaseApp;
}

export function useFirestore() {
    return useFirebase()?.firestore;
}

export function useAuth() {
    return useFirebase()?.auth;
}
