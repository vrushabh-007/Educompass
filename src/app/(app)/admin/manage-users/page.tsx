"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Users, MoreHorizontal, UserPlus, UserCog, Trash2, ShieldCheck, UserCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  joinedDate: string; // ISO string
  status: 'active' | 'suspended';
}

// Mock user data
const mockUsers: User[] = [
  { id: 'user1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'student', joinedDate: new Date('2023-01-15').toISOString(), status: 'active' },
  { id: 'user2', name: 'Bob The Builder', email: 'bob@example.com', role: 'student', joinedDate: new Date('2023-03-22').toISOString(), status: 'active' },
  { id: 'user3', name: 'Charlie Admin', email: 'charlie@example.com', role: 'admin', joinedDate: new Date('2022-11-01').toISOString(), status: 'active' },
  { id: 'user4', name: 'Diana Prince', email: 'diana@example.com', role: 'student', joinedDate: new Date('2023-05-10').toISOString(), status: 'suspended' },
  { id: 'user5', name: 'Edward Scissorhands', email: 'edward@example.com', role: 'student', joinedDate: new Date('2023-06-01').toISOString(), status: 'active' },
];

const ITEMS_PER_PAGE = 10;

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // Add states for modal/dialogs for add/edit user if needed

  useEffect(() => {
    // Load initial data
    setUsers(mockUsers);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRoleChange = (userId: string, newRole: 'student' | 'admin') => {
    // TODO: API call to change role
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast({ title: "User Role Updated", description: `User role changed to ${newRole}.` });
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended') => {
    // TODO: API call to change status
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    toast({ title: "User Status Updated", description: `User status changed to ${newStatus}.` });
  };
  
  const handleDeleteUser = (userId: string) => {
    // TODO: API call to delete user
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast({ title: "User Deleted", description: "User has been removed.", variant: "destructive"});
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Users className="mr-3 h-8 w-8 text-primary" /> Manage Users
          </h1>
          <p className="text-muted-foreground">View, edit roles, and manage platform users.</p>
        </div>
        {/* Add User Button - Placeholder for future dialog */}
        {/* <Button> <UserPlus className="mr-2 h-4 w-4" /> Add New User </Button> */}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users by name, email, role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full md:w-1/2 lg:w-1/3"
        />
      </div>

      <div className="rounded-lg border overflow-hidden bg-card shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                    {user.role === 'admin' ? <ShieldCheck className="mr-1 h-3 w-3" /> : <UserCircle className="mr-1 h-3 w-3" /> }
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                   <Badge variant={user.status === 'active' ? 'outline' : 'destructive'} className={`capitalize ${user.status === 'active' ? 'border-green-500 text-green-600' : ''}`}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {user.role === 'student' && <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>Make Admin</DropdownMenuItem>}
                      {user.role === 'admin' && <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'student')}>Make Student</DropdownMenuItem>}
                      {user.status === 'active' && <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'suspended')}>Suspend User</DropdownMenuItem>}
                      {user.status === 'suspended' && <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>Reactivate User</DropdownMenuItem>}
                      <DropdownMenuSeparator />
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                           </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete user &quot;{user.name}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">
                              Delete User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
               <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found matching your search criteria.
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
