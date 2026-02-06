import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { aidesMenageres } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Sparkles, CalendarDays } from 'lucide-react';
import { ContactButton } from '@/components/ContactButton';

type AidePageProps = {
  params: {
    id: string;
  };
};

export default function AidePage({ params }: AidePageProps) {
  const aide = aidesMenageres.find((a) => a.id === params.id);

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
            </div>
            <CardContent className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                {aide.prenom}
              </h1>
              <div className="flex items-center gap-3 text-lg text-muted-foreground mt-2 mb-6">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>{aide.quartier}</span>
              </div>
              
              <Separator className="my-6" />

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded-full">
                     <CalendarDays className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Disponibilité</h3>
                    <div className="mt-2">
                      <Badge variant="default" className="text-sm">{aide.disponibilite}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="bg-primary/20 p-2 rounded-full">
                     <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Services proposés</h3>
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
