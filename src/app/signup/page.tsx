'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { UserProfile, UserRole } from '@/types';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, useFirestore } from '@/firebase';

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
  role: z.enum(['employeur', 'aide-menagere'], { required_error: 'Veuillez choisir un rôle.' }),
  prenom: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' }),
  nom: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }),
  telephoneWhatsApp: z.string().min(8, { message: 'Le numéro doit contenir au moins 8 chiffres.' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
  confirmPassword: z.string(),
  // Aide-menagere specific fields
  photo: z.string().optional(),
  quartier: z.string().optional(),
  typeService: z.array(z.string()).optional(),
  disponible: z.boolean().optional(),
  disponibilite: z.string().optional(),
  experience: z.coerce.number().optional(),
  description: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
}).refine((data) => {
    if (data.role === 'aide-menagere') {
        return !!data.photo;
    }
    return true;
}, {
    message: "Une photo de profil est requise.",
    path: ["photo"],
});


export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'employeur',
      prenom: '',
      nom: '',
      email: '',
      telephoneWhatsApp: '',
      password: '',
      confirmPassword: '',
      typeService: [],
      disponible: true,
    },
  });

  const role = form.watch('role');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Erreur de configuration",
        description: "La connexion à Firebase a échoué. L'application n'est pas correctement configurée.",
      });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      const selectedPhoto = PlaceHolderImages.find(p => p.id === values.photo);

      const userProfile: UserProfile = {
        uid: user.uid,
        email: values.email,
        role: values.role,
        prenom: values.prenom,
        nom: values.nom,
        telephoneWhatsApp: values.telephoneWhatsApp,
        ...(values.role === 'aide-menagere' && {
          photo: selectedPhoto || PlaceHolderImages[0],
          quartier: values.quartier || '',
          typeService: values.typeService || [],
          disponible: values.disponible,
          disponibilite: values.disponibilite || '',
          experience: values.experience || 0,
          description: values.description || '',
          rating: Math.round((Math.random() * (5 - 3.5) + 3.5) * 10) / 10,
          reviewCount: 0,
        }),
      };

      await setDoc(doc(db, "users", user.uid), userProfile);

      toast({
        title: 'Inscription réussie !',
        description: 'Votre compte a été créé. Vous pouvez maintenant vous connecter.',
      });
      router.push('/login');
    } catch (error: any) {
      console.error(error);
      let description = 'Une erreur est survenue. Veuillez réessayer.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'Cette adresse e-mail est déjà utilisée.';
      }
      toast({
        variant: 'destructive',
        title: 'Erreur d\'inscription',
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold font-headline">Créer un compte</CardTitle>
            <CardDescription>Rejoignez DomiMatch pour trouver ou proposer vos services.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Vous êtes...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row gap-4"
                          disabled={!auth}
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 flex-1 border p-4 rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value="employeur" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Un ménage / employeur
                              <p className="text-xs text-muted-foreground">Je cherche une aide ménagère.</p>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 flex-1 border p-4 rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value="aide-menagere" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Une aide ménagère
                               <p className="text-xs text-muted-foreground">Je propose mes services.</p>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="prenom" render={({ field }) => ( <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input placeholder="Ex: Maria" {...field} disabled={!auth} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="nom" render={({ field }) => ( <FormItem><FormLabel>Nom</FormLabel><FormControl><Input placeholder="Ex: Traoré" {...field} disabled={!auth} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Adresse e-mail</FormLabel><FormControl><Input type="email" placeholder="votre@email.com" {...field} disabled={!auth} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="telephoneWhatsApp" render={({ field }) => ( <FormItem><FormLabel>Numéro WhatsApp</FormLabel><FormControl><Input placeholder="76123456" {...field} disabled={!auth} /></FormControl><FormMessage /></FormItem> )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Mot de passe</FormLabel><FormControl><Input type="password" {...field} disabled={!auth} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="confirmPassword" render={({ field }) => ( <FormItem><FormLabel>Confirmer le mot de passe</FormLabel><FormControl><Input type="password" {...field} disabled={!auth} /></FormControl><FormMessage /></FormItem> )} />
                </div>

                {role === 'aide-menagere' && (
                  <div className='space-y-8 pt-6 border-t'>
                    <h3 className="text-lg font-semibold text-foreground">Complétez votre profil d'aide ménagère</h3>
                    
                     <FormField
                        control={form.control}
                        name="photo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Choisissez votre photo de profil</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-3 sm:grid-cols-4 gap-4"
                                disabled={!auth}
                                >
                                {PlaceHolderImages.slice(0, 8).map((image) => (
                                    <FormItem key={image.id} className="relative aspect-square">
                                    <FormControl>
                                        <RadioGroupItem value={image.id} className="peer sr-only" />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer rounded-full border-2 border-transparent peer-aria-checked:border-primary w-full h-full block">
                                        <Image src={image.imageUrl} alt={image.description} fill className="object-cover rounded-full" />
                                    </FormLabel>
                                    </FormItem>
                                ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField control={form.control} name="experience" render={({ field }) => ( <FormItem><FormLabel>Années d'expérience</FormLabel><FormControl><Input type="number" placeholder="0" {...field} disabled={!auth} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="quartier" render={({ field }) => ( <FormItem><FormLabel>Quartier</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={!auth}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner un quartier" /></SelectTrigger></FormControl><SelectContent>{quartiers.map((quartier) => (<SelectItem key={quartier} value={quartier}>{quartier}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    </div>

                    <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Courte description</FormLabel><FormControl><Textarea placeholder="Décrivez vos compétences..." {...field} disabled={!auth} /></FormControl><FormMessage /></FormItem> )} />
                    
                    <FormField control={form.control} name="typeService" render={() => (
                      <FormItem>
                        <FormLabel>Services proposés</FormLabel>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          {services.map((item) => (
                            <FormField key={item.id} control={form.control} name="typeService"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl><Checkbox checked={field.value?.includes(item.label)} onCheckedChange={(checked) => { return checked ? field.onChange([...(field.value || []), item.label]) : field.onChange((field.value || []).filter((value) => value !== item.label)); }} disabled={!auth} /></FormControl>
                                  <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="disponibilite" render={({ field }) => ( <FormItem><FormLabel>Détails de disponibilité</FormLabel><FormControl><Input placeholder="Ex: Lundi, Mercredi (matin)" {...field} disabled={!auth} /></FormControl><FormMessage /></FormItem> )} />
                    
                     <FormField control={form.control} name="disponible" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">Disponible immédiatement</FormLabel>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={!auth} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                )}
                
                <Button type="submit" size="lg" className="w-full" disabled={loading || !auth}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Créer mon compte
                </Button>
              </form>
            </Form>
          </CardContent>
           <CardFooter className="flex justify-center">
             <p className="text-sm text-muted-foreground">
                Déjà un compte ?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Connectez-vous
                </Link>
              </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
