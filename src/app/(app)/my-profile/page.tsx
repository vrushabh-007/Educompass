"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COUNTRIES, FINANCIAL_STATUS_OPTIONS, EDUCATION_LEVELS, MAJORS_SAMPLE } from "@/lib/constants";
import type { StudentProfile, StudentAcademicScores, StudentExamResults, StudentPreferences } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, Save, UserCircle2 } from 'lucide-react';

// Mock student data - replace with actual data fetching and state management
const mockStudentProfileData: StudentProfile = {
  id: "student123",
  fullName: "Jane Doe",
  email: "jane.doe@example.com",
  educationLevel: "12th",
  academicScores: { cgpa: 3.8, cgpaScale: 4.0, percentage: 85 },
  examResults: {
    toefl: 105,
    gre: { total: 320 }
  },
  preferences: {
    preferredCountries: ["USA", "Canada"],
    financialStatus: "Medium",
    preferredMajors: ["Computer Science"],
    collegeType: ["Research"]
  },
  workExperienceYears: 1,
  extracurriculars: "Debate club, Hackathon winner",
  statementOfPurpose: "Dedicated to advancing AI...",
};


const academicScoresSchema = z.object({
  cgpa: z.number().min(0).max(10).optional(),
  cgpaScale: z.number().optional(), // Assuming scale is like 4 or 10, not for direct input necessarily
  percentage: z.number().min(0).max(100).optional(),
});

const examResultsSchema = z.object({
  gre: z.object({ 
    verbal: z.number().optional(), 
    quant: z.number().optional(), 
    awa: z.number().optional(), 
    total: z.number().optional() 
  }).optional(),
  gmat: z.object({ 
    verbal: z.number().optional(), 
    quant: z.number().optional(), 
    awa: z.number().optional(), 
    ir: z.number().optional(), 
    total: z.number().optional() 
  }).optional(),
  toefl: z.number().optional(),
  ielts: z.number().optional(),
  sat: z.number().optional(),
  act: z.number().optional(),
});

const preferencesSchema = z.object({
  preferredCountries: z.array(z.string()).min(1, "Select at least one country"),
  financialStatus: z.string({ required_error: "Financial status is required." }),
  preferredMajors: z.array(z.string()).min(1, "Select at least one major"),
  collegeType: z.array(z.string()).optional(),
});

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email(),
  educationLevel: z.string({ required_error: "Education level is required." }) as z.ZodType<StudentProfile['educationLevel']>,
  academicScores: academicScoresSchema,
  examResults: examResultsSchema.optional(),
  preferences: preferencesSchema,
  workExperienceYears: z.number().min(0).optional(),
  extracurriculars: z.string().optional(),
  statementOfPurpose: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function MyProfilePage() {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      academicScores: {},
      examResults: {},
      preferences: { preferredCountries: [], preferredMajors: [] },
    }
  });
  
  const { fields: majorFields, append: appendMajor, remove: removeMajor } = useFieldArray({
    control: form.control,
    name: "preferences.preferredMajors"
  });

  const { fields: countryFields, append: appendCountry, remove: removeCountry } = useFieldArray({
    control: form.control,
    name: "preferences.preferredCountries"
  });


  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudentProfile(mockStudentProfileData);
      form.reset(mockStudentProfileData); // Populate form with fetched data
      setIsLoading(false);
    }, 500);
  }, [form]);
  

  function onSubmit(data: ProfileFormValues) {
    console.log("Profile updated:", data);
    // TODO: Implement actual API call to save data
    setStudentProfile(prev => ({...prev, ...data} as StudentProfile));
    toast({
      title: "Profile Updated",
      description: "Your information has been successfully saved.",
      variant: "default",
      className: "bg-accent text-accent-foreground"
    });
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


  if (isLoading) {
    return <div className="container mx-auto p-4"><p>Loading profile...</p></div>;
  }

  if (!studentProfile) {
     return <div className="container mx-auto p-4"><p>Could not load profile data.</p></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <UserCircle2 className="mx-auto h-16 w-16 text-primary mb-2" />
          <CardTitle className="text-3xl font-bold">My Profile</CardTitle>
          <CardDescription>Keep your information up-to-date for the best college matches.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Information */}
              <section>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-primary">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input type="email" {...field} readOnly /></FormControl> {/* Email usually not editable */}
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </section>

              {/* Academic Profile */}
              <section>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-primary">Academic Profile</h3>
                <FormField control={form.control} name="educationLevel" render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Current Education Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                      <SelectContent>{EDUCATION_LEVELS.map(el => <SelectItem key={el.value} value={el.value}>{el.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <FormField control={form.control} name="academicScores.cgpa" render={({ field }) => (
                    <FormItem><FormLabel>CGPA</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} onChange={handleNumericInputChange(field.onChange, true)} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="academicScores.cgpaScale" render={({ field }) => (
                    <FormItem><FormLabel>CGPA Scale (e.g., 4 or 10)</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={handleNumericInputChange(field.onChange)} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="academicScores.percentage" render={({ field }) => (
                    <FormItem><FormLabel>Percentage (%)</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} onChange={handleNumericInputChange(field.onChange, true)} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </section>

              {/* Exam Scores */}
              <section>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-primary">Standardized Exam Scores</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="examResults.gre.total" render={({ field }) => (
                    <FormItem><FormLabel>GRE Total Score</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={handleNumericInputChange(field.onChange)}/></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="examResults.toefl" render={({ field }) => (
                    <FormItem><FormLabel>TOEFL Total Score</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={handleNumericInputChange(field.onChange)} /></FormControl><FormMessage /></FormItem>
                  )} />
                  {/* Add other exams (GMAT, IELTS, SAT, ACT) similarly */}
                </div>
              </section>

              {/* Preferences */}
              <section>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-primary">College Preferences</h3>
                
                <FormItem className="mb-6">
                  <FormLabel>Preferred Majors</FormLabel>
                  {majorFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 mb-2">
                      <FormField
                        control={form.control}
                        name={`preferences.preferredMajors.${index}`}
                        render={({ field: itemField }) => (
                           <Select onValueChange={itemField.onChange} defaultValue={itemField.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a major" /></SelectTrigger></FormControl>
                            <SelectContent>{MAJORS_SAMPLE.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                          </Select>
                        )}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeMajor(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendMajor("")}><PlusCircle className="mr-2 h-4 w-4" />Add Major</Button>
                   <FormMessage>{form.formState.errors.preferences?.preferredMajors?.message}</FormMessage>
                </FormItem>
                
                <FormItem className="mb-6">
                  <FormLabel>Preferred Countries</FormLabel>
                   {countryFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 mb-2">
                       <FormField
                        control={form.control}
                        name={`preferences.preferredCountries.${index}`}
                        render={({ field: itemField }) => (
                          <Select onValueChange={itemField.onChange} defaultValue={itemField.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl>
                            <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                          </Select>
                        )}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeCountry(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendCountry("")}><PlusCircle className="mr-2 h-4 w-4" />Add Country</Button>
                  <FormMessage>{form.formState.errors.preferences?.preferredCountries?.message}</FormMessage>
                </FormItem>

                <FormField control={form.control} name="preferences.financialStatus" render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Financial Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>{FINANCIAL_STATUS_OPTIONS.map(fs => <SelectItem key={fs.value} value={fs.value}>{fs.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </section>

              {/* Additional Information */}
              <section>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-primary">Additional Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="workExperienceYears" render={({ field }) => (
                        <FormItem><FormLabel>Work Experience (Years)</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={handleNumericInputChange(field.onChange)} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="extracurriculars" render={({ field }) => (
                    <FormItem className="mt-6"><FormLabel>Extracurricular Activities / Achievements</FormLabel><FormControl><Textarea placeholder="e.g., President of Debate Club, Hackathon participation" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="statementOfPurpose" render={({ field }) => (
                    <FormItem className="mt-6"><FormLabel>Brief Statement of Purpose / Goals</FormLabel><FormControl><Textarea placeholder="Your career aspirations and academic goals..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </section>

              <div className="flex justify-end pt-8 border-t">
                <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-5 w-5" />
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
