
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Linkedin, UserCheck } from 'lucide-react';
import Link from 'next/link';
import imageData from '@/lib/placeholder-images.json';

const alumni = [
  {
    name: 'Sarah Chen',
    headline: 'Software Engineer @ Google',
    avatarUrl: imageData['alumni-avatars'].alumni1,
    institution: 'MIT',
  },
  {
    name: 'Michael B. Jordan',
    headline: 'Data Scientist @ Netflix',
    avatarUrl: imageData['alumni-avatars'].alumni2,
    institution: 'Stanford',
  },
  {
    name: 'Priya Patel',
    headline: 'Product Manager @ Microsoft',
    avatarUrl: imageData['alumni-avatars'].alumni3,
    institution: 'U of T',
  },
  {
    name: 'David Kim',
    headline: 'UX Designer @ Apple',
    avatarUrl: imageData['alumni-avatars'].alumni4,
    institution: 'Cambridge',
  },
];

function AlumniNetwork() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <UserCheck className="mx-auto h-12 w-12 text-accent mb-4" />
        <h2 className="text-3xl font-bold text-foreground mb-4">Tap Into a Global Alumni Network</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
          Gain invaluable career insights and mentorship opportunities by connecting with successful graduates from top universities who are now leaders in their fields.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {alumni.map((alum, index) => (
            <Card key={index} className="bg-transparent/20 backdrop-blur-md border-border/30 text-center p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <CardContent className="flex flex-col items-center p-0">
                <Avatar className="h-24 w-24 mb-4 border-4 border-primary/50">
                  <AvatarImage src={alum.avatarUrl} alt={alum.name} data-ai-hint="person face" />
                  <AvatarFallback>{alum.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-foreground">{alum.name}</h3>
                <p className="text-sm text-muted-foreground">{alum.headline}</p>
                <p className="text-xs text-accent mt-1 font-semibold">{alum.institution}</p>
                <Button variant="ghost" size="sm" asChild className="mt-4 text-primary hover:bg-primary/10 hover:text-primary">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    Connect
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/college-search">Explore Alumni Networks</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}

export default AlumniNetwork;
