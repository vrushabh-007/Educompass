
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AppLogo } from "@/components/shared/app-logo";
import { HeroSearchForm } from "@/components/landing/hero-search-form";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-[hsl(var(--primary)/0.2)] text-foreground">
      <header className="h-20 flex items-center fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto flex items-center"> {/* Container for horizontal padding and alignment */}
          <AppLogo />
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              className="text-sm font-medium hover:underline underline-offset-4 text-primary-foreground/80 hover:text-primary-foreground"
              href="/login"
            >
              Login
            </Link>
            <Button asChild variant="secondary" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground">
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      
      {/* Added pt-20 back to main to account for the fixed header height */}
      <main className="flex-1 flex items-center pt-20">
        {/* Removed py-12 md:py-24 lg:py-32 from section to remove its internal top/bottom padding */}
        <section className="w-full">
          {/* Container for horizontal padding of the section content */}
          <div className="container mx-auto"> 
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">
              
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
                <div className="space-y-3">
                  <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-primary-foreground">
                    CollegePath
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
                    <Link href="#how-it-works"> {/* Placeholder link */}
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
      </main>
    </div>
  );
}
