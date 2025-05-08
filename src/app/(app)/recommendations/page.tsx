"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CollegeCard } from '@/components/college-card';
import { COUNTRIES, FINANCIAL_STATUS_OPTIONS, MAJORS_SAMPLE, EXAM_OPTIONS } from "@/lib/constants";
import type { AIRecommendationInput, AIRecommendedCollege, College } from "@/lib/types"; // Assuming College type is also needed for mapping
import { generateCollegeRecommendation } from '@/ai/flows/generate-college-recommendation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Search, Wand2 } from 'lucide-react';
import { mockColleges } from '@/data/mock-colleges'; // To map AI results to full college data

const recommendationFormSchema = z.object({
  academicScores: z.object({
    cgpa: z.number().min(0).max(10).optional(),
    percentage: z.number().min(0).max(100).optional(),
  }),
  examResults: z.object({
    examType: z.string().optional(), // To select which exam score to provide
    gre: z.number().min(260).max(340).optional(),
    gmat: z.number().min(200).max(800).optional(),
    toefl: z.number().min(0).max(120).optional(),
  }),
  preferences: z.object({
    country: z.string({ required_error: "Preferred country is required." }),
    financialStatus: z.string({ required_error: "Financial status is required." }),
    major: z.string({ required_error: "Preferred major is required." }),
  }),
  additionalInfo: z.string().optional(),
});

type RecommendationFormValues = z.infer<typeof recommendationFormSchema>;

// Mock student data to prefill the form
const mockStudentPrefill: Partial<RecommendationFormValues> = {
  academicScores: { cgpa: 3.5, percentage: 80 },
  examResults: { examType: "gre", gre: 310 }, // Default to GRE, GMAT/TOEFL can be undefined
  preferences: { country: "USA", financialStatus: "Medium", major: "Computer Science" },
  additionalInfo: "Interested in research opportunities and a diverse campus environment."
};


export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: mockStudentPrefill,
  });

  const selectedExamType = form.watch("examResults.examType");

  async function onSubmit(data: RecommendationFormValues) {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    const aiInput: AIRecommendationInput = {
        academicScores: {
            cgpa: data.academicScores.cgpa,
            percentage: data.academicScores.percentage,
        },
        examResults: { // Only send the selected exam score
            gre: data.examResults.examType === 'gre' ? data.examResults.gre : undefined,
            gmat: data.examResults.examType === 'gmat' ? data.examResults.gmat : undefined,
            toefl: data.examResults.examType === 'toefl' ? data.examResults.toefl : undefined,
        },
        preferences: {
            country: data.preferences.country,
            financialStatus: data.preferences.financialStatus,
            major: data.preferences.major,
        },
        additionalInfo: data.additionalInfo,
    };

    try {
      const aiResults = await generateCollegeRecommendation(aiInput);
      
      const mappedResults: College[] = aiResults.map(aiCollege => {
        const existingCollege = mockColleges.find(mc => mc.name.toLowerCase() === aiCollege.collegeName.toLowerCase());
        if (existingCollege) {
          return { 
            ...existingCollege, 
            _aiIsGoodFit: aiCollege.isGoodFit, 
            _aiDescription: aiCollege.description,
          };
        }
        return {
          id: aiCollege.collegeName.replace(/\s+/g, '-').toLowerCase(), 
          name: aiCollege.collegeName,
          location: aiCollege.location,
          country: data.preferences.country as College['country'], 
          description: aiCollege.description,
          popularPrograms: [aiCollege.majorOffered],
          acceptanceRate: aiCollege.acceptanceRate,
          _aiIsGoodFit: aiCollege.isGoodFit, 
        } as College;
      });

      setRecommendations(mappedResults);
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError("Failed to generate recommendations. Please try again.");
    }
    setIsLoading(false);
  }

  const handleNumericInputChange = (fieldOnChange: (value: number | undefined) => void, isFloat = false) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const strVal = e.target.value;
    if (strVal === "") {
      fieldOnChange(undefined);
    } else {
      const numVal = isFloat ? parseFloat(strVal) : parseInt(strVal, 10);
      fieldOnChange(isNaN(numVal) ? undefined : numVal);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-10">
        <Brain className="mx-auto h-16 w-16 text-primary mb-3" />
        <h1 className="text-4xl font-bold tracking-tight">AI College Recommendations</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Let our AI assist you in finding colleges that match your profile and aspirations.
        </p>
      </div>

      <Card className="mb-10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile for Recommendation</CardTitle>
          <CardDescription>Fill in your details, and our AI will suggest suitable colleges.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Academic Scores */}
                <section className="space-y-4 p-4 border rounded-md bg-card">
                  <h3 className="text-lg font-semibold text-primary">Academic Scores</h3>
                   <FormField control={form.control} name="academicScores.cgpa" render={({ field }) => (
                    <FormItem><FormLabel>CGPA (e.g., 3.5 or 8.5)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="Your CGPA" {...field} onChange={handleNumericInputChange(field.onChange, true)} />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="academicScores.percentage" render={({ field }) => (
                    <FormItem><FormLabel>Percentage (e.g., 85%)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="Your Percentage" {...field} onChange={handleNumericInputChange(field.onChange, true)} />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                </section>

                {/* Exam Results */}
                <section className="space-y-4 p-4 border rounded-md bg-card">
                  <h3 className="text-lg font-semibold text-primary">Exam Results</h3>
                  <FormField
                    control={form.control}
                    name="examResults.examType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Exam Type</FormLabel>
                        <Select onValueChange={(value) => {
                            field.onChange(value);
                            // Optionally reset other exam fields when type changes
                            if (value !== 'gre') form.setValue('examResults.gre', undefined);
                            if (value !== 'gmat') form.setValue('examResults.gmat', undefined);
                            if (value !== 'toefl') form.setValue('examResults.toefl', undefined);
                        }} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select exam type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="gre">GRE</SelectItem>
                            <SelectItem value="gmat">GMAT</SelectItem>
                            <SelectItem value="toefl">TOEFL</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {selectedExamType === 'gre' && (
                    <FormField control={form.control} name="examResults.gre" render={({ field }) => (
                      <FormItem><FormLabel>GRE Score (Total)</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="e.g., 320" value={field.value ?? ""} {...field} onChange={handleNumericInputChange(field.onChange)} />
                      </FormControl><FormMessage /></FormItem>
                    )} />
                  )}
                  {selectedExamType === 'gmat' && (
                    <FormField control={form.control} name="examResults.gmat" render={({ field }) => (
                      <FormItem><FormLabel>GMAT Score (Total)</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="e.g., 700" value={field.value ?? ""} {...field} onChange={handleNumericInputChange(field.onChange)} />
                      </FormControl><FormMessage /></FormItem>
                    )} />
                  )}
                  {selectedExamType === 'toefl' && (
                    <FormField control={form.control} name="examResults.toefl" render={({ field }) => (
                      <FormItem><FormLabel>TOEFL Score (Total)</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="e.g., 100" value={field.value ?? ""} {...field} onChange={handleNumericInputChange(field.onChange)} />
                      </FormControl><FormMessage /></FormItem>
                    )} />
                  )}
                </section>
              </div>
              
              {/* Preferences */}
              <section className="space-y-4 p-4 border rounded-md bg-card">
                <h3 className="text-lg font-semibold text-primary">Preferences</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <FormField control={form.control} name="preferences.country" render={({ field }) => (
                    <FormItem><FormLabel>Preferred Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                        <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="preferences.financialStatus" render={({ field }) => (
                    <FormItem><FormLabel>Financial Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                        <SelectContent>{FINANCIAL_STATUS_OPTIONS.map(fs => <SelectItem key={fs.value} value={fs.value}>{fs.label}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="preferences.major" render={({ field }) => (
                    <FormItem><FormLabel>Preferred Major</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select major" /></SelectTrigger></FormControl>
                        <SelectContent>{MAJORS_SAMPLE.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                </div>
              </section>

              <FormField control={form.control} name="additionalInfo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Any other details for the AI: e.g., specific interests, career goals, campus preferences..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full md:w-auto" size="lg" disabled={isLoading}>
                <Wand2 className="mr-2 h-5 w-5" />
                {isLoading ? "Generating..." : "Get AI Recommendations"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="shadow-lg rounded-lg">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2 mt-1" /></CardHeader>
              <CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-1/3" /></CardFooter>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-center">AI Suggested Colleges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((college, index) => (
              <CollegeCard 
                key={college.id || index} 
                college={college} 
                isRecommendedByAI={true}
                // @ts-ignore _aiIsGoodFit is a temporary property added during mapping
                aiGoodFit={college._aiIsGoodFit} 
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !error && recommendations.length === 0 && form.formState.isSubmitted && (
         <div className="text-center py-12 mt-8 bg-card rounded-lg shadow">
            <Search className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold">No Recommendations Yet</h3>
            <p className="text-muted-foreground">
            The AI couldn&apos;t find specific matches with the current criteria, or no results were returned.
            Try adjusting your profile information or preferences.
            </p>
        </div>
      )}
    </div>
  );
}
