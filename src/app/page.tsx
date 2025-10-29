

"use client"; 

import { Button } from "@/components/ui/button";
import { ArrowRight, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import next/image
import { AppLogo } from "@/components/shared/app-logo";
import { HeroSearchForm } from "@/components/landing/hero-search-form";
import UniversityLogos from "@/components/landing/university-logos";
import GlobalRankings from "@/components/landing/GlobalRankings";
import Newsletter from "@/components/landing/Newsletter";
import { Input } from "@/components/ui/input";
import InteractiveGlobeBackground from "@/components/landing/interactive-globe-background";
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
    <div className="flex flex-col min-h-screen text-foreground relative">
      <InteractiveGlobeBackground />
      <header className="py-3 fixed top-3 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="bg-transparent/30 backdrop-blur-md rounded-full shadow-xl p-2 sm:p-3 flex items-center justify-between border border-border/30">
            <div className="flex items-center">
              <AppLogo />
            </div>

            <form onSubmit={handleSearchSubmit} className="relative mx-2 sm:mx-4 flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search colleges, courses..."
                className="w-full pl-9 pr-3 py-2 h-9 sm:h-10 rounded-full bg-input/50 backdrop-blur-sm border-border/50 focus:border-primary text-sm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" asChild className="rounded-full text-xs sm:text-sm text-foreground/80 hover:text-foreground hover:bg-transparent/20 px-2 sm:px-3">
                <Link href="/login">
                  Login
                </Link>
              </Button>
              <Button asChild variant="default" size="sm" className="rounded-full text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4">
                <Link href="/register" className="flex items-center">
                  Get Started
                  <ArrowRight className="ml-1 sm:ml-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col z-10">
        <section className="w-full flex-grow flex items-center pt-28 sm:pt-32 px-4 sm:px-6 lg:px-8"> 
          <div className="container mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">
              
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
                <div className="space-y-3">
                  <h1 className="text-foreground"> {/* Removed text sizing classes */}
                    <Image
                      src="https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos//image-removebg-preview.png"
                      alt="EDUCOMPASS"
                      width={452} 
                      height={56} 
                      className="block mx-auto lg:mx-0" // Use block for layout and centering/alignment
                      priority
                      data-ai-hint="text logo"
                    />
                  </h1>
                  <p className="text-2xl md:text-3xl text-foreground/90">
                    Simple. Smart. <span className="text-accent">Seamless.</span>
                  </p>
                  <p className="max-w-[600px] text-foreground/70 md:text-xl mx-auto lg:mx-0">
                    Discover your perfect university match from over 10,000+
                    programs worldwide. Let us guide your educational journey.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row lg:justify-start justify-center">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground py-7 px-8 text-lg shadow-lg hover:shadow-primary/50 transition-shadow">
                    <Link href="/college-search">
                      Explore Universities
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-foreground/30 hover:bg-foreground/10 text-foreground py-7 px-8 text-lg shadow-md hover:shadow-lg transition-shadow backdrop-blur-sm bg-transparent/10">
                    <Link href="#how-it-works"> 
                      How It Works
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                <HeroSearchForm />
              </div>

            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="w-full bg-transparent">
           <UniversityLogos />
        </section>

        <section className="w-full bg-transparent">
          <GlobalRankings />
        </section>

        <section className="w-full bg-transparent">
          <AlumniNetwork />
        </section>

        <section className="w-full bg-transparent">
          <Newsletter />
        </section>
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm z-10 bg-transparent/10 backdrop-blur-sm">
        © {new Date().getFullYear()} EDUCOMPASS. All rights reserved.
      </footer>
    </div>
  );
}
