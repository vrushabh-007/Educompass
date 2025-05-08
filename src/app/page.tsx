import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Search, BrainCircuit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AppLogo } from "@/components/shared/app-logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <AppLogo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 text-foreground"
            href="/login"
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/register">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Find Your Perfect College Journey
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CollegePath uses AI to match your unique profile with the best colleges worldwide. Start exploring your future today.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Sign Up Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/dashboard">
                      Explore Colleges
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-xl"
                height="550"
                src="https://picsum.photos/seed/college-hero/550/550"
                data-ai-hint="students graduation campus"
                width="550"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-primary">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                  Why Choose CollegePath?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a comprehensive suite of tools to guide you through the college selection process with ease and confidence.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
              <div className="grid gap-2 p-6 rounded-lg border bg-card shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-card-foreground">Personalized Matching</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get college recommendations tailored to your academic scores, exam results, preferred country, and financial status.
                </p>
              </div>
              <div className="grid gap-2 p-6 rounded-lg border bg-card shadow-sm hover:shadow-lg transition-shadow">
                 <div className="flex items-center gap-2">
                  <Search className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-card-foreground">Dynamic Dashboard</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Easily filter and search through a vast database of colleges. Compare institutions and find your best fit.
                </p>
              </div>
              <div className="grid gap-2 p-6 rounded-lg border bg-card shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-card-foreground">AI-Powered Insights</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Leverage advanced AI to understand your chances and discover colleges you might not have considered.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} CollegePath. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
