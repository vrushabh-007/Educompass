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
import { provideEssayFeedback } from '@/ai/flows/provide-essay-feedback';
import type { GenerateSopInput, EssayFeedback } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSignature, Sparkles, Wand2, BookOpen, List, MessageSquare, Badge } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const sopFormSchema = z.object({
  targetUniversity: z.string().min(3, "Target university is required."),
  targetProgram: z.string().min(3, "Target program is required."),
  academicBackground: z.string().min(10, "Academic background is required."),
  keyProjects: z.string().min(10, "Please describe key projects or experiences."),
  careerGoals: z.string().min(10, "Career goals are required."),
  additionalInfo: z.string().optional(),
  essayText: z.string().optional(), // For the feedback text area
});

type SopFormValues = z.infer<typeof sopFormSchema>;

export default function SopAssistantPage() {
  const [generatedSop, setGeneratedSop] = useState<string>("");
  const [feedback, setFeedback] = useState<EssayFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const form = useForm<SopFormValues>({
    resolver: zodResolver(sopFormSchema),
    defaultValues: {
      targetUniversity: "",
      targetProgram: "",
      academicBackground: "",
      keyProjects: "",
      careerGoals: "",
      additionalInfo: "",
      essayText: ""
    },
  });

  async function onGenerateSubmit(data: SopFormValues) {
    setIsLoading(true);
    setError(null);
    setGeneratedSop("");
    setFeedback(null);

    try {
      const result = await generateSop(data as GenerateSopInput);
      setGeneratedSop(result);
      form.setValue("essayText", result); // Populate the feedback text area
    } catch (err) {
      console.error("Error generating SOP:", err);
      setError("Failed to generate SOP. Please try again.");
    }
    setIsLoading(false);
  }

  async function onFeedbackSubmit() {
    const essayText = form.getValues("essayText");
    if (!essayText || essayText.trim().length < 50) {
      setFeedbackError("Please enter an essay of at least 50 characters to get feedback.");
      return;
    }
    
    setIsFeedbackLoading(true);
    setFeedbackError(null);
    setFeedback(null);
    
    try {
      const result = await provideEssayFeedback(essayText);
      setFeedback(result);
    } catch (err) {
      console.error("Error getting feedback:", err);
      setFeedbackError("Failed to get feedback for the essay. Please try again.");
    }
    setIsFeedbackLoading(false);
  }


  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-10">
        <FileSignature className="mx-auto h-16 w-16 text-primary mb-3" />
        <h1 className="text-4xl font-bold tracking-tight">SOP & Essay Assistant</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Craft a compelling Statement of Purpose with AI generation and get instant, constructive feedback on your drafts.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left Column: Input and Generation */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>1. Generate Your SOP Draft</CardTitle>
            <CardDescription>Provide the details below and let our AI create a first draft for you. You can also skip this and paste your own essay in the next step.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onGenerateSubmit)} className="space-y-6">
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
                  {isLoading ? "Generating Draft..." : "Generate SOP Draft"}
                </Button>
                 {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Generation Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right Column: Feedback */}
        <div className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>2. Get AI Feedback</CardTitle>
              <CardDescription>Paste your generated draft or your own essay here to get instant feedback on its structure, clarity, and content.</CardDescription>
            </CardHeader>
            <CardContent>
               <FormField control={form.control} name="essayText" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                        <Textarea
                            {...field}
                            className="w-full h-80 bg-muted/50 text-sm"
                            placeholder="Your generated SOP will appear here, or you can paste your own essay."
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 {feedbackError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Feedback Error</AlertTitle>
                        <AlertDescription>{feedbackError}</AlertDescription>
                    </Alert>
                )}
                 <Button onClick={onFeedbackSubmit} size="lg" disabled={isFeedbackLoading} className="w-full mt-4">
                    <Wand2 className="mr-2 h-5 w-5" />
                    {isFeedbackLoading ? "Analyzing..." : "Get Feedback"}
                </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>3. AI Feedback Analysis</CardTitle>
              <CardDescription>Review the AI's analysis of your essay.</CardDescription>
            </CardHeader>
            <CardContent>
               {isFeedbackLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-6 w-1/4 mt-4" />
                    <Skeleton className="h-4 w-full" />
                </div>
                )}
                
                {!isFeedbackLoading && !feedback && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>Your feedback will appear here after analysis.</p>
                    </div>
                )}
                
                {feedback && (
                    <div className="space-y-6">
                        {/* Summary Section */}
                        <div>
                            <h4 className="font-semibold text-lg flex items-center mb-2"><BookOpen className="mr-2 h-5 w-5 text-primary" />Summary</h4>
                            <p className="text-sm text-muted-foreground">{feedback.summary}</p>
                        </div>
                        <Separator />
                        {/* Key Topics Section */}
                        <div>
                            <h4 className="font-semibold text-lg flex items-center mb-2"><List className="mr-2 h-5 w-5 text-primary" />Key Topics</h4>
                             <div className="flex flex-wrap gap-2">
                                {feedback.keyWords.map((word, index) => (
                                    <Badge key={index} variant="secondary">{word}</Badge>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        {/* Feedback Section */}
                        <div>
                            <h4 className="font-semibold text-lg flex items-center mb-2"><MessageSquare className="mr-2 h-5 w-5 text-primary" />Feedback & Suggestions</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{feedback.feedback}</p>
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
