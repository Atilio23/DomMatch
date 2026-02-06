import type { ImagePlaceholder } from '@/lib/placeholder-images';

export type UserProfile = {
  uid: string;
  prenom: string;
  nom: string;
  telephoneWhatsApp: string;
  
  // housekeeper-specific fields
  photo?: ImagePlaceholder;
  quartier?: string;
  age?: number;
  typeService?: string[];
  disponible?: boolean;
  disponibilite?: string;
  experience?: number;
  description?: string;
  rating?: number;
  reviewCount?: number;
};
