
import { Button } from "@/components/ui/button";
import { ArrowRight, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { AppLogo } from "@/components/shared/app-logo";
import { HeroSearchForm } from "@/components/landing/hero-search-form";
import UniversityLogos from "@/components/landing/university-logos";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-[hsl(var(--primary)/0.2)] text-foreground">
      {/* New Floating Header */}
      <header className="py-3 fixed top-3 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-muted/80 backdrop-blur-lg rounded-full shadow-xl p-2 sm:p-3 flex items-center justify-between">
            <div className="flex items-center">
              <AppLogo />
            </div>

            {/* Search Bar - Centered */}
            <div className="relative mx-2 sm:mx-4 flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search colleges, courses..."
                className="w-full pl-9 pr-3 py-2 h-9 sm:h-10 rounded-full bg-background/70 border-border focus:border-primary text-sm"
                // TODO: Add onChange, value, and submission logic for search functionality
              />
            </div>

            {/* Auth Links */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" asChild className="rounded-full text-xs sm:text-sm text-foreground/80 hover:text-foreground hover:bg-transparent px-2 sm:px-3">
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
      
      <main className="flex-1 flex flex-col">
        {/* Adjusted padding-top to avoid overlap with new fixed header */}
        {/* Header height approx 2.5rem(input) + 1.5rem(padding) + 0.75rem(top offset) = ~4.75rem. pt-24 (6rem) gives some buffer. */}
        <section className="w-full flex-grow flex items-center pt-24 sm:pt-28"> 
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">
              
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
                <div className="space-y-3">
                  <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-primary-foreground">
                    EDUCOMPASS
                  </h1>
                  <p className="text-2xl md:text-3xl text-primary-foreground/90">
                    Simple. Smart. <span className="text-accent">Seamless.</span>
                  </p>
                  <p className="max-w-[600px] text-primary-foreground/70 md:text-xl mx-auto lg:mx-0">
                    Discover your perfect university match from over 10,000+
                    programs worldwide. Let us guide your educational journey.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row lg:justify-start justify-center">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground py-7 px-8 text-lg">
                    <Link href="/college-search">
                      Explore Universities
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground py-7 px-8 text-lg">
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
        
        <section className="w-full">
           <UniversityLogos />
        </section>
      </main>
    </div>
  );
}
