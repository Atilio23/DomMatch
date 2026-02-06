'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAidesMenageres } from '@/contexts/AidesMenageresContext';
import { Textarea } from '@/components/ui/textarea';

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
  prenom: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' }),
  nom: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  age: z.coerce.number().int().min(18, "L'âge doit être d'au moins 18 ans."),
  quartier: z.string({ required_error: 'Veuillez sélectionner un quartier.' }),
  typeService: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Vous devez sélectionner au moins un service.',
  }),
  disponible: z.boolean().default(true),
  disponibilite: z.string().min(2, { message: 'La disponibilité doit être renseignée.' }),
  experience: z.coerce.number().int().min(0, "L'expérience ne peut être négative.").optional(),
  description: z.string().max(300, "La description ne peut pas dépasser 300 caractères.").optional(),
  telephoneWhatsApp: z
    .string()
    .min(8, { message: 'Le numéro doit contenir au moins 8 chiffres.' })
    .regex(/^\d+$/, { message: 'Le numéro de téléphone ne doit contenir que des chiffres.' }),
});

export default function AddAidePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { addAide } = useAidesMenageres();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prenom: '',
      nom: '',
      age: 18,
      typeService: [],
      disponible: true,
      disponibilite: '',
      telephoneWhatsApp: '',
      experience: 0,
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addAide(values);
    toast({
      title: 'Profil enregistré !',
      description: `Le profil de ${values.prenom} a été ajouté avec succès.`,
    });
    router.push('/');
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header backHref="/" />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold font-headline">Ajouter une aide ménagère</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="prenom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl><Input placeholder="Ex: Maria" {...field} /></FormControl>
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
                          <FormControl><Input placeholder="Ex: Traoré" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                            <FormControl><Input type="number" placeholder="0" {...field} value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>


                  <FormField
                    control={form.control}
                    name="quartier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quartier</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Sélectionner un quartier" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {quartiers.map((quartier) => (
                              <SelectItem key={quartier} value={quartier}>{quartier}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                           <FormDescription>Optionnel. Maximum 300 caractères.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                    control={form.control}
                    name="typeService"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Types de service</FormLabel>
                          <FormDescription>Sélectionnez les services proposés.</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {services.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="typeService"
                              render={({ field }) => {
                                return (
                                  <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.label)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.label])
                                            : field.onChange((field.value || []).filter((value) => value !== item.label));
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
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
                          <FormLabel className="text-base">Disponible immédiatement</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                    name="telephoneWhatsApp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro WhatsApp</FormLabel>
                        <FormControl><Input placeholder="Ex: 76123456" {...field} /></FormControl>
                         <FormDescription>Numéro sans l'indicatif du pays (+223).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full">Enregistrer</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
