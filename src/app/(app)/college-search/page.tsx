"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { CollegeCard } from '@/components/college-card';
import { CollegeFilters, type CollegeFilterValues } from '@/components/college-filters';
import { mockColleges } from '@/data/mock-colleges';
import type { College } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListFilter, Search, Download, LayoutGrid, List } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ITEMS_PER_PAGE = 9;

export default function CollegeSearchPage() {
  const [allColleges] = useState<College[]>(mockColleges);
  const [filteredColleges, setFilteredColleges] = useState<College[]>(allColleges);
  const [filters, setFilters] = useState<CollegeFilterValues>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    let result = allColleges;

    // Search term filter
    if (searchTerm) {
      result = result.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (college.popularPrograms && college.popularPrograms.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply advanced filters
    if (filters.countries && filters.countries.length > 0) {
      result = result.filter(college => filters.countries!.includes(college.country));
    }
    if (filters.financialStatus) {
      // This requires more complex logic depending on how financialStatus is mapped to college data
      // For now, let's assume a placeholder or simplify
      // e.g., if (college.financialAidAvailable && filters.financialStatus === 'Low') { /* keep */ }
    }
    if (filters.minAcceptanceRate !== undefined) {
      result = result.filter(college => (college.acceptanceRate || 100) >= filters.minAcceptanceRate!);
    }
    if (filters.maxTuition !== undefined) {
       result = result.filter(college => (college.tuitionFees?.amount || 0) <= filters.maxTuition!);
    }
    if (filters.major) {
      result = result.filter(college => college.popularPrograms?.some(p => p.toLowerCase().includes(filters.major!.toLowerCase())));
    }
    if (filters.financialAidAvailable !== undefined) {
      result = result.filter(college => college.financialAidAvailable === filters.financialAidAvailable);
    }

    setFilteredColleges(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [allColleges, filters, searchTerm]);

  const paginatedColleges = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredColleges.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredColleges, currentPage]);

  const totalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // Placeholder for export functionality
    alert(`Exporting as ${format}... (Not implemented)`);
    console.log("Colleges to export:", filteredColleges);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Explore Colleges</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Find the perfect institution that matches your aspirations and qualifications.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar (Desktop) */}
        <div className="w-full md:w-1/4 lg:w-1/5 hidden md:block">
          <CollegeFilters onFilterChange={setFilters} />
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <div className="mb-6 p-4 bg-card rounded-lg shadow">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by college name, program, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Filters Button (Mobile) */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto md:hidden">
                    <ListFilter className="mr-2 h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter Colleges</SheetTitle>
                    <SheetDescription>Refine your search criteria.</SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <CollegeFilters onFilterChange={(newFilters) => {
                      setFilters(newFilters);
                      // Potentially close sheet on apply: sheetContext.setOpen(false)
                    }} />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex gap-2 items-center">
                <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'text-primary bg-muted' : ''}>
                  <LayoutGrid className="h-5 w-5" />
                  <span className="sr-only">Grid View</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'text-primary bg-muted' : ''}>
                  <List className="h-5 w-5" />
                  <span className="sr-only">List View</span>
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {paginatedColleges.length > 0 ? (
            <>
              <div className={`gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
                {paginatedColleges.map(college => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (totalPages <= 5 || Math.abs(pageNum - currentPage) < 2 || pageNum === 1 || pageNum === totalPages) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if ( (pageNum === 2 && currentPage > 3) || (pageNum === totalPages -1 && currentPage < totalPages - 2) ) {
                        return <PaginationEllipsis key={`ellipsis-${pageNum}`} />;
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">No Colleges Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
