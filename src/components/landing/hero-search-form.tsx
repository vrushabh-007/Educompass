"use client";

import React from "react";
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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { COUNTRIES, EDUCATION_LEVELS, MAJORS_SAMPLE } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";

const heroSearchFormSchema = z.object({
  keyword: z.string().optional(),
  studyLevel: z.string().optional(),
  destination: z.string().optional(),
  subject: z.string().optional(),
});

type HeroSearchFormValues = z.infer<typeof heroSearchFormSchema>;

export function HeroSearchForm() {
  const router = useRouter();

  const form = useForm<HeroSearchFormValues>({
    resolver: zodResolver(heroSearchFormSchema),
    defaultValues: {
      keyword: "",
      studyLevel: "",
      destination: "",
      subject: "",
    },
  });

  function onSubmit(values: HeroSearchFormValues) {
    const queryParams = new URLSearchParams();
    if (values.keyword) queryParams.set("keyword", values.keyword);
    if (values.studyLevel) queryParams.set("studyLevel", values.studyLevel);
    if (values.destination) queryParams.set("country", values.destination);
    if (values.subject) queryParams.set("subject", values.subject);
    
    router.push(`/college-search?${queryParams.toString()}`);
  }

  return (
    <Card className="w-full bg-background/80 backdrop-blur-md shadow-2xl border">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end gap-4">
             <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel className="text-foreground/80 text-xs">University or Course</FormLabel>
                  <FormControl>
                    <Input placeholder="Search..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                   <FormLabel className="text-foreground/80 text-xs">Destination</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 text-xs">Subject</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Subject" />
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
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full sm:w-auto lg:w-full">
              Search
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
