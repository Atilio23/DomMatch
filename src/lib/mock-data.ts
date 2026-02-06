import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string): ImagePlaceholder => {
    const image = PlaceHolderImages.find(img => img.id === id);
    if (!image) {
        return { id: 'fallback', description: 'Fallback image', imageUrl: `https://picsum.photos/seed/${id}/400/400`, imageHint: 'person' };
    }
    return image;
};

export type AideMenagere = {
  id: string;
  prenom: string;
  nom: string;
  photo: ImagePlaceholder;
  age: number;
  quartier: string;
  typeService: string[];
  disponible: boolean;
  disponibilite: string;
  experience?: number;
  description?: string;
  rating: number;
  reviewCount: number;
  telephoneWhatsApp: string;
};

export const aidesMenageres: AideMenagere[] = [
  {
    id: '1',
    prenom: 'Maria',
    nom: 'Traoré',
    photo: findImage('person1'),
    age: 28,
    quartier: 'ACI 2000',
    typeService: ['Ménage complet', 'Repassage'],
    disponible: true,
    disponibilite: 'Lundi, Mercredi, Vendredi',
    experience: 5,
    description: 'Sérieuse et ponctuelle, avec une grande attention aux détails. Je transforme votre maison en un havre de paix.',
    rating: 4.8,
    reviewCount: 24,
    telephoneWhatsApp: '22376123456'
  },
  {
    id: '2',
    prenom: 'Fatima',
    nom: 'Diarra',
    photo: findImage('person2'),
    age: 35,
    quartier: 'Badalabougou',
    typeService: ['Ménage', 'Cuisine'],
    disponible: true,
    disponibilite: 'Mardi, Jeudi',
    experience: 10,
    description: 'Cordon bleu et fée du logis, j\'apporte propreté et saveurs à votre quotidien.',
    rating: 4.9,
    reviewCount: 38,
    telephoneWhatsApp: '22366123456'
  },
  {
    id: '3',
    prenom: 'Amina',
    nom: 'Keita',
    photo: findImage('person3'),
    age: 25,
    quartier: 'Hippodrome',
    typeService: ['Garde d\'enfants', 'Ménage'],
    disponible: false,
    disponibilite: 'Temps plein',
    experience: 3,
    description: 'Douce et patiente avec les enfants, je maintiens également votre intérieur impeccable.',
    rating: 4.6,
    reviewCount: 15,
    telephoneWhatsApp: '22375123456'
  },
  {
    id: '4',
    prenom: 'Jeanne',
    nom: 'Coulibaly',
    photo: findImage('person4'),
    age: 42,
    quartier: 'Sébénikoro',
    typeService: ['Repassage', 'Courses'],
    disponible: true,
    disponibilite: 'Week-ends',
    description: 'Efficace et organisée, je vous libère des corvées de linge et de courses.',
    rating: 4.7,
    reviewCount: 19,
    telephoneWhatsApp: '22378123456'
  },
  {
    id: '5',
    prenom: 'Sophie',
    nom: 'Diallo',
    photo: findImage('person5'),
    age: 31,
    quartier: 'Baco Djicoroni',
    typeService: ['Ménage complet', 'Cuisine'],
    disponible: true,
    disponibilite: 'Lundi au Vendredi (matin)',
    experience: 7,
    description: 'Polyvalente et dynamique, je m\'adapte à vos besoins pour un service sur mesure.',
    rating: 5.0,
    reviewCount: 45,
    telephoneWhatsApp: '22370123456'
  },
  {
    id: '6',
    prenom: 'Bintou',
    nom: 'Cissé',
    photo: findImage('person6'),
    age: 29,
    quartier: 'Magnambougou',
    typeService: ['Ménage'],
    disponible: false,
    disponibilite: 'Mercredi',
    experience: 4,
    description: 'Rapide et méticuleuse, je garantis un nettoyage parfait de votre domicile.',
    rating: 4.5,
    reviewCount: 22,
    telephoneWhatsApp: '22365123456'
  }
];
