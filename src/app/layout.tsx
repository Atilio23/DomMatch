import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { PT_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { AidesMenageresProvider } from '@/context/AidesMenageresContext';

const ptSans = PT_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-pt-sans' 
});

export const metadata: Metadata = {
  title: 'DomiMatch',
  description: 'Trouvez l\'aide parfaite pour votre domicile',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn("font-body antialiased", ptSans.variable)}>
        <AidesMenageresProvider>
          {children}
        </AidesMenageresProvider>
        <Toaster />
      </body>
    </html>
  );
}
