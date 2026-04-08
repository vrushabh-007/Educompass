"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { mockColleges } from '@/data/mock-colleges';
import type { College } from '@/lib/types';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { PlusCircle, Edit2, Trash2, Search, University, FileDown } from 'lucide-react';
import { CollegeForm } from '@/components/admin/college-form'; // To be created
import { toast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export default function ManageCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Load initial data (in a real app, this would be an API call)
    setColleges(mockColleges);
  }, []);

  const filteredColleges = useMemo(() => {
    return colleges.filter(college =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [colleges, searchTerm]);

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

  const handleAddCollege = () => {
    setEditingCollege(null);
    setIsFormOpen(true);
  };

  const handleEditCollege = (college: College) => {
    setEditingCollege(college);
    setIsFormOpen(true);
  };

  const handleDeleteCollege = (collegeId: string) => {
    // TODO: Implement actual delete logic with API call
    setColleges(prev => prev.filter(c => c.id !== collegeId));
    toast({ title: "College Deleted", description: "The college has been removed.", variant: "destructive" });
  };

  const handleFormSubmit = (collegeData: College) => {
    if (editingCollege) {
      // Update existing college
      setColleges(prev => prev.map(c => c.id === editingCollege.id ? { ...c, ...collegeData } : c));
      toast({ title: "College Updated", description: `${collegeData.name} has been updated.` });
    } else {
      // Add new college
      const newCollege = { ...collegeData, id: String(Date.now()) }; // Simple ID generation
      setColleges(prev => [newCollege, ...prev]);
      toast({ title: "College Added", description: `${collegeData.name} has been added.` });
    }
    setIsFormOpen(false);
    setEditingCollege(null);
  };
  
  const handleExportColleges = () => {
    // Placeholder for CSV export logic
    const headers = ["ID", "Name", "Location", "Country", "Acceptance Rate", "Website"];
    const rows = colleges.map(c => [c.id, c.name, c.location, c.country, c.acceptanceRate || 'N/A', c.website || 'N/A'].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "colleges_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Colleges Exported", description: "College data has been exported as CSV." });
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <University className="mr-3 h-8 w-8 text-primary" /> Manage Colleges
          </h1>
          <p className="text-muted-foreground">Add, edit, or remove college information from the platform.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportColleges} variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Export Colleges
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddCollege}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New College
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCollege ? 'Edit College' : 'Add New College'}</DialogTitle>
                <DialogDescription>
                  {editingCollege ? 'Update the details of this college.' : 'Fill in the form to add a new college to the database.'}
                </DialogDescription>
              </DialogHeader>
              <CollegeForm
                onSubmit={handleFormSubmit}
                initialData={editingCollege}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search colleges by name, location, country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full md:w-1/2 lg:w-1/3"
        />
      </div>

      <div className="rounded-lg border overflow-hidden bg-card shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-center">Acceptance Rate</TableHead>
              <TableHead className="text-right w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedColleges.length > 0 ? paginatedColleges.map((college) => (
              <TableRow key={college.id}>
                <TableCell className="font-medium">{college.name}</TableCell>
                <TableCell>{college.location}</TableCell>
                <TableCell>{college.country}</TableCell>
                <TableCell className="text-center">{college.acceptanceRate ? `${college.acceptanceRate}%` : 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEditCollege(college)} className="mr-2 hover:text-primary">
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the college
                          &quot;{college.name}&quot; and remove its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCollege(college.id)} className="bg-destructive hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No colleges found matching your search criteria.
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
    </div>
  );
}
