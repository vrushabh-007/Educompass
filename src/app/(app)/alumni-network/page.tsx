"use client";

import React, { useState, useEffect } from 'react';
import { mockColleges } from '@/data/mock-colleges';
import type { Alumni } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Linkedin, UserCheck, Search, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AlumniNetworkPage() {
  const [allAlumni, setAllAlumni] = useState<Alumni[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // In a real app, this would be an API call. Here we aggregate from mock data.
    const alumniList = mockColleges.flatMap(college => college.alumni || []).filter(
        // Simple deduplication based on name
        (alum, index, self) => index === self.findIndex((a) => a.name === alum.name)
    );
    setAllAlumni(alumniList);
    setFilteredAlumni(alumniList);
  }, []);

  useEffect(() => {
    const results = allAlumni.filter(alum => 
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.institution?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlumni(results);
  }, [searchTerm, allAlumni]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <UserCheck className="mx-auto h-16 w-16 text-primary mb-3" />
        <h1 className="text-4xl font-bold tracking-tight">Alumni Network Directory</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Connect with a global network of professionals for mentorship and career opportunities.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search alumni by name, company, or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAlumni.length > 0 ? (
          filteredAlumni.map((alumnus) => (
            <Card key={alumnus.name} className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-4 border-primary/50">
                  <AvatarImage src={alumnus.avatarUrl} alt={alumnus.name} data-ai-hint="person face" />
                  <AvatarFallback>{alumnus.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-foreground">{alumnus.name}</h3>
                <p className="text-sm text-muted-foreground">{alumnus.headline}</p>
                {alumnus.institution && (
                  <p className="text-xs text-accent mt-1 font-semibold flex items-center gap-1.5">
                    <Building className="h-3 w-3"/> {alumnus.institution}
                  </p>
                )}
                <Button variant="ghost" size="sm" asChild className="mt-4 text-primary hover:bg-primary/10 hover:text-primary">
                  <a href={alumnus.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    Connect
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>No alumni found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
