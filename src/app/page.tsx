'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { AideMenagereCard } from '@/components/AideMenagereCard';
import { aidesMenageres } from '@/lib/mock-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [filteredAides, setFilteredAides] = useState(aidesMenageres);
  const [selectedQuartier, setSelectedQuartier] = useState('all');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Memoize unique values to prevent recalculation on every render
  const quartiers = useMemo(
    () => ['all', ...Array.from(new Set(aidesMenageres.map((a) => a.quartier)))].sort(),
    []
  );

  const services = useMemo(
    () => Array.from(new Set(aidesMenageres.flatMap((a) => a.typeService))).sort(),
    []
  );

  const handleServiceChange = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const applyFilters = () => {
    let result = aidesMenageres;

    if (selectedQuartier !== 'all') {
      result = result.filter((aide) => aide.quartier === selectedQuartier);
    }

    if (selectedServices.length > 0) {
      result = result.filter((aide) =>
        selectedServices.every((service) => aide.typeService.includes(service))
      );
    }

    setFilteredAides(result);
  };

  const resetFilters = () => {
    setSelectedQuartier('all');
    setSelectedServices([]);
    setFilteredAides(aidesMenageres);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <section aria-labelledby="section-title">
          <h1 id="section-title" className="text-3xl md:text-4xl font-bold font-headline text-center mb-3 text-foreground">
            Trouvez l'aide parfaite pour votre domicile
          </h1>
          <p className="text-base md:text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Parcourez notre sélection d'aides ménagères qualifiées et disponibles près de chez vous.
          </p>

          <Card className="mb-10 md:mb-16 shadow-sm">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quartier-filter">Quartier</Label>
                  <Select value={selectedQuartier} onValueChange={setSelectedQuartier}>
                    <SelectTrigger id="quartier-filter" className="w-full">
                      <SelectValue placeholder="Tous les quartiers" />
                    </SelectTrigger>
                    <SelectContent>
                      {quartiers.map((quartier) => (
                        <SelectItem key={quartier} value={quartier}>
                          {quartier === 'all' ? 'Tous les quartiers' : quartier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Type de service</Label>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                    {services.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service}`}
                          checked={selectedServices.includes(service)}
                          onCheckedChange={() => handleServiceChange(service)}
                        />
                        <Label
                          htmlFor={`service-${service}`}
                          className="font-normal text-sm cursor-pointer"
                        >
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                 <Button variant="ghost" onClick={resetFilters} className="w-full sm:w-auto">Réinitialiser</Button>
                 <Button onClick={applyFilters} className="w-full sm:w-auto">Appliquer les filtres</Button>
              </div>
            </CardContent>
          </Card>

          {filteredAides.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredAides.map((aide) => (
                <AideMenagereCard key={aide.id} aide={aide} />
              ))}
            </div>
          ) : (
             <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <p className="text-lg font-semibold text-foreground">Aucun résultat</p>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                Aucune aide ménagère ne correspond à vos critères. Essayez de modifier ou de réinitialiser vos filtres.
              </p>
               <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Réinitialiser les filtres
                </Button>
            </div>
          )}
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DomiMatch. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
