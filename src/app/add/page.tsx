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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAidesMenageres } from '@/context/AidesMenageresContext';

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
  prenom: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' }),
  nom: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  telephoneWhatsApp: z.string().min(8, { message: 'Le numéro doit contenir au moins 8 chiffres.' }),
  photo: z.string({ required_error: "Une photo de profil est requise."}),
  quartier: z.string({ required_error: "Le quartier est requis." }),
  age: z.coerce.number({ required_error: "L'âge est requis." }).min(18, "L'âge minimum est 18 ans."),
  typeService: z.array(z.string()).optional(),
  disponible: z.boolean().optional(),
  disponibilite: z.string().optional(),
  experience: z.coerce.number().optional(),
  description: z.string().optional(),
});


export default function AddPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addAide } = useAidesMenageres();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prenom: '',
      nom: '',
      telephoneWhatsApp: '',
      typeService: [],
      disponible: true,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
            variant: 'destructive',
            title: 'Fichier trop lourd',
            description: 'La taille de l\'image ne doit pas dépasser 2 Mo.',
        });
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoPreview(dataUrl);
        fieldOnChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      const imageUrl = values.photo;
      let photoObject = PlaceHolderImages.find(p => p.imageUrl === imageUrl);

      if (!photoObject) {
          photoObject = {
              id: `uploaded-${Date.now()}`,
              imageUrl: imageUrl,
              description: 'Photo de profil',
              imageHint: 'person portrait',
          };
      }

      const newProfileData = {
        prenom: values.prenom,
        nom: values.nom,
        telephoneWhatsApp: values.telephoneWhatsApp,
        photo: photoObject,
        quartier: values.quartier || '',
        age: values.age,
        typeService: values.typeService || [],
        disponible: values.disponible,
        disponibilite: values.disponibilite || '',
        experience: values.experience || 0,
        description: values.description || '',
      };

      const newProfile = addAide(newProfileData);

      toast({
        title: 'Profil créé !',
        description: 'Le nouveau profil a été ajouté avec succès.',
      });
      router.push(`/aide/${newProfile.uid}`);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de créer le profil. Veuillez réessayer.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header backHref="/" />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold font-headline">Ajouter une aide ménagère</CardTitle>
            <CardDescription>Remplissez le formulaire pour créer un nouveau profil.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className='space-y-8'>
                     <FormField
                      control={form.control}
                      name="photo"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Photo de profil</FormLabel>
                              <div className="flex items-start gap-6">
                                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
                                      <Image
                                          src={photoPreview || "https://placehold.co/128x128/E2E8F0/A0AEC0?text=Photo"}
                                          alt="Aperçu du profil"
                                          fill
                                          className="object-cover rounded-full border"
                                      />
                                  </div>
                                  <div className="flex-grow space-y-2">
                                      <FormControl>
                                          <Input
                                              type="file"
                                              className="hidden"
                                              ref={fileInputRef}
                                              onChange={(e) => handleFileChange(e, field.onChange)}
                                              accept="image/png, image/jpeg"
                                          />
                                      </FormControl>
                                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                          <Upload className="mr-2 h-4 w-4" />
                                          Télécharger une photo
                                      </Button>
                                      <FormDescription>
                                          Ou choisissez-en une dans la galerie ci-dessous.
                                      </FormDescription>
                                  </div>
                              </div>
                              <RadioGroup
                                  onValueChange={(value) => {
                                      field.onChange(value);
                                      setPhotoPreview(value);
                                  }}
                                  value={field.value}
                                  className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-4"
                              >
                                  {PlaceHolderImages.slice(0, 8).map((image) => (
                                      <FormItem key={image.id} className="relative aspect-square">
                                          <FormControl>
                                              <RadioGroupItem value={image.imageUrl} className="peer sr-only" />
                                          </FormControl>
                                          <FormLabel className="cursor-pointer rounded-full border-2 border-transparent peer-aria-checked:border-primary w-full h-full block">
                                              <Image src={image.imageUrl} alt={image.description} fill className="object-cover rounded-full" />
                                          </FormLabel>
                                      </FormItem>
                                  ))}
                              </RadioGroup>
                              <FormMessage />
                          </FormItem>
                      )}
                    />


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="prenom" render={({ field }) => ( <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input placeholder="Ex: Maria" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="nom" render={({ field }) => ( <FormItem><FormLabel>Nom</FormLabel><FormControl><Input placeholder="Ex: Traoré" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    <FormField control={form.control} name="telephoneWhatsApp" render={({ field }) => ( <FormItem><FormLabel>Numéro WhatsApp</FormLabel><FormControl><Input placeholder="76123456" {...field} /></FormControl><FormMessage /></FormItem> )} />

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField control={form.control} name="age" render={({ field }) => ( <FormItem><FormLabel>Âge</FormLabel><FormControl><Input type="number" placeholder="Ex: 25" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="quartier" render={({ field }) => ( <FormItem><FormLabel>Quartier</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner un quartier" /></SelectTrigger></FormControl><SelectContent>{quartiers.map((quartier) => (<SelectItem key={quartier} value={quartier}>{quartier}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    </div>

                    <FormField control={form.control} name="experience" render={({ field }) => ( <FormItem><FormLabel>Années d'expérience (optionnel)</FormLabel><FormControl><Input type="number" placeholder="0" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />

                    <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Courte description (optionnel)</FormLabel><FormControl><Textarea placeholder="Décrivez vos compétences..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                    
                    <FormField control={form.control} name="typeService" render={() => (
                      <FormItem>
                        <FormLabel>Services proposés</FormLabel>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          {services.map((item) => (
                            <FormField key={item.id} control={form.control} name="typeService"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl><Checkbox checked={field.value?.includes(item.label)} onCheckedChange={(checked) => { return checked ? field.onChange([...(field.value || []), item.label]) : field.onChange((field.value || []).filter((value) => value !== item.label)); }} /></FormControl>
                                  <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="disponibilite" render={({ field }) => ( <FormItem><FormLabel>Détails de disponibilité</FormLabel><FormControl><Input placeholder="Ex: Lundi, Mercredi (matin)" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                    
                     <FormField control={form.control} name="disponible" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">Disponible immédiatement</FormLabel>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ajouter le profil
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
