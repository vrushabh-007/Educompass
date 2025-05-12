import type {Metadata} from 'next';
// Removed direct import of GeistSans as we'll set it up via @font-face in globals.css
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { GenkitClientProvider } from '@/components/genkit-client-provider';


export const metadata: Metadata = {
  title: 'EDUCOMPASS - Find Your Future',
  description: 'Helping students find suitable colleges based on their profiles and preferences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply 'font-sans' which will pick up the GeistSans definition from globals.css */}
      <body className={`antialiased font-sans`}> 
        <GenkitClientProvider>
          {children}
          <Toaster />
        </GenkitClientProvider>
      </body>
    </html>
  );
}
