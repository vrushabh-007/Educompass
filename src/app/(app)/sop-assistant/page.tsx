"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSop } from '@/ai/flows/generate-sop';
import type { GenerateSopInput } from '@/ai/flows/generate-sop';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSignature, Sparkles } from 'lucide-react';

const sopFormSchema = z.object({
  targetUniversity: z.string().min(3, "Target university is required."),
  targetProgram: z.string().min(3, "Target program is required."),
  academicBackground: z.string().min(10, "Academic background is required."),
  keyProjects: z.string().min(10, "Please describe key projects or experiences."),
  careerGoals: z.string().min(10, "Career goals are required."),
  additionalInfo: z.string().optional(),
});

type SopFormValues = z.infer<typeof sopFormSchema>;

export default function SopAssistantPage() {
  const [generatedSop, setGeneratedSop] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SopFormValues>({
    resolver: zodResolver(sopFormSchema),
    defaultValues: {
      targetUniversity: "",
      targetProgram: "",
      academicBackground: "",
      keyProjects: "",
      careerGoals: "",
      additionalInfo: "",
    },
  });

  async function onSubmit(data: SopFormValues) {
    setIsLoading(true);
    setError(null);
    setGeneratedSop("");

    try {
      const result = await generateSop(data as GenerateSopInput);
      setGeneratedSop(result);
    } catch (err) {
      console.error("Error generating SOP:", err);
      setError("Failed to generate SOP. Please try again.");
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-10">
        <FileSignature className="mx-auto h-16 w-16 text-primary mb-3" />
        <h1 className="text-4xl font-bold tracking-tight">SOP & Essay Assistant</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Craft a compelling Statement of Purpose with the help of AI.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Provide the details below to generate your SOP draft.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="targetUniversity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target University</FormLabel>
                    <FormControl><Input placeholder="e.g., Stanford University" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="targetProgram" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Program</FormLabel>
                    <FormControl><Input placeholder="e.g., Master's in Computer Science" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="academicBackground" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Background</FormLabel>
                    <FormControl><Textarea placeholder="Describe your relevant coursework, GPA, and academic achievements." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="keyProjects" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Projects & Experiences</FormLabel>
                    <FormControl><Textarea placeholder="Detail 1-2 significant projects, internships, or work experiences. What did you do? What was the impact?" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="careerGoals" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Goals</FormLabel>
                    <FormControl><Textarea placeholder="What are your short-term and long-term career aspirations after this program?" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="additionalInfo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anything Else? (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="Mention specific professors, labs, or unique reasons for choosing this university." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isLoading ? "Generating..." : "Generate SOP Draft"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>AI-Generated Draft</CardTitle>
            <CardDescription>Your Statement of Purpose will appear here. Review and edit as needed.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!isLoading && generatedSop && (
               <Textarea
                readOnly
                value={generatedSop}
                className="w-full h-[500px] bg-muted/50 text-sm"
                placeholder="Your generated SOP..."
              />
            )}
             {!isLoading && !generatedSop && !error && (
                 <div className="text-center py-20 text-muted-foreground">
                    <p>Your generated Statement of Purpose will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
