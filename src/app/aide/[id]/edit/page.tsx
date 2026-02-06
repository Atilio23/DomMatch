'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { aidesMenageres } from '@/lib/mock-data';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Upload } from 'lucide-react';
import { StarRating } from '@/components/StarRating';

const services = [
  { id: 'menage', label: 'Ménage' },
  { id: 'menage-complet', label: 'Ménage complet' },
  { id: 'repassage', label: 'Repassage' },
  { id: 'cuisine', label: 'Cuisine' },
  { id: 'garde-enfants', label: 'Garde d\'enfants' },
  { id: 'courses', label: 'Courses' },
];

const quartiers = [
  'ACI 2000',
  'Badalabougou',
  'Hippodrome',
  'Sébénikoro',
  'Baco Djicoroni',
  'Magnambougou',
  'Niamakoro',
  'Faladjè',
  'Sotuba',
  'Koulouba',
];

const formSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  age: z.coerce.number().int().min(18, "L'âge doit être d'au moins 18 ans."),
  quartier: z.string({ required_error: 'Veuillez sélectionner un quartier.' }),
  typeService: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Vous devez sélectionner au moins un service.',
  }),
  disponible: z.boolean().default(false),
  disponibilite: z.string().min(2, "La disponibilité doit être renseignée."),
  experience: z.coerce.number().int().min(0, "L'expérience ne peut être négative.").optional(),
  description: z.string().max(300, "La description ne peut pas dépasser 300 caractères.").optional(),
  telephoneWhatsApp: z
    .string()
    .min(8, "Le numéro doit contenir au moins 8 chiffres.")
    .regex(/^\d+$/, 'Le numéro de téléphone ne doit contenir que des chiffres.'),
});

export default function EditAidePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const aideId = params.id as string;

  const aide = aidesMenageres.find((a) => a.id === aideId);

  if (!aide) {
    notFound();
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prenom: aide.prenom,
      nom: aide.nom,
      age: aide.age,
      quartier: aide.quartier,
      typeService: aide.typeService,
      disponible: aide.disponible,
      disponibilite: aide.disponibilite,
      experience: aide.experience,
      description: aide.description,
      telephoneWhatsApp: aide.telephoneWhatsApp,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Profil mis à jour !',
      description: `Le profil de ${values.prenom} a été modifié avec succès.`,
    });
    router.push(`/aide/${aideId}`);
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header backHref={`/aide/${aideId}`} />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informations principales</CardTitle>
                  <CardDescription>Gérez les informations de base du profil.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                     <div className="relative group w-32 h-32 sm:w-40 sm:h-40 shrink-0">
                      <Image
                        src={aide.photo.imageUrl}
                        alt={`Photo de ${aide.prenom}`}
                        width={160}
                        height={160}
                        className="rounded-full object-cover aspect-square border-4 border-card"
                      />
                       <Button type="button" size="sm" className="absolute bottom-1 right-1 rounded-full opacity-80 group-hover:opacity-100">
                          <Upload className="h-4 w-4" />
                       </Button>
                    </div>
                    <div className="space-y-4 flex-grow">
                       <FormField
                          control={form.control}
                          name="prenom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="nom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="quartier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quartier</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {quartiers.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="telephoneWhatsApp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro WhatsApp</FormLabel>
                        <FormControl><Input placeholder="Ex: 76123456" {...field} /></FormControl>
                        <FormDescription>Sans l'indicatif du pays (+223).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations complémentaires</CardTitle>
                  <CardDescription>Ajoutez plus de détails pour un profil complet.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Âge</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Années d'expérience</FormLabel>
                            <FormControl><Input type="number" placeholder="Optionnel" {...field} value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>

                   <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Courte description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez vos compétences et votre personnalité en quelques mots."
                              className="resize-none"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                           <FormDescription>Maximum 300 caractères.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                    control={form.control}
                    name="disponible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Statut de disponibilité</FormLabel>
                          <FormDescription>
                            Indique si l'aide est actuellement disponible pour de nouvelles missions.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="disponibilite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Détails de disponibilité</FormLabel>
                        <FormControl><Input placeholder="Ex: Lundi, Mercredi (matin)" {...field} /></FormControl>
                        <FormDescription>Soyez aussi précis que possible (jours, heures).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="typeService"
                    render={() => (
                      <FormItem>
                        <FormLabel>Services proposés</FormLabel>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          {services.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="typeService"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.label)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.label])
                                          : field.onChange((field.value || []).filter((v) => v !== item.label));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   <div>
                    <FormLabel>Évaluation (lecture seule)</FormLabel>
                    <div className="mt-2">
                      <StarRating rating={aide.rating} reviewCount={aide.reviewCount} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
                <Button type="submit">Mettre à jour le profil</Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
