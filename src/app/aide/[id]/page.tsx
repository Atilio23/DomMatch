'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Sparkles, CalendarDays, User, Award, Info, Pencil } from 'lucide-react';
import { ContactButton } from '@/components/ContactButton';
import { StarRating } from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { useAidesMenageres } from '@/contexts/AidesMenageresContext';
import { useEffect, useState } from 'react';
import type { AideMenagere } from '@/lib/mock-data';

export default function AidePage() {
  const params = useParams();
  const { getAide } = useAidesMenageres();
  const [aide, setAide] = useState<AideMenagere | undefined>(undefined);

  useEffect(() => {
    if (params.id) {
      const foundAide = getAide(params.id as string);
      setAide(foundAide);
    }
  }, [params.id, getAide]);

  if (aide === undefined) {
    // Loading state
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header backHref="/" />
        <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
           <div className="text-center">Chargement...</div>
        </main>
      </div>
    );
  }

  if (!aide) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header backHref="/" />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden">
            <div className="relative w-full aspect-[4/3] sm:aspect-video">
              <Image
                src={aide.photo.imageUrl}
                alt={`Photo de ${aide.prenom}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                data-ai-hint={aide.photo.imageHint}
                priority
              />
               <div className="absolute top-4 right-4">
                 <Link href={`/aide/${aide.id}/edit`} passHref>
                    <Button variant="secondary" className="bg-card/80 backdrop-blur-sm">
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                  </Link>
               </div>
            </div>
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                      {aide.prenom} {aide.nom}
                    </h1>
                    <div className="flex items-center gap-3 text-lg text-muted-foreground mt-2">
                      <MapPin className="h-5 w-5 shrink-0" />
                      <span>{aide.quartier}</span>
                    </div>
                  </div>
                   <Badge variant={aide.disponible ? "default" : "destructive"} className="text-sm shrink-0">
                      {aide.disponible ? 'Disponible' : 'Indisponible'}
                    </Badge>
              </div>

               <div className="mt-4 mb-6">
                <StarRating rating={aide.rating} reviewCount={aide.reviewCount} />
              </div>
              
              <Separator className="my-6" />

              <div className="space-y-6 text-foreground">
                 <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded-full">
                     <Info className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">À propos</h3>
                    <p className="text-muted-foreground mt-1">{aide.description || 'Aucune description fournie.'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <h4 className="text-sm text-muted-foreground">Âge</h4>
                        <p className="font-semibold">{aide.age} ans</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <h4 className="text-sm text-muted-foreground">Expérience</h4>
                        <p className="font-semibold">{aide.experience ? `${aide.experience} ans` : 'N/A'}</p>
                      </div>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded-full">
                     <CalendarDays className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Disponibilité détaillée</h3>
                    <p className="text-muted-foreground mt-1">{aide.disponibilite}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="bg-primary/20 p-2 rounded-full">
                     <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Services proposés</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {aide.typeService.map((service) => (
                        <Badge key={service} variant="secondary" className="font-normal">{service}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t">
                <ContactButton telephone={aide.telephoneWhatsApp} prenom={aide.prenom} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
