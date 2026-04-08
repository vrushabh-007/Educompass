"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, University, Brain, Search, FileSignature, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [totalColleges, setTotalColleges] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      // Fetch current logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Try to get display name from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        setDisplayName(profile?.full_name || user.email || "Student");
      }

      // Get real university count from DB
      const { count } = await supabase
        .from("University")
        .select("id", { count: "exact", head: true });
      setTotalColleges(count ?? 0);
    };
    init();
  }, [supabase]);

  const firstName = displayName.split(" ")[0] || displayName;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your college journey.
          </p>
        </div>
        <Button asChild>
          <Link href="/my-profile">
            Update Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Universities in DB
            </CardTitle>
            <University className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalColleges !== null ? totalColleges.toLocaleString() : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              Browse our full database
            </p>
            <Button variant="link" className="p-0 h-auto mt-2 text-sm" asChild>
              <Link href="/college-search">Browse All Colleges <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Recommendations
            </CardTitle>
            <Brain className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Explore AI Picks</div>
            <p className="text-xs text-muted-foreground">
              Discover colleges tailored by our AI
            </p>
            <Button variant="link" className="p-0 h-auto mt-2 text-sm" asChild>
              <Link href="/recommendations">Get AI Insights <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              College Search
            </CardTitle>
            <Search className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Find Your Match</div>
            <p className="text-xs text-muted-foreground">
              Filter by country, major, CGPA & more
            </p>
            <Button variant="link" className="p-0 h-auto mt-2 text-sm" asChild>
              <Link href="/college-search">Search Now <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Consultant
            </CardTitle>
            <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">Chat Now</div>
            <p className="text-xs text-muted-foreground">
              Get instant guidance from our AI
            </p>
            <Button variant="link" className="p-0 h-auto mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" asChild>
              <Link href="/ai-counselor">Start Conversation <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">
          Quick Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/college-search" className="block">
            <Card className="h-full hover:bg-muted/50 transition-colors shadow-sm">
              <CardHeader>
                <Search className="h-8 w-8 text-accent mb-2" />
                <CardTitle>College Search</CardTitle>
                <CardDescription>Find colleges by criteria.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/recommendations" className="block">
            <Card className="h-full hover:bg-muted/50 transition-colors shadow-sm">
              <CardHeader>
                <Brain className="h-8 w-8 text-accent mb-2" />
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Get smart suggestions.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/sop-assistant" className="block">
            <Card className="h-full hover:bg-muted/50 transition-colors shadow-sm">
              <CardHeader>
                <FileSignature className="h-8 w-8 text-accent mb-2" />
                <CardTitle>SOP &amp; Essay Assistant</CardTitle>
                <CardDescription>Craft your perfect application essay.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/ai-counselor" className="block">
            <Card className="h-full hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <CardTitle className="text-blue-900 dark:text-blue-100">Chat to AI Consultant</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">Get instant personalized guidance.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
