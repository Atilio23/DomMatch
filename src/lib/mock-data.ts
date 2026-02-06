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
    quartier: 'Plateau',
    typeService: ['Ménage complet', 'Repassage'],
    disponibilite: 'Lundi, Mercredi, Vendredi',
    telephoneWhatsApp: '2250102030405'
  },
  {
    id: '2',
    prenom: 'Fatima',
    photo: findImage('person2'),
    quartier: 'Cocody',
    typeService: ['Ménage', 'Cuisine'],
    disponibilite: 'Mardi, Jeudi',
    telephoneWhatsApp: '2250203040506'
  },
  {
    id: '3',
    prenom: 'Amina',
    photo: findImage('person3'),
    quartier: 'Riviera',
    typeService: ['Garde d\'enfants', 'Ménage'],
    disponibilite: 'Temps plein',
    telephoneWhatsApp: '2250304050607'
  },
  {
    id: '4',
    prenom: 'Jeanne',
    photo: findImage('person4'),
    quartier: 'Marcory',
    typeService: ['Repassage', 'Courses'],
    disponibilite: 'Week-ends',
    telephoneWhatsApp: '2250405060708'
  },
  {
    id: '5',
    prenom: 'Sophie',
    photo: findImage('person5'),
    quartier: 'Treichville',
    typeService: ['Ménage complet', 'Cuisine'],
    disponibilite: 'Lundi au Vendredi (matin)',
    telephoneWhatsApp: '2250506070809'
  },
  {
    id: '6',
    prenom: 'Bintou',
    photo: findImage('person6'),
    quartier: 'Yopougon',
    typeService: ['Ménage'],
    disponibilite: 'Mercredi',
    telephoneWhatsApp: '2250607080910'
  }
];
