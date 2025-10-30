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
import { ArrowRight, University, Brain, Search, BarChart3, FileText, FileSignature } from "lucide-react";
import { mockColleges } from "@/data/mock-colleges"; // Example data
import type { College, StudentProfile } from "@/lib/types";
import Image from "next/image";

// Mock student data
const mockStudentProfile: StudentProfile = {
  id: "student123",
  fullName: "Jane Doe",
  email: "jane.doe@example.com",
  educationLevel: "12th",
  academicScores: { cgpa: 3.8, cgpaScale: 4.0 },
  preferences: {
    preferredCountries: ["USA", "Canada"],
    financialStatus: "Medium",
    preferredMajors: ["Computer Science", "Artificial Intelligence"],
  },
};

export default function DashboardPage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [recommendedColleges, setRecommendedColleges] = useState<College[]>([]);
  const [totalColleges, setTotalColleges] = useState(0);

  useEffect(() => {
    // Simulate fetching student data and recommendations
    setStudent(mockStudentProfile);
    // Filter some colleges as "recommended" for demo purposes
    setRecommendedColleges(mockColleges.slice(0, 2));
    setTotalColleges(mockColleges.length);
  }, []);

  if (!student) {
    return <div className="flex items-center justify-center h-full"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {student.fullName}!
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Matched Colleges
            </CardTitle>
            <University className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendedColleges.length}</div>
            <p className="text-xs text-muted-foreground">
              Based on your current profile
            </p>
            <Button variant="link" className="p-0 h-auto mt-2 text-sm" asChild>
                <Link href="/college-search?filter=matched">View Matched Colleges <ArrowRight className="ml-1 h-3 w-3" /></Link>
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
              Total Colleges in Database
            </CardTitle>
            <Search className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalColleges}</div>
             <p className="text-xs text-muted-foreground">
              Explore our extensive college directory
            </p>
            <Button variant="link" className="p-0 h-auto mt-2 text-sm" asChild>
                <Link href="/college-search">Browse All Colleges <ArrowRight className="ml-1 h-3 w-3" /></Link>
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
          <Link href="/my-profile" className="block">
            <Card className="h-full hover:bg-muted/50 transition-colors shadow-sm">
              <CardHeader>
                <FileText className="h-8 w-8 text-accent mb-2" />
                <CardTitle>My Application Profile</CardTitle>
                <CardDescription>Update your details.</CardDescription>
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
                <CardTitle>SOP & Essay Assistant</CardTitle>
                <CardDescription>Craft your perfect application essay.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {recommendedColleges.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">
            Recently Matched Colleges
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {recommendedColleges.map((college) => (
              <Card key={college.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                {college.imageUrl && (
                  <div className="relative w-full h-48">
                    <Image
                      src={college.imageUrl}
                      alt={college.name}
                      fill
                      objectFit="cover"
                      data-ai-hint="college campus university"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{college.name}</CardTitle>
                  <CardDescription>{college.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {college.description}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href={`/college-search/${college.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
