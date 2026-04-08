
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
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; 
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Assuming a 'profiles' table exists with user details
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(userProfile || { full_name: user.email, avatar_url: '' });
      } else {
         router.push('/login');
      }
      setLoading(false);
    };
    fetchUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const userRole = profile?.role || 'student'; // Default to 'student' role
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  if (loading || !user) {
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
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile?.full_name || user.email}`} alt={profile?.full_name || 'User Avatar'} className="rounded-full h-8 w-8" data-ai-hint="user avatar" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{profile?.full_name || user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/my-profile" className="cursor-pointer">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                 Logout
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
