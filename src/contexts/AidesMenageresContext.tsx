'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { aidesMenageres as initialAides, AideMenagere } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// We omit fields that will be generated automatically on creation
type AideMenagereCreate = Omit<AideMenagere, 'id' | 'photo' | 'rating' | 'reviewCount'>;
type AideMenagereUpdate = Partial<Omit<AideMenagere, 'id'>>;

interface AidesMenageresContextType {
  aides: AideMenagere[];
  getAide: (id: string) => AideMenagere | undefined;
  addAide: (aide: AideMenagereCreate) => void;
  updateAide: (id: string, updates: AideMenagereUpdate) => void;
}

const AidesMenageresContext = createContext<AidesMenageresContextType | undefined>(undefined);

export const AidesMenageresProvider = ({ children }: { children: ReactNode }) => {
  const [aides, setAides] = useState<AideMenagere[]>(initialAides);

  const getAide = (id: string) => {
    return aides.find((a) => a.id === id);
  };

  const addAide = (aideData: AideMenagereCreate) => {
    const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
    
    const newAide: AideMenagere = {
      ...aideData,
      id: new Date().getTime().toString(),
      photo: randomImage || { id: 'fallback', description: 'Fallback image', imageUrl: `https://picsum.photos/seed/${new Date().getTime()}/400/400`, imageHint: 'person' },
      rating: Math.round((Math.random() * (5 - 3.5) + 3.5) * 10) / 10, // Random rating between 3.5 and 5
      reviewCount: 0,
      experience: aideData.experience || 0,
      description: aideData.description || 'Aucune description fournie.',
    };
    setAides((prevAides) => [newAide, ...prevAides]);
  };

  const updateAide = (id: string, updates: AideMenagereUpdate) => {
    setAides((prevAides) =>
      prevAides.map((aide) =>
        aide.id === id ? { ...aide, ...updates } : aide
      )
    );
  };

  return (
    <AidesMenageresContext.Provider value={{ aides, getAide, addAide, updateAide }}>
      {children}
    </AidesMenageresContext.Provider>
  );
};

export const useAidesMenageres = () => {
  const context = useContext(AidesMenageresContext);
  if (context === undefined) {
    throw new Error('useAidesMenageres must be used within a AidesMenageresProvider');
  }
  return context;
};
