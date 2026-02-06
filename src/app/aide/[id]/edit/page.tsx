'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { StarRating } from '@/components/StarRating';
import { useDoc, useFirestore } from '@/firebase';
import type { UserProfile } from '@/types';
import { doc, updateDoc } from 'firebase/firestore';

const services = [
  { id: 'menage', label: 'Ménage' },
  { id: 'menage-complet', label: 'Ménage complet' },
  { id: 'repassage', label: 'Repassage' },
  { id: 'cuisine', label: 'Cuisine' },
  { id: 'garde-enfants', label: 'Garde d\'enfants' },
  { id: 'courses', label: 'Courses' },
];

const quartiers = [
  'ACI 2000', 'Badalabougou', 'Hippodrome', 'Sébénikoro', 'Baco Djicoroni',
  'Magnambougou', 'Niamakoro', 'Faladjè', 'Sotuba', 'Koulouba',
];

const formSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  quartier: z.string({ required_error: 'Veuillez sélectionner un quartier.' }),
  typeService: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Vous devez sélectionner au moins un service.',
  }),
  disponible: z.boolean().default(false),
  disponibilite: z.string().min(2, "La disponibilité doit être renseignée."),
  age: z.coerce.number().int().min(18, "L'âge doit être d'au moins 18 ans."),
  experience: z.coerce.number().int().min(0, "L'expérience ne peut être négative.").optional(),
  description: z.string().max(300, "La description ne peut pas dépasser 300 caractères.").optional(),
  telephoneWhatsApp: z.string().min(8, "Le numéro doit contenir au moins 8 chiffres."),
});

export default function EditProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const profileId = params.id as string;
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userDocRef = useMemo(() => {
    if (!firestore || !profileId) return null;
    return doc(firestore, 'users', profileId);
  }, [firestore, profileId]);

  const { data: profile, loading: profileLoading } = useDoc<UserProfile>(userDocRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        prenom: profile.prenom,
        nom: profile.nom,
        quartier: profile.quartier,
        typeService: profile.typeService,
        disponible: profile.disponible,
        disponibilite: profile.disponibilite,
        age: profile.age,
        experience: profile.experience,
        description: profile.description,
        telephoneWhatsApp: profile.telephoneWhatsApp,
      });
    }
  }, [profile, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userDocRef) return;
    setIsSubmitting(true);
    try {
      await updateDoc(userDocRef, values);
      toast({
        title: 'Profil mis à jour !',
        description: `Le profil a été modifié avec succès.`,
      });
      router.push(`/aide/${profileId}`);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (profileLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header backHref={`/aide/${profileId}`} />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informations principales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="flex items-center gap-6">
                     <div className="relative group w-32 h-32 shrink-0">
                      <Image
                        src={profile.photo?.imageUrl || ''}
                        alt={`Photo de ${profile.prenom}`}
                        width={128}
                        height={128}
                        className="rounded-full object-cover aspect-square border-4 border-card"
                      />
                    </div>
                     <p className="text-sm text-muted-foreground">La modification de la photo de profil n'est pas disponible. Pour en changer, veuillez créer un nouveau profil.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="prenom" render={({ field }) => ( <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="nom" render={({ field }) => ( <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <FormField control={form.control} name="quartier" render={({ field }) => ( <FormItem><FormLabel>Quartier</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{quartiers.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="telephoneWhatsApp" render={({ field }) => ( <FormItem><FormLabel>Numéro WhatsApp</FormLabel><FormControl><Input placeholder="Ex: 76123456" {...field} /></FormControl><FormDescription>Sans l'indicatif du pays (+223).</FormDescription><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations complémentaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-6">
                     <FormField control={form.control} name="age" render={({ field }) => ( <FormItem><FormLabel>Âge</FormLabel><FormControl><Input type="number" placeholder="Ex: 25" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="experience" render={({ field }) => ( <FormItem><FormLabel>Années d'expérience</FormLabel><FormControl><Input type="number" placeholder="Optionnel" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                   <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Courte description</FormLabel><FormControl><Textarea placeholder="Décrivez vos compétences..." className="resize-none" {...field} value={field.value || ''}/></FormControl><FormDescription>Maximum 300 caractères.</FormDescription><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="disponible" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel className="text-base">Statut de disponibilité</FormLabel><FormDescription>Indique si vous êtes disponible pour de nouvelles missions.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                  <FormField control={form.control} name="disponibilite" render={({ field }) => ( <FormItem><FormLabel>Détails de disponibilité</FormLabel><FormControl><Input placeholder="Ex: Lundi, Mercredi (matin)" {...field} /></FormControl><FormDescription>Soyez aussi précis que possible.</FormDescription><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="typeService" render={() => ( <FormItem><FormLabel>Services proposés</FormLabel><div className="grid grid-cols-2 gap-4 pt-2">{services.map((item) => ( <FormField key={item.id} control={form.control} name="typeService" render={({ field }) => ( <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item.label)} onCheckedChange={(checked) => { return checked ? field.onChange([...(field.value || []), item.label]) : field.onChange((field.value || []).filter((v) => v !== item.label)); }} /></FormControl><FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel></FormItem>)} />))}</div><FormMessage /></FormItem>)} />
                   <div><FormLabel>Évaluation (lecture seule)</FormLabel><div className="mt-2"><StarRating rating={profile.rating || 0} reviewCount={profile.reviewCount || 0} /></div></div>
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
                <Button type="submit" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Mettre à jour le profil
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
