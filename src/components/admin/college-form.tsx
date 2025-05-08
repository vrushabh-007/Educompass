"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { College } from '@/lib/types';
import { COUNTRIES, EXAM_OPTIONS } from "@/lib/constants";
import { PlusCircle, Save, Trash2, X } from "lucide-react";

const collegeFormSchema = z.object({
  name: z.string().min(3, "College name must be at least 3 characters."),
  location: z.string().min(2, "Location is required."),
  country: z.string({ required_error: "Country is required." }) as z.ZodType<College['country']>,
  description: z.string().min(10, "Description must be at least 10 characters."),
  imageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  acceptanceRate: z.preprocess(
    (val) => (val === "" ? undefined : parseFloat(String(val))),
    z.number().min(0).max(100).optional()
  ),
  tuitionFees: z.object({
    amount: z.preprocess(
      (val) => (val === "" ? undefined : parseFloat(String(val))),
      z.number().min(0).optional()
    ),
    currency: z.string().optional(),
    period: z.enum(["annual", "semester", "total"]).optional(),
  }).optional(),
  financialAidAvailable: z.boolean().optional().default(false),
  popularPrograms: z.array(z.string().min(1, "Program name cannot be empty.")).optional(),
  ranking: z.string().optional(),
  website: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  admissionDeadline: z.string().optional(),
  requiredExams: z.array(z.string()).optional(),
  campusLife: z.string().optional(),
});

type CollegeFormValues = z.infer<typeof collegeFormSchema>;

interface CollegeFormProps {
  onSubmit: (data: CollegeFormValues) => void;
  initialData?: College | null;
  onCancel: () => void;
}

export function CollegeForm({ onSubmit, initialData, onCancel }: CollegeFormProps) {
  const form = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      // Ensure arrays are initialized for useFieldArray
      popularPrograms: initialData.popularPrograms || [],
      requiredExams: initialData.requiredExams || [],
    } : {
      popularPrograms: [],
      requiredExams: [],
      financialAidAvailable: false,
      tuitionFees: { currency: 'USD', period: 'annual'}
    },
  });

  const { fields: programFields, append: appendProgram, remove: removeProgram } = useFieldArray({
    control: form.control,
    name: "popularPrograms"
  });

  const { fields: examFields, append: appendExam, remove: removeExam } = useFieldArray({
    control: form.control,
    name: "requiredExams"
  });

  const handleSubmit = (data: CollegeFormValues) => {
    // Ensure optional empty strings are treated as undefined
    const processedData = {
      ...data,
      imageUrl: data.imageUrl === '' ? undefined : data.imageUrl,
      website: data.website === '' ? undefined : data.website,
    };
    onSubmit(processedData as College); // Cast because Zod schema optional != type optional sometimes
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>College Name *</FormLabel><FormControl><Input placeholder="e.g., Harvard University" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem><FormLabel>Location *</FormLabel><FormControl><Input placeholder="e.g., Cambridge, MA" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <FormField control={form.control} name="country" render={({ field }) => (
          <FormItem><FormLabel>Country *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
              <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Description *</FormLabel><FormControl><Textarea placeholder="A brief description of the college..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="imageUrl" render={({ field }) => (
          <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input type="url" placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="website" render={({ field }) => (
          <FormItem><FormLabel>Website URL</FormLabel><FormControl><Input type="url" placeholder="https://college.edu" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="acceptanceRate" render={({ field }) => (
            <FormItem><FormLabel>Acceptance Rate (%)</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g., 15.5" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="ranking" render={({ field }) => (
            <FormItem><FormLabel>Ranking</FormLabel><FormControl><Input placeholder="e.g., Top 10 in Engineering" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <h4 className="text-md font-semibold pt-2 border-t">Tuition & Fees</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <FormField control={form.control} name="tuitionFees.amount" render={({ field }) => (
            <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 50000" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="tuitionFees.currency" render={({ field }) => (
            <FormItem><FormLabel>Currency</FormLabel><FormControl><Input placeholder="e.g., USD, INR" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="tuitionFees.period" render={({ field }) => (
            <FormItem><FormLabel>Period</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger></FormControl>
                <SelectContent>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="semester">Semester</SelectItem>
                    <SelectItem value="total">Total Program</SelectItem>
                </SelectContent>
              </Select>
            <FormMessage /></FormItem>
          )} />
        </div>
         <FormField control={form.control} name="financialAidAvailable" render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              <FormLabel className="font-normal">Financial Aid Available</FormLabel>
            </FormItem>
        )} />

        <h4 className="text-md font-semibold pt-2 border-t">Academics & Admissions</h4>
        <FormField control={form.control} name="admissionDeadline" render={({ field }) => (
            <FormItem><FormLabel>Admission Deadline</FormLabel><FormControl><Input placeholder="e.g., January 15th" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <div>
          <FormLabel>Popular Programs</FormLabel>
          {programFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mt-2">
              <FormField control={form.control} name={`popularPrograms.${index}`} render={({ field: itemField }) => (
                  <Input placeholder="e.g., Computer Science" {...itemField} />
              )} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeProgram(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => appendProgram("")} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" />Add Program</Button>
        </div>

        <div>
          <FormLabel>Required Exams</FormLabel>
           {examFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mt-2">
              <FormField control={form.control} name={`requiredExams.${index}`} render={({ field: itemField }) => (
                <Select onValueChange={itemField.onChange} defaultValue={itemField.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger></FormControl>
                    <SelectContent>{EXAM_OPTIONS.map(exam => <SelectItem key={exam} value={exam}>{exam}</SelectItem>)}</SelectContent>
                </Select>
              )} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeExam(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => appendExam("")} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" />Add Exam</Button>
        </div>
        
        <FormField control={form.control} name="campusLife" render={({ field }) => (
          <FormItem><FormLabel>Campus Life</FormLabel><FormControl><Textarea placeholder="Briefly describe campus life, clubs, activities..." {...field} rows={3} /></FormControl><FormMessage /></FormItem>
        )} />


        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" /> {form.formState.isSubmitting ? "Saving..." : (initialData ? "Save Changes" : "Add College")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
