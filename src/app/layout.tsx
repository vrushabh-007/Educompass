import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { GenkitClientProvider } from '@/components/genkit-client-provider';


export const metadata: Metadata = {
  title: 'CollegePath - Find Your Future',
  description: 'Helping students find suitable colleges based on their profiles and preferences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans`}>
        <GenkitClientProvider>
          {children}
          <Toaster />
        </GenkitClientProvider>
      </body>
    </html>
  );
}
