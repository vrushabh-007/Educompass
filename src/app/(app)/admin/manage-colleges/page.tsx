"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { UniversityAPIResponse } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, University, FileDown, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { createClient } from '@/lib/supabase/client';

const ITEMS_PER_PAGE = 10;

export default function ManageCollegesPage() {
  const [colleges, setColleges] = useState<UniversityAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const supabase = createClient();

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      const res = await fetch('/api/universities?sortBy=worldranking');
      if (res.ok) {
        const { data } = await res.json();
        setColleges(data || []);
      } else {
        toast({ title: "Error", description: "Failed to load colleges from database.", variant: "destructive" });
      }
      setLoading(false);
    };
    fetchColleges();
  }, []);

  const filteredColleges = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return colleges.filter(c =>
      c.name.toLowerCase().includes(lower) ||
      c.country.toLowerCase().includes(lower) ||
      (c.location || '').toLowerCase().includes(lower)
    );
  }, [colleges, searchTerm]);

  const paginatedColleges = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredColleges.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredColleges, currentPage]);

  const totalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDeleteCollege = async (collegeId: string, collegeName: string) => {
    const { error } = await supabase.from('University').delete().eq('id', collegeId);
    if (error) {
      toast({ title: "Error", description: `Failed to delete ${collegeName}.`, variant: "destructive" });
    } else {
      setColleges(prev => prev.filter(c => c.id !== collegeId));
      toast({ title: "College Deleted", description: `${collegeName} has been removed.`, variant: "destructive" });
    }
  };

  const handleExportColleges = () => {
    const headers = ["ID", "Name", "Location", "Country", "World Ranking", "Min CGPA", "Website"];
    const rows = colleges.map(c => [
      c.id, c.name,
      c.location || 'N/A',
      c.country,
      c.worldranking ?? 'N/A',
      c.mincgpa ?? 'N/A',
      c.webpages?.[0] || 'N/A'
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "colleges_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Exported", description: "College data exported as CSV." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <University className="mr-3 h-8 w-8 text-primary" /> Manage Colleges
          </h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${filteredColleges.length} universities in the database.`}
          </p>
        </div>
        <Button onClick={handleExportColleges} variant="outline" disabled={loading}>
          <FileDown className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, location, country..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="pl-10 w-full md:w-1/2 lg:w-1/3"
        />
      </div>

      <div className="rounded-lg border overflow-hidden bg-card shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-center">World Ranking</TableHead>
              <TableHead className="text-center">Min CGPA</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="inline h-5 w-5 animate-spin mr-2" /> Loading universities...
                </TableCell>
              </TableRow>
            ) : paginatedColleges.length > 0 ? paginatedColleges.map((college) => (
              <TableRow key={college.id}>
                <TableCell className="font-medium">{college.name}</TableCell>
                <TableCell>{college.country}</TableCell>
                <TableCell>{college.location || '—'}</TableCell>
                <TableCell className="text-center">{college.worldranking ?? '—'}</TableCell>
                <TableCell className="text-center">{college.mincgpa ?? '—'}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:text-destructive text-xs">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete &quot;{college.name}&quot; from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCollege(college.id, college.name)} className="bg-destructive hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No universities found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
              } else if ((pageNum === 2 && currentPage > 3) || (pageNum === totalPages - 1 && currentPage < totalPages - 2)) {
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
    </div>
  );
}
