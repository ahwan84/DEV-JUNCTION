'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { BarChart3, Calendar, FileText, Heart, LayoutDashboard, Megaphone, ShieldCheck, Users } from "lucide-react";

export function MobileSidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on route change
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <div className="p-6 border-b">
                    <Link href="/admin/dashboard" className="flex items-center space-x-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">Admin Panel</span>
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/volunteers" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
                        <Users className="h-5 w-5" />
                        Volunteers
                    </Link>
                    <Link href="/admin/events" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
                        <Calendar className="h-5 w-5" />
                        Events
                    </Link>
                    <Link href="/admin/donations" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
                        <Heart className="h-5 w-5" />
                        Donations
                    </Link>
                    <Link href="/admin/announcements" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
                        <Megaphone className="h-5 w-5" />
                        Announcements
                    </Link>
                    <Link href="/admin/audit" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
                        <FileText className="h-5 w-5" />
                        Audit Logs
                    </Link>
                    <Link href="/admin/staff" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
                        <ShieldCheck className="h-5 w-5" />
                        Staff Management
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">
                        View Public Site
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
}
