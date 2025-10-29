"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { mockColleges } from '@/data/mock-colleges';
import type { College, Alumni } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Globe, Percent, BookOpen, DollarSign, CalendarDays, Users, Building, FlaskConical, Lightbulb, Award, Linkedin, UserCheck } from 'lucide-react';
import { summarizeCollegeProfile } from '@/ai/flows/summarize-college-profile';
import type { SummarizeCollegeProfileInput, SummarizeCollegeProfileOutput } from '@/ai/flows/summarize-college-profile';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock student data for AI summary context
const mockStudentContext = {
  financialStatus: "Medium",
  studentScores: "CGPA: 3.5/4.0, TOEFL: 100",
  preferredCountry: "USA",
  examScores: "GRE: 320"
};

export default function CollegeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<SummarizeCollegeProfileOutput | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const foundCollege = mockColleges.find(c => c.id === id);
      if (foundCollege) {
        setCollege(foundCollege);
      }
      setLoading(false);
    }
  }, [id]);

  const handleGenerateSummary = async () => {
    if (!college) return;
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const input: SummarizeCollegeProfileInput = {
        collegeName: college.name,
        acceptanceRate: college.acceptanceRate?.toString() + '%' || 'N/A',
        popularPrograms: college.popularPrograms?.join(', ') || 'N/A',
        campusLife: college.campusLife || 'N/A',
        ...mockStudentContext, // Add student context here
      };
      const summaryOutput = await summarizeCollegeProfile(input);
      setAiSummary(summaryOutput);
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setSummaryError("Failed to generate AI summary. Please try again.");
    }
    setSummaryLoading(false);
  };


  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-0">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full mb-6" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-semibold">College Not Found</h1>
        <p className="text-muted-foreground">The college you are looking for does not exist or could not be loaded.</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Button onClick={() => router.back()} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
      </Button>

      <Card className="overflow-hidden shadow-xl">
        {college.imageUrl && (
          <div className="relative w-full h-64 md:h-96 bg-muted">
            <Image
              src={college.imageUrl}
              alt={`Campus of ${college.name}`}
              fill
              objectFit="cover"
              data-ai-hint="college campus scenery"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <h1 className="text-3xl md:text-5xl font-bold text-white shadow-text">{college.name}</h1>
              <p className="text-lg md:text-xl text-gray-200 mt-1 flex items-center shadow-text">
                <MapPin className="mr-2 h-5 w-5" /> {college.location}, {college.country}
              </p>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 m-0 rounded-none border-b bg-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="alumni">Alumni Network</TabsTrigger>
            <TabsTrigger value="ai-summary">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-primary">About {college.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{college.description}</p>
              {college.website && (
                <Button variant="link" asChild className="mt-3 px-0">
                  <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center">
                    <Globe className="mr-2 h-4 w-4" /> Visit Website
                  </a>
                </Button>
              )}
            </section>
            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard Icon={Award} title="Ranking" value={college.ranking || "N/A"} />
              <InfoCard Icon={Building} title="Campus Life" value={college.campusLife || "Information not available"} />
            </div>
          </TabsContent>

          <TabsContent value="academics" className="p-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-primary">Popular Programs</h2>
              {college.popularPrograms && college.popularPrograms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {college.popularPrograms.map(program => (
                    <Badge key={program} variant="secondary" className="text-sm py-1 px-3">{program}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific popular programs listed.</p>
              )}
            </section>
             <InfoCard Icon={FlaskConical} title="Research Focus" value="Varies by department (More details on official website)" />
          </TabsContent>

          <TabsContent value="admissions" className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <InfoCard Icon={Percent} title="Acceptance Rate" value={college.acceptanceRate ? `${college.acceptanceRate}%` : "N/A"} />
                <InfoCard Icon={CalendarDays} title="Admission Deadline" value={college.admissionDeadline || "Varies"} />
            </div>
            <section>
               <h2 className="text-2xl font-semibold mb-3 text-primary">Required Exams</h2>
                {college.requiredExams && college.requiredExams.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                    {college.requiredExams.map(exam => (
                        <Badge key={exam} variant="outline">{exam}</Badge>
                    ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No specific exams listed. Check official website.</p>
                )}
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-primary">Financials</h2>
               <InfoCard Icon={DollarSign} title="Tuition Fees" value={college.tuitionFees ? `${college.tuitionFees.amount.toLocaleString()} ${college.tuitionFees.currency} / ${college.tuitionFees.period}` : "N/A"} />
               <InfoCard Icon={Users} title="Financial Aid" value={college.financialAidAvailable ? "Available" : "Not specified"} />
            </section>
          </TabsContent>

          <TabsContent value="alumni" className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-primary flex items-center"><UserCheck className="mr-2 h-6 w-6"/>Alumni Network</h2>
            <p className="text-muted-foreground">Connect with notable alumni who have walked these halls.</p>
            {college.alumni && college.alumni.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {college.alumni.map((alumnus) => (
                  <Card key={alumnus.name} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-primary">
                        <AvatarImage src={alumnus.avatarUrl} alt={alumnus.name} data-ai-hint="person face" />
                        <AvatarFallback>{alumnus.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{alumnus.name}</p>
                        <p className="text-xs text-muted-foreground">{alumnus.headline}</p>
                        <Button variant="link" size="sm" asChild className="p-0 h-auto mt-1">
                          <a href={alumnus.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <Linkedin className="h-4 w-4 mr-1" /> Connect
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground pt-4">No alumni information available for this college yet.</p>
            )}
          </TabsContent>

          <TabsContent value="ai-summary" className="p-6 space-y-4">
             <h2 className="text-2xl font-semibold text-primary">AI Generated Insights</h2>
             <p className="text-muted-foreground">Get a quick summary and recommendation based on this college and a sample student profile.</p>
            <Button onClick={handleGenerateSummary} disabled={summaryLoading}>
              {summaryLoading ? "Generating..." : "Generate AI Summary"}
            </Button>
            {summaryLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {summaryError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{summaryError}</AlertDescription>
              </Alert>
            )}
            {aiSummary && !summaryLoading && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="text-accent h-6 w-6" />
                    AI College Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed">{aiSummary.summary}</p>
                  <div className={`p-3 rounded-md ${aiSummary.recommendation ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                    <h4 className="font-semibold mb-1">{aiSummary.recommendation ? "Recommended for Sample Student" : "May Not Be a Strong Fit for Sample Student"}</h4>
                    <p className="text-xs text-muted-foreground">
                      {aiSummary.recommendation 
                        ? "This college appears to be a potentially good match based on the sample student's profile." 
                        : "This college might not align well with the sample student's profile. Further review is advised."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

        </Tabs>
      </Card>
    </div>
  );
}

interface InfoCardProps {
  Icon: React.ElementType;
  title: string;
  value: string | number;
}

function InfoCard({ Icon, title, value }: InfoCardProps) {
  return (
    <Card className="bg-background shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-lg font-semibold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}
