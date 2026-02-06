"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles, CalendarDays } from 'lucide-react';
import type { AideMenagere } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast"

type AideMenagereCardProps = {
  aide: AideMenagere;
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 448 512"
        {...props}
    >
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.6-9.5-97.8-26.8l-6.9-4.1-72.3 19L44.4 358.5l-4.5-7.3c-18.9-30.8-29.2-66.3-29.2-102.3 0-108.6 88.4-197 197-197s197 88.4 197 197-88.4 197-197 197zm125.7-101.5c-4.3-2.1-25.4-12.5-29.4-13.9-4-1.4-6.9-2.1-9.8 2.1-2.8 4.3-11.1 13.9-13.6 16.7-2.5 2.8-5 3.1-9.3 1-4.3-2.1-18.2-6.7-34.6-21.4-12.8-11.5-21.4-25.7-23.9-30-2.5-4.3-.2-6.6 1.9-8.7 1.9-1.9 4.3-5 6.4-7.5 2.1-2.5 2.8-4.3 4.3-7.2 1.4-2.8 0-5.3-1-7.5-1.4-2.1-9.8-23.5-13.4-32.2-3.6-8.7-7.3-7.5-10.1-7.5-2.5 0-5.3 0-8.1 0-2.8 0-7.2 1-11.1 5.3-3.9 4.3-15.1 14.8-15.1 36.1 0 21.3 15.4 41.8 17.5 44.6 2.1 2.8 30.2 46.1 73.2 64.5 10.3 4.5 18.4 7.2 24.5 9.3 10.3 3.6 19.7 3.1 27.1 1.9 8.1-1.2 25.4-10.3 28.9-20.2 3.6-9.8 3.6-18.2 2.5-20.2-1-2.2-3.9-3.6-8.1-5.7z" />
    </svg>
);


export function AideMenagereCard({ aide }: AideMenagereCardProps) {
  const { toast } = useToast();

  const handleContact = () => {
    window.open(`https://wa.me/${aide.telephoneWhatsApp}`, '_blank');
    toast({
      title: "Redirection vers WhatsApp",
      description: `Vous êtes redirigé pour contacter ${aide.prenom}.`,
    })
  };

  return (
    <Card className="overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
      <div className="relative w-full aspect-square">
        <Image
          src={aide.photo.imageUrl}
          alt={`Photo de ${aide.prenom}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          data-ai-hint={aide.photo.imageHint}
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <h2 className="text-xl font-bold font-headline mb-3 text-foreground">{aide.prenom}</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{aide.quartier}</span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>{aide.disponibilite}</span>
          </div>
          <div className="flex items-start gap-3 pt-1">
            <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1.5">
              {aide.typeService.map((service) => (
                <Badge key={service} variant="secondary" className="font-normal">{service}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleContact} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent-foreground">
          <WhatsAppIcon className="mr-2 h-4 w-4" />
          Contacter sur WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}
