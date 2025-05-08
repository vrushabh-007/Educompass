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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { COUNTRIES, FINANCIAL_STATUS_OPTIONS, EXAM_OPTIONS, MAJORS_SAMPLE } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, RotateCcw } from 'lucide-react';

export interface CollegeFilterValues {
  searchTerm?: string;
  countries?: string[];
  financialStatus?: string;
  minAcceptanceRate?: number;
  maxTuition?: number;
  requiredExams?: string[];
  major?: string;
  financialAidAvailable?: boolean;
}

const filterSchema = z.object({
  searchTerm: z.string().optional(),
  countries: z.array(z.string()).optional(),
  financialStatus: z.string().optional(),
  minAcceptanceRate: z.number().min(0).max(100).optional(),
  maxTuition: z.number().min(0).optional(),
  requiredExams: z.array(z.string()).optional(),
  major: z.string().optional(),
  financialAidAvailable: z.boolean().optional(),
});

interface CollegeFiltersProps {
  onFilterChange: (filters: CollegeFilterValues) => void;
  initialFilters?: Partial<CollegeFilterValues>;
}

const defaultFilters: CollegeFilterValues = {
  searchTerm: "",
  countries: [],
  financialStatus: undefined,
  minAcceptanceRate: 0,
  maxTuition: 200000, // Default max tuition, adjust as needed
  requiredExams: [],
  major: undefined,
  financialAidAvailable: undefined,
};

export function CollegeFilters({ onFilterChange, initialFilters }: CollegeFiltersProps) {
  const form = useForm<CollegeFilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { ...defaultFilters, ...initialFilters },
  });
  
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  function onSubmit(values: CollegeFilterValues) {
    onFilterChange(values);
  }

  function handleReset() {
    form.reset(defaultFilters);
    onFilterChange(defaultFilters);
  }

  return (
    <Card className="shadow-lg sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-6 w-6 text-primary" />
          Filter Colleges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search by Name/Keyword</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., MIT, Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Major/Program</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a major" />
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
              name="countries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  {/* For simplicity, using a single select. Multi-select can be implemented with a custom component or library */}
                  <Select
                    onValueChange={(value) => field.onChange(value ? [value] : [])} 
                    value={field.value?.[0]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
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
            
            <Button type="button" variant="link" onClick={() => setShowMoreFilters(!showMoreFilters)} className="p-0 text-primary">
              {showMoreFilters ? "Hide" : "Show"} Advanced Filters
            </Button>

            {showMoreFilters && (
              <div className="space-y-6 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="financialStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Financial Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select financial status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FINANCIAL_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
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
                  name="minAcceptanceRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min. Acceptance Rate: {field.value || 0}%</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value || 0]}
                          max={100}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxTuition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max. Tuition (USD equivalent): ${ (field.value || 0).toLocaleString()}</FormLabel>
                      <FormControl>
                         <Slider
                          defaultValue={[field.value || 0]}
                          max={200000} // Adjust max tuition as needed
                          step={5000}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="financialAidAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Financial Aid Available
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                 {/* Add required exams filter here if needed, e.g., using multi-select checkboxes */}
              </div>
            )}


            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" className="w-full flex-1">
                <Filter className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} className="w-full flex-1">
                 <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
