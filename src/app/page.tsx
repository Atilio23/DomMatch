import { Header } from '@/components/Header';
import { AideMenagereCard } from '@/components/AideMenagereCard';
import { aidesMenageres } from '@/lib/mock-data';

export default function Home() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <section aria-labelledby="section-title">
          <h1 id="section-title" className="text-3xl md:text-4xl font-bold font-headline text-center mb-3 text-foreground">
            Trouvez l'aide parfaite pour votre domicile
          </h1>
          <p className="text-base md:text-lg text-muted-foreground text-center mb-10 md:mb-16 max-w-2xl mx-auto">
            Parcourez notre sélection d'aides ménagères qualifiées et disponibles près de chez vous.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {aidesMenageres.map((aide) => (
              <AideMenagereCard key={aide.id} aide={aide} />
            ))}
          </div>
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
