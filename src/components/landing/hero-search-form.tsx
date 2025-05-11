

"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COUNTRIES, EDUCATION_LEVELS, MAJORS_SAMPLE } from "@/lib/constants";
import { useRouter } from "next/navigation";

const heroSearchFormSchema = z.object({
  studyLevel: z.string().optional(),
  destination: z.string().optional(),
  subject: z.string().optional(),
  cgpa: z.number().min(7).max(10).optional().default(7.0),
  includeScholarships: z.boolean().optional().default(false),
});

type HeroSearchFormValues = z.infer<typeof heroSearchFormSchema>;

export function HeroSearchForm() {
  const router = useRouter();
  const [cgpaValue, setCgpaValue] = useState(7.0);

  const form = useForm<HeroSearchFormValues>({
    resolver: zodResolver(heroSearchFormSchema),
    defaultValues: {
      studyLevel: "",
      destination: "",
      subject: "",
      cgpa: 7.0,
      includeScholarships: false,
    },
  });

  function onSubmit(values: HeroSearchFormValues) {
    console.log("Hero search form submitted:", values);
    const queryParams = new URLSearchParams();
    if (values.studyLevel) queryParams.set("studyLevel", values.studyLevel);
    if (values.destination) queryParams.set("country", values.destination);
    if (values.subject) queryParams.set("subject", values.subject);
    if (values.cgpa) queryParams.set("minCGPA", values.cgpa.toString());
    if (values.includeScholarships) queryParams.set("scholarships", "true");
    
    router.push(`/college-search?${queryParams.toString()}`);
  }

  return (
    <Card className="w-full max-w-md bg-transparent/30 backdrop-blur-md shadow-2xl border-border/30">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-card-foreground">
          Find Your Perfect University
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="studyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground/80">Study Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input/50 backdrop-blur-sm text-foreground border-border/50">
                        <SelectValue placeholder="Select Study Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EDUCATION_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground/80">Destination</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input/50 backdrop-blur-sm text-foreground border-border/50">
                        <SelectValue placeholder="Select Destination" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground/80">Subject</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input/50 backdrop-blur-sm text-foreground border-border/50">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MAJORS_SAMPLE.map((major) => (
                        <SelectItem key={major} value={major}>
                          {major}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cgpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground/80">
                    CGPA (Minimum: {cgpaValue.toFixed(1)})
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value || 7.0]}
                      min={7}
                      max={10}
                      step={0.1}
                      onValueChange={(value) => {
                        field.onChange(value[0]);
                        setCgpaValue(value[0]);
                      }}
                      className="[&>span:first-child]:bg-primary/30 [&_[role=slider]]:bg-primary"
                    />
                  </FormControl>
                   <div className="flex justify-between text-xs text-card-foreground/70 mt-1">
                    <span>7.0</span>
                    <span>10.0</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeScholarships"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-card-foreground/80">
                    Include scholarships
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base">
              Discover
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

