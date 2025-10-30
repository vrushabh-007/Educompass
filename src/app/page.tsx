"use client"; 

import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Mail, Phone, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; 
import { AppLogo } from "@/components/shared/app-logo";
import { HeroSearchForm } from "@/components/landing/hero-search-form";
import UniversityLogos from "@/components/landing/university-logos";
import GlobalRankings from "@/components/landing/GlobalRankings";
import Newsletter from "@/components/landing/Newsletter";
import { Input } from "@/components/ui/input";
import React, { useState } from "react"; 
import { useRouter } from "next/navigation";
import AlumniNetwork from "@/components/landing/AlumniNetwork";


export default function LandingPage() {
  const [searchValue, setSearchValue] = useState(""); 
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/college-search?keyword=${encodeURIComponent(searchValue.trim())}`);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-secondary/50 text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex justify-between items-center py-2 border-b border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <a href="tel:+1-545-748-3030" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Phone className="h-3 w-3"/>
                <span>+1-545-748-3030</span>
              </a>
              <a href="mailto:info@educompass.com" className="hidden sm:flex items-center gap-1.5 hover:text-primary transition-colors">
                <Mail className="h-3 w-3"/>
                <span>info@educompass.com</span>
              </a>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
               <Briefcase className="h-3 w-3" />
               <span>Start your journey today</span>
            </div>
          </div>
          {/* Main header */}
          <div className="flex items-center justify-between py-3">
             <AppLogo />
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/college-search" className="hover:text-primary transition-colors">Platform</Link>
              <Link href="/sop-assistant" className="hover:text-primary transition-colors">SOP Assistant</Link>
              <Link href="/alumni-network" className="hover:text-primary transition-colors">Alumni</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col pt-36">
        {/* Hero Section */}
        <section className="relative w-full flex items-center py-16 md:py-24 lg:py-32 bg-background">
          <div className="absolute inset-0 opacity-10 dark:opacity-20">
            <Image 
              src="https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/public/images/college-stanford.jpg"
              alt="University campus background"
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-ai-hint="college campus"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl text-center mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
                  Find Your Future University
                </h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                  Discover your perfect university match from over 10,000+
                  programs worldwide. Let us guide your educational journey.
                </p>
            </div>
             <div className="mt-8 max-w-4xl mx-auto">
                <HeroSearchForm />
            </div>
          </div>
        </section>
        
        <section id="featured-universities" className="w-full py-16 lg:py-24 bg-background">
           <UniversityLogos />
        </section>

        <section className="w-full py-16 lg:py-24 bg-secondary/70">
          <GlobalRankings />
        </section>

        <section className="w-full py-16 lg:py-24 bg-background">
          <AlumniNetwork />
        </section>

        <section className="w-full py-16 lg:py-24 bg-secondary/70">
          <Newsletter />
        </section>
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm z-10 bg-background border-t">
        © {new Date().getFullYear()} EDUCOMPASS. All rights reserved.
      </footer>
    </div>
  );
}
