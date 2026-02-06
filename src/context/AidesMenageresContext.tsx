'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { UserProfile } from '@/types';
import { mockAides } from '@/lib/mock-data';

// Function to generate a simple unique ID
const generateUID = () => `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

interface AidesMenageresContextType {
  aides: UserProfile[];
  loading: boolean;
  getAideById: (id: string) => UserProfile | undefined;
  addAide: (aide: Omit<UserProfile, 'uid' | 'rating' | 'reviewCount'>) => UserProfile;
  updateAide: (id: string, updatedAide: Partial<UserProfile>) => void;
}

const AidesMenageresContext = createContext<AidesMenageresContextType | undefined>(undefined);

export const AidesMenageresProvider = ({ children }: { children: ReactNode }) => {
  const [aides, setAides] = useState<UserProfile[]>(mockAides);
  const [loading, setLoading] = useState(false); // Kept for API compatibility, can be removed if not needed

  const getAideById = (id: string): UserProfile | undefined => {
    return aides.find((aide) => aide.uid === id);
  };

  const addAide = (aideData: Omit<UserProfile, 'uid' | 'rating' | 'reviewCount'>): UserProfile => {
    const newAide: UserProfile = {
      ...aideData,
      uid: generateUID(),
      rating: 0,
      reviewCount: 0,
    };
    setAides((prevAides) => [newAide, ...prevAides]);
    return newAide;
  };

  const updateAide = (id: string, updatedData: Partial<UserProfile>) => {
    setAides((prevAides) =>
      prevAides.map((aide) =>
        aide.uid === id ? { ...aide, ...updatedData } : aide
      )
    );
  };

  return (
    <AidesMenageresContext.Provider value={{ aides, loading, getAideById, addAide, updateAide }}>
      {children}
    </AidesMenageresContext.Provider>
  );
};

export const useAidesMenageres = () => {
  const context = useContext(AidesMenageresContext);
  if (context === undefined) {
    throw new Error('useAidesMenageres must be used within an AidesMenageresProvider');
  }
  return context;
};
