import Link from "next/link";
import { BarChart3, Calendar, FileText, Heart, LayoutDashboard, Megaphone, ShieldCheck, Users } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed h-full">
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
                </nav>

                <div className="p-4 border-t">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">
                        View Public Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
