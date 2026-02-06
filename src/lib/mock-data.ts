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
  photo: ImagePlaceholder;
  quartier: string;
  typeService: string[];
  disponibilite: string;
  telephoneWhatsApp: string;
};

export const aidesMenageres: AideMenagere[] = [
  {
    id: '1',
    prenom: 'Maria',
    photo: findImage('person1'),
    quartier: 'ACI 2000',
    typeService: ['Ménage complet', 'Repassage'],
    disponibilite: 'Lundi, Mercredi, Vendredi',
    telephoneWhatsApp: '22376123456'
  },
  {
    id: '2',
    prenom: 'Fatima',
    photo: findImage('person2'),
    quartier: 'Badalabougou',
    typeService: ['Ménage', 'Cuisine'],
    disponibilite: 'Mardi, Jeudi',
    telephoneWhatsApp: '22366123456'
  },
  {
    id: '3',
    prenom: 'Amina',
    photo: findImage('person3'),
    quartier: 'Hippodrome',
    typeService: ['Garde d\'enfants', 'Ménage'],
    disponibilite: 'Temps plein',
    telephoneWhatsApp: '22375123456'
  },
  {
    id: '4',
    prenom: 'Jeanne',
    photo: findImage('person4'),
    quartier: 'Sébénikoro',
    typeService: ['Repassage', 'Courses'],
    disponibilite: 'Week-ends',
    telephoneWhatsApp: '22378123456'
  },
  {
    id: '5',
    prenom: 'Sophie',
    photo: findImage('person5'),
    quartier: 'Baco Djicoroni',
    typeService: ['Ménage complet', 'Cuisine'],
    disponibilite: 'Lundi au Vendredi (matin)',
    telephoneWhatsApp: '22370123456'
  },
  {
    id: '6',
    prenom: 'Bintou',
    photo: findImage('person6'),
    quartier: 'Magnambougou',
    typeService: ['Ménage'],
    disponibilite: 'Mercredi',
    telephoneWhatsApp: '22365123456'
  }
];
