"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import type { UserProfile } from '@/types';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './StarRating';

type AideMenagereCardProps = {
  aide: UserProfile;
};

export function AideMenagereCard({ aide }: AideMenagereCardProps) {
  return (
    <Link href={`/aide/${aide.uid}`} className="block group">
      <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 bg-card">
        <div className="relative w-full aspect-square">
          {aide.photo?.imageUrl ? (
            <Image
              src={aide.photo.imageUrl}
              alt={`Photo de ${aide.prenom}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint={aide.photo.imageHint}
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
              Pas de photo
            </div>
          )}
           <Badge variant={aide.disponible ? 'default' : 'destructive'} className="absolute top-2 right-2 m-0">
             {aide.disponible ? 'Disponible' : 'Indisponible'}
           </Badge>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h2 className="text-xl font-bold font-headline mb-2 text-foreground truncate">{aide.prenom} {aide.nom}</h2>
          
          <div className="mb-3">
             <StarRating rating={aide.rating || 0} reviewCount={aide.reviewCount || 0} size={14} />
          </div>

          <div className="space-y-2 text-sm text-muted-foreground flex-grow">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{aide.quartier || 'Non spécifié'}</span>
            </div>
             <div className="flex flex-wrap gap-1.5 pt-2">
                {aide.typeService && aide.typeService.slice(0, 2).map((service) => (
                  <Badge key={service} variant="secondary" className="font-normal">{service}</Badge>
                ))}
                {aide.typeService && aide.typeService.length > 2 && <Badge variant="secondary" className="font-normal">...</Badge>}
              </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
