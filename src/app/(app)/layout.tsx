
"use client";

import Link from "next/link";
import {
  Home,
  Search,
  UserCircle,
  Settings,
  LogOut,
  ListFilter,
  BookOpen,
  Brain, 
  LayoutDashboard,
  Users,
  University,
  BarChart3,
  FileText,
  Menu,
  FileSignature,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { AppLogo } from "@/components/shared/app-logo";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; 
import imageData from '@/lib/placeholder-images.json';
import { ThemeToggle } from "@/components/shared/theme-toggle";

// Mock user data, replace with actual auth state
const MOCK_USER = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatar: imageData['user-avatars']['jane-doe'],
  role: "student", // or "admin"
};

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: ('student' | 'admin')[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ['student', 'admin'] },
  { href: "/college-search", label: "College Search", icon: Search, roles: ['student', 'admin'] },
  { href: "/my-profile", label: "My Profile", icon: UserCircle, roles: ['student'] },
  { href: "/recommendations", label: "AI Recommendations", icon: Brain, roles: ['student'] },
  { href: "/sop-assistant", label: "SOP Assistant", icon: FileSignature, roles: ['student'] },
  { href: "/alumni-network", label: "Alumni Network", icon: UserCheck, roles: ['student'] },
  { href: "/admin/manage-colleges", label: "Manage Colleges", icon: University, roles: ['admin'] },
  { href: "/admin/manage-users", label: "Manage Users", icon: Users, roles: ['admin'] },
  { href: "/admin/analytics", label: "Platform Analytics", icon: BarChart3, roles: ['admin'] },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<typeof MOCK_USER | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching user data
    setUser(MOCK_USER);
  }, []);

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role as 'student' | 'admin'));

  if (!user) {
    // Optional: Add a loading skeleton or redirect to login
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-4 lg:px-6">
            <AppLogo />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === item.href
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <ThemeToggle />
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <div className="flex h-16 items-center border-b px-4 lg:px-6 mb-4" onClick={() => setIsMobileNavOpen(false)}>
                  <AppLogo />
                </div>
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                      pathname === item.href ? "bg-muted text-foreground" : ""
                    }`}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
               <div className="mt-auto p-4">
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Optional: Global Search Bar */}
            {/* <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search colleges, courses..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form> */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar} alt={user.name} className="rounded-full h-8 w-8" data-ai-hint="user avatar" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/my-profile" className="cursor-pointer">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                 {/* TODO: Implement actual logout */}
                <Link href="/" className="cursor-pointer">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40 overflow-auto shadow-[inset_0_0_10px_0_hsl(var(--background)/0.6)]">
          {children}
        </main>
      </div>
    </div>
  );
}
